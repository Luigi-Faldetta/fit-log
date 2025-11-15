/**
 * AI Service
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for AI/OpenAI integration business logic
 * - Handles OpenAI API calls
 * - Handles prompt engineering and response parsing
 * - No HTTP concerns (request/response)
 * - Throws errors for controllers to handle
 */

const OpenAI = require('openai');
const { AppError, ValidationError } = require('../middleware/errorHandler');
const {
  AGE_LIMITS,
  DURATION_LIMITS,
  EXPERIENCE_LEVELS,
  AI_CONFIG
} = require('../constants/validation');

class AIService {
  constructor() {
    // Initialize OpenAI client
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Configuration constants from centralized config
    this.MODEL = AI_CONFIG.MODEL;
    this.MAX_TOKENS = AI_CONFIG.MAX_TOKENS;
    this.TEMPERATURE = AI_CONFIG.TEMPERATURE;
  }

  /**
   * Validate workout generation parameters
   * @param {Object} params - Workout generation parameters
   * @throws {ValidationError} - If parameters are invalid
   */
  validateWorkoutParams(params) {
    const { age, experienceLevel, goal, duration } = params;

    if (!age || isNaN(age) || age < AGE_LIMITS.MIN || age > AGE_LIMITS.MAX) {
      throw new ValidationError(`Age must be between ${AGE_LIMITS.MIN} and ${AGE_LIMITS.MAX}`);
    }

    if (!experienceLevel || typeof experienceLevel !== 'string') {
      throw new ValidationError('Experience level is required');
    }

    if (!EXPERIENCE_LEVELS.includes(experienceLevel.toLowerCase())) {
      throw new ValidationError(`Experience level must be one of: ${EXPERIENCE_LEVELS.join(', ')}`);
    }

    if (!goal || typeof goal !== 'string' || goal.trim().length === 0) {
      throw new ValidationError('Goal is required');
    }

    if (!duration || isNaN(duration) || duration < DURATION_LIMITS.MIN || duration > DURATION_LIMITS.MAX) {
      throw new ValidationError(`Duration must be between ${DURATION_LIMITS.MIN} and ${DURATION_LIMITS.MAX} minutes`);
    }
  }

  /**
   * Get JSON schema for structured workout output
   * Uses short field names to minimize token usage
   * @returns {Object} - JSON schema for workout structure
   */
  getWorkoutSchema() {
    return {
      type: 'object',
      properties: {
        nm: { type: 'string', description: 'Workout name' },
        ex: {
          type: 'array',
          description: 'List of exercises',
          items: {
            type: 'object',
            properties: {
              n: { type: 'string', description: 'Exercise name' },
              s: { type: 'integer', description: 'Sets', minimum: 1, maximum: 10 },
              r: { type: 'integer', description: 'Reps', minimum: 1, maximum: 100 },
              w: { type: 'integer', description: 'Weight in lbs (0 for bodyweight)', minimum: 0 },
              rt: { type: 'integer', description: 'Rest seconds', minimum: 0, maximum: 300 }
            },
            required: ['n', 's', 'r'],
            additionalProperties: false
          },
          minItems: 1
        }
      },
      required: ['nm', 'ex'],
      additionalProperties: false
    };
  }

  /**
   * Build optimized workout generation prompt (minified for token efficiency)
   * @param {Object} params - Workout generation parameters
   * @returns {Array} - Messages for OpenAI
   */
  buildWorkoutPrompt(params) {
    const { age, experienceLevel, goal, duration } = params;

    // Minified system message - removed punctuation, shortened instructions
    const systemMessage = {
      role: 'system',
      content: `Expert fitness trainer. Create safe effective workouts for ${experienceLevel} level. Match exercises to experience. Keep within ${duration}min duration`
    };

    // Minified user message - removed fluff words like "please", "detailed"
    const userMessage = {
      role: 'user',
      content: `Age ${age}, ${experienceLevel}, goal: ${goal}, ${duration}min workout`
    };

    return [systemMessage, userMessage];
  }

