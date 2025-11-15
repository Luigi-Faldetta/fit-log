/**
 * Workout Data Service
 *
 * Responsible for workout data fetching and caching.
 * Follows Single Responsibility Principle.
 */

import DataService from './dataService';
import { workoutsOfflineAPI } from './offlineApiService';
import { workoutsDB } from './dbService';

class WorkoutDataService extends DataService {
  constructor() {
    super(workoutsOfflineAPI, workoutsDB);
  }

  /**
   * Get single workout by ID
   */
  async getById(id) {
    try {
      return await this.offlineAPI.getById(id);
    } catch (error) {
      console.error(`Failed to fetch workout ${id}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const workoutDataService = new WorkoutDataService();
