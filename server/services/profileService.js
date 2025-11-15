/**
 * Profile Service
 *
 * Follows Single Responsibility Principle:
 * - Responsible ONLY for profile data business logic (weight & bodyfat)
 * - Handles data access through models
 * - Handles validation and business rules
 * - No HTTP concerns (request/response)
 * - Throws errors for controllers to handle
 *
 * Note: Weight and bodyfat share identical logic, so we use a generic approach
 */

const { Weight } = require('../models/weight-model');
const { BodyFat } = require('../models/bodyfat-model');
const { AppError, NotFoundError, ValidationError } = require('../middleware/errorHandler');

class ProfileService {
  /**
   * Validate profile entry data
   * @param {Object} data - Entry data
   * @param {string} type - 'weight' or 'bodyfat'
   * @throws {ValidationError} - If data is invalid
   */
  validateEntry(data, type = 'weight') {
    const { value, date } = data;

    if (value === undefined || value === null) {
      throw new ValidationError(`${type} value is required`);
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      throw new ValidationError(`${type} value must be a number`);
    }

    // Weight validation
    if (type === 'weight') {
      if (numValue < 20 || numValue > 500) {
        throw new ValidationError('Weight must be between 20 and 500');
      }
    }

    // Bodyfat validation
    if (type === 'bodyfat') {
      if (numValue < 1 || numValue > 70) {
        throw new ValidationError('Body fat percentage must be between 1 and 70');
      }
    }

    if (!date) {
      throw new ValidationError('Date is required');
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new ValidationError('Invalid date format');
    }

    const now = new Date();
    if (dateObj > now) {
      throw new ValidationError('Date cannot be in the future');
    }
  }

  /**
   * Get model by type
   * @param {string} type - 'weight' or 'bodyfat'
   * @returns {Object} - Sequelize model
   */
  getModel(type) {
    return type === 'weight' ? Weight : BodyFat;
  }

  /**
   * Get ID field name by type
   * @param {string} type - 'weight' or 'bodyfat'
   * @returns {string} - ID field name
   */
  getIdField(type) {
    return type === 'weight' ? 'weight_id' : 'bodyfat_id';
  }

  // ============= Weight Methods =============

  /**
   * Get all weight entries
   * @returns {Promise<Array>} - All weight entries
   */
  async getAllWeight() {
    try {
      const entries = await Weight.findAll({
        order: [['date', 'DESC']]
      });
      return entries;
    } catch (error) {
      throw new AppError('Failed to retrieve weight data', 500);
    }
  }

  /**
   * Get weight entry by ID
   * @param {number} weightId - Weight entry ID
   * @returns {Promise<Object>} - Weight entry
   * @throws {NotFoundError} - If entry not found
   */
  async getWeightById(weightId) {
    if (!weightId || isNaN(weightId)) {
      throw new ValidationError('Invalid weight ID');
    }

    const entry = await Weight.findByPk(weightId);

    if (!entry) {
      throw new NotFoundError('Weight entry not found');
    }

    return entry;
  }

