/**
 * Generic Data Service
 *
 * Follows Single Responsibility Principle by handling ONLY:
 * - Data fetching with offline-first strategy
 * - Caching to IndexedDB
 * - Fallback to cached data on errors
 *
 * Does NOT handle:
 * - State management (that's for contexts)
 * - UI concerns (loading, error display)
 * - Data transformation (that's for utilities)
 */

class DataService {
  constructor(offlineAPI, dbService) {
    this.offlineAPI = offlineAPI;
    this.dbService = dbService;
  }

  /**
   * Fetch all data with caching strategy:
   * 1. Try to load from IndexedDB first for instant display
   * 2. Fetch from API (offline-first)
   * 3. Fallback to cache on error
   */
  async getAll() {
    try {
      // Try cache first for instant display
      const cachedData = await this.dbService.getAll();

      // Fetch from API (will use offline queue if needed)
      const data = await this.offlineAPI.getAll();

      return {
        data,
        fromCache: false,
        cachedData: cachedData.length > 0 ? cachedData : null
      };
    } catch (error) {
      console.error(`Failed to fetch data from API:`, error);

      // Fallback to cached data
      const cachedData = await this.dbService.getAll();
      if (cachedData && cachedData.length > 0) {
        return {
          data: cachedData,
          fromCache: true,
          error: 'Using cached data. Unable to fetch latest data.'
        };
      }

      throw new Error('Failed to load data and no cache available');
    }
  }

  /**
   * Create new entry
   */
  async create(entry) {
    return await this.offlineAPI.create(entry);
  }

  /**
   * Update existing entry
   */
  async update(id, entry) {
    return await this.offlineAPI.update(id, entry);
  }

  /**
   * Delete entry
   */
  async delete(id) {
    return await this.offlineAPI.delete(id);
  }

  /**
   * Update cache manually (optimistic updates)
   */
  async updateCache(entry) {
    await this.dbService.put(entry);
  }

  /**
   * Delete from cache manually
   */
  async deleteFromCache(id) {
    await this.dbService.delete(id);
  }

  /**
   * Get from cache only
   */
  async getCached() {
    return await this.dbService.getAll();
  }
}

export default DataService;
