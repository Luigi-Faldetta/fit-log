/**
 * Weight Controller
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for HTTP request/response handling
 * - Delegates business logic to profileService
 * - No database access
 * - No business logic
 */

const profileService = require('../services/profileService');

/**
 * Get all weight entries
 * @route GET /api/weight
 */
exports.getWeightData = async (req, res, next) => {
  try {
    const weightData = await profileService.getAllWeight();
    res.json(weightData);
  } catch (error) {
    next(error);
  }
};

/**
 * Create weight entry
 * @route POST /api/weight
 */
exports.createWeightEntry = async (req, res, next) => {
  try {
    const { value, date } = req.body;
    const newEntry = await profileService.createWeight({ value, date });
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete weight entry
 * @route DELETE /api/weight/:weightId
 */
exports.deleteWeightEntry = async (req, res, next) => {
  try {
    const { weightId } = req.params;
    await profileService.deleteWeight(weightId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
