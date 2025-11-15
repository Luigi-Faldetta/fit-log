/**
 * Body Fat Controller
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for HTTP request/response handling
 * - Delegates business logic to profileService
 * - No database access
 * - No business logic
 */

const profileService = require('../services/profileService');

/**
 * Get all body fat entries
 * @route GET /api/bodyfat
 */
exports.getBodyFatData = async (req, res, next) => {
  try {
    const bodyFatData = await profileService.getAllBodyFat();
    res.json(bodyFatData);
  } catch (error) {
    next(error);
  }
};

/**
 * Create body fat entry
 * @route POST /api/bodyfat
 */
exports.createBodyFatEntry = async (req, res, next) => {
  try {
    const { value, date } = req.body;
    const newEntry = await profileService.createBodyFat({ value, date });
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete body fat entry
 * @route DELETE /api/bodyfat/:bodyFatId
 */
exports.deleteBodyFatEntry = async (req, res, next) => {
  try {
    const { bodyFatId } = req.params;
    await profileService.deleteBodyFat(bodyFatId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
