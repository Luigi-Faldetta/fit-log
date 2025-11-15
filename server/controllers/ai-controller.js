/**
 * AI Controller
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for HTTP request/response handling
 * - Delegates AI business logic to aiService
 * - No OpenAI API calls
 * - No business logic
 */

const aiService = require('../services/aiService');

/**
 * Generate AI workout plan
 * @route POST /api/ai/generate-workout
 */
exports.generateAiWorkout = async (req, res, next) => {
  try {
    const { age, experienceLevel, goal, duration } = req.body;

    const result = await aiService.generateWorkout({
      age,
      experienceLevel,
      goal,
      duration
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
