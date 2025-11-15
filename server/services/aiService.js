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

class AIService {
  constructor() {
    // Initialize OpenAI client
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️  OPENAI_API_KEY not found in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Configuration constants
    this.MODEL = 'gpt-3.5-turbo';
    this.MAX_TOKENS = 500; // Increased for more detailed workouts
    this.TEMPERATURE = 0.7; // Balance between creativity and consistency
  }

  /**
   * Validate workout generation parameters
   * @param {Object} params - Workout generation parameters
   * @throws {ValidationError} - If parameters are invalid
   */
  validateWorkoutParams(params) {
    const { age, experienceLevel, goal, duration } = params;

    if (!age || isNaN(age) || age < 13 || age > 120) {
      throw new ValidationError('Age must be between 13 and 120');
    }

    if (!experienceLevel || typeof experienceLevel !== 'string') {
      throw new ValidationError('Experience level is required');
    }

    const validExperienceLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validExperienceLevels.includes(experienceLevel.toLowerCase())) {
      throw new ValidationError('Experience level must be beginner, intermediate, or advanced');
    }

    if (!goal || typeof goal !== 'string' || goal.trim().length === 0) {
      throw new ValidationError('Goal is required');
    }

    if (!duration || isNaN(duration) || duration < 10 || duration > 180) {
      throw new ValidationError('Duration must be between 10 and 180 minutes');
    }
  }

  /**
   * Build workout generation prompt
   * @param {Object} params - Workout generation parameters
   * @returns {Object} - System and user messages for OpenAI
   */
  buildWorkoutPrompt(params) {
    const { age, experienceLevel, goal, duration } = params;

    const systemMessage = {
      role: 'system',
      content: `You are an expert fitness trainer and workout planner. Generate personalized, safe, and effective workout plans.

Important guidelines:
- Format each exercise on a new line
- Include exercise name, sets, reps, and rest periods
- Ensure exercises are appropriate for the user's experience level
- Consider safety and proper progression
- Keep the workout within the specified duration
- Use clear, simple exercise names`
    };

    const userMessage = {
      role: 'user',
      content: `Generate a detailed workout plan with the following requirements:
- Age: ${age} years old
- Experience Level: ${experienceLevel}
- Goal: ${goal}
- Duration: ${duration} minutes

Format each exercise as:
Exercise Name - Sets x Reps - Rest (seconds)

Example:
Squats - 3 x 12 - 60
Push-ups - 3 x 10 - 45

Please provide a complete workout plan now.`
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

      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: this.MODEL,
        messages,
        max_tokens: this.MAX_TOKENS,
        temperature: this.TEMPERATURE,
        top_p: 1,
        frequency_penalty: 0.3, // Reduce repetition
        presence_penalty: 0.3   // Encourage variety
      });

      const generatedWorkout = response.choices[0].message.content;

      if (!generatedWorkout || generatedWorkout.trim().length === 0) {
        throw new AppError('OpenAI returned empty response', 500);
      }

      return {
        workout: generatedWorkout.trim(),
        metadata: {
          model: this.MODEL,
          tokens: response.usage?.total_tokens || 0,
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
   * Parse workout text into structured exercises
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