  /**
   * Create weight entry
   * @param {Object} data - Entry data
   * @param {number} data.value - Weight value
   * @param {string} data.date - Date
   * @returns {Promise<Object>} - Created entry
   */
  async createWeight(data) {
    this.validateEntry(data, 'weight');

    try {
      const newEntry = await Weight.create({
        value: parseFloat(data.value),
        date: new Date(data.date)
      });

      return newEntry;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new ValidationError(error.message);
      }
      throw new AppError('Failed to create weight entry', 500);
    }
  }

  /**
   * Delete weight entry
   * @param {number} weightId - Weight entry ID
   * @returns {Promise<void>}
   * @throws {NotFoundError} - If entry not found
   */
  async deleteWeight(weightId) {
    if (!weightId || isNaN(weightId)) {
      throw new ValidationError('Invalid weight ID');
    }

    const entry = await Weight.findByPk(weightId);

    if (!entry) {
      throw new NotFoundError('Weight entry not found');
    }

    try {
      await entry.destroy();
    } catch (error) {
      throw new AppError('Failed to delete weight entry', 500);
    }
  }

  // ============= Body Fat Methods =============

  /**
   * Get all bodyfat entries
   * @returns {Promise<Array>} - All bodyfat entries
   */
  async getAllBodyFat() {
    try {
      const entries = await BodyFat.findAll({
        order: [['date', 'DESC']]
      });
      return entries;
    } catch (error) {
      throw new AppError('Failed to retrieve body fat data', 500);
    }
  }

  /**
   * Get bodyfat entry by ID
   * @param {number} bodyFatId - Bodyfat entry ID
   * @returns {Promise<Object>} - Bodyfat entry
   * @throws {NotFoundError} - If entry not found
   */
  async getBodyFatById(bodyFatId) {
    if (!bodyFatId || isNaN(bodyFatId)) {
      throw new ValidationError('Invalid body fat ID');
    }

    const entry = await BodyFat.findByPk(bodyFatId);

    if (!entry) {
      throw new NotFoundError('Body fat entry not found');
    }

    return entry;
  }

  /**
   * Create bodyfat entry
   * @param {Object} data - Entry data
   * @param {number} data.value - Bodyfat percentage
   * @param {string} data.date - Date
   * @returns {Promise<Object>} - Created entry
   */
  async createBodyFat(data) {
    this.validateEntry(data, 'bodyfat');

    try {
      const newEntry = await BodyFat.create({
        value: parseFloat(data.value),
        date: new Date(data.date)
      });

      return newEntry;
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        throw new ValidationError(error.message);
      }
      throw new AppError('Failed to create body fat entry', 500);
    }
  }

  /**
   * Delete bodyfat entry
   * @param {number} bodyFatId - Bodyfat entry ID
   * @returns {Promise<void>}
   * @throws {NotFoundError} - If entry not found
   */
  async deleteBodyFat(bodyFatId) {
    if (!bodyFatId || isNaN(bodyFatId)) {
      throw new ValidationError('Invalid body fat ID');
    }

    const entry = await BodyFat.findByPk(bodyFatId);

    if (!entry) {
      throw new NotFoundError('Body fat entry not found');
    }

    try {
      await entry.destroy();
    } catch (error) {
      throw new AppError('Failed to delete body fat entry', 500);
    }
  }

  // ============= Utility Methods =============

  /**
   * Get latest weight entry
   * @returns {Promise<Object|null>} - Latest weight entry or null
   */
  async getLatestWeight() {
    try {
      const entry = await Weight.findOne({
        order: [['date', 'DESC']]
      });
      return entry;
    } catch (error) {
      throw new AppError('Failed to retrieve latest weight', 500);
    }
  }

  /**
   * Get latest bodyfat entry
   * @returns {Promise<Object|null>} - Latest bodyfat entry or null
   */
  async getLatestBodyFat() {
    try {
      const entry = await BodyFat.findOne({
        order: [['date', 'DESC']]
      });
      return entry;
    } catch (error) {
      throw new AppError('Failed to retrieve latest body fat', 500);
    }
  }

  /**
   * Get weight entries within date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise<Array>} - Weight entries
   */
  async getWeightByDateRange(startDate, endDate) {
    try {
      const entries = await Weight.findAll({
        where: {
          date: {
            [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
          }
        },
        order: [['date', 'DESC']]
      });
      return entries;
    } catch (error) {
      throw new AppError('Failed to retrieve weight data by date range', 500);
    }
  }

  /**
   * Get bodyfat entries within date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Promise<Array>} - Bodyfat entries
   */
  async getBodyFatByDateRange(startDate, endDate) {
    try {
      const entries = await BodyFat.findAll({
        where: {
          date: {
            [require('sequelize').Op.between]: [new Date(startDate), new Date(endDate)]
          }
        },
        order: [['date', 'DESC']]
      });
      return entries;
    } catch (error) {
      throw new AppError('Failed to retrieve body fat data by date range', 500);
    }
  }

  /**
   * Count weight entries
   * @returns {Promise<number>} - Total count
   */
  async countWeight() {
    try {
      return await Weight.count();
    } catch (error) {
      throw new AppError('Failed to count weight entries', 500);
    }
  }

  /**
   * Count bodyfat entries
   * @returns {Promise<number>} - Total count
   */
  async countBodyFat() {
    try {
      return await BodyFat.count();
    } catch (error) {
      throw new AppError('Failed to count body fat entries', 500);
    }
  }
}

// Export singleton instance
module.exports = new ProfileService();