  /**
   * Generate AI workout plan
   * @param {Object} params - Workout generation parameters
   * @param {number} params.age - User's age
   * @param {string} params.experienceLevel - User's experience level
   * @param {string} params.goal - User's fitness goal
   * @param {number} params.duration - Workout duration in minutes
   * @returns {Promise<Object>} - Generated workout plan
   * @throws {ValidationError} - If parameters are invalid
   * @throws {AppError} - If OpenAI API fails
   */
  async generateWorkout(params) {
    // Validate parameters
    this.validateWorkoutParams(params);

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      throw new AppError('OpenAI API key not configured', 503);
    }

    try {
      const messages = this.buildWorkoutPrompt(params);

      // Use structured outputs with function calling for 50% token savings
      // strict: true ensures JSON schema compliance without extra tokens
      const response = await this.openai.chat.completions.create({
        model: this.MODEL,
        messages,
        max_tokens: this.MAX_TOKENS,
        temperature: this.TEMPERATURE,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'workout_plan',
            strict: true,
            schema: this.getWorkoutSchema()
          }
        }
      });

      const content = response.choices[0].message.content;

      if (!content || content.trim().length === 0) {
        throw new AppError('OpenAI returned empty response', 500);
      }

      // Parse the minified JSON response
      const workoutData = JSON.parse(content);

      // Transform short keys back to readable format for client
      const workout = {
        name: workoutData.nm,
        exercises: workoutData.ex.map(ex => ({
          name: ex.n,
          sets: ex.s,
          reps: ex.r,
          weight: ex.w || 0,
          rest: ex.rt || 60
        }))
      };

      return {
        workout,
        metadata: {
          model: this.MODEL,
          tokensUsed: response.usage?.total_tokens || 0,
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          generatedAt: new Date().toISOString(),
          parameters: params
        }
      };

    } catch (error) {
      // Handle OpenAI specific errors
      if (error.status === 401) {
        throw new AppError('Invalid OpenAI API key', 503);
      }

      if (error.status === 429) {
        throw new AppError('OpenAI rate limit exceeded. Please try again later.', 429);
      }

      if (error.status === 500) {
        throw new AppError('OpenAI service is currently unavailable', 503);
      }

      // If it's already an AppError or ValidationError, rethrow
      if (error.statusCode) {
        throw error;
      }

      // Generic error
      console.error('OpenAI API error:', error);
      throw new AppError('Failed to generate AI workout', 500);
    }
  }

  /**
   * Parse workout text into structured exercises (Legacy method - kept for backward compatibility)
   * Note: With structured outputs, this is no longer needed but kept for fallback
   * @param {string} workoutText - Raw workout text from AI
   * @returns {Array<Object>} - Parsed exercises
   */
  parseWorkoutText(workoutText) {
    if (!workoutText || typeof workoutText !== 'string') {
      return [];
    }

    const lines = workoutText.split('\n');
    const exercises = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines, headers, or non-exercise lines
      if (!trimmed || trimmed.startsWith('#') || trimmed.length < 5) {
        continue;
      }

      // Try to parse exercise format: "Exercise - Sets x Reps - Rest"
      const match = trimmed.match(/^(.+?)\s*-\s*(\d+)\s*x\s*(\d+)\s*-\s*(\d+)/i);

      if (match) {
        exercises.push({
          name: match[1].trim(),
          sets: parseInt(match[2], 10),
          reps: parseInt(match[3], 10),
          rest: parseInt(match[4], 10)
        });
      }
    }

    return exercises;
  }

  /**
   * Check if OpenAI service is available
   * @returns {Promise<boolean>} - True if service is available
   */
  async isAvailable() {
    if (!process.env.OPENAI_API_KEY) {
      return false;
    }

    try {
      // Simple API call to check availability
      await this.openai.models.list();
      return true;
    } catch (error) {
      console.error('OpenAI service unavailable:', error.message);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new AIService();
