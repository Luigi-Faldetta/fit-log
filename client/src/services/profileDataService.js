/**
 * Profile Data Services (Weight & Body Fat)
 *
 * Separate services for weight and body fat data.
 * Follows Single Responsibility Principle - each service handles one data type.
 */

import DataService from './dataService';
import { weightOfflineAPI, bodyfatOfflineAPI } from './offlineApiService';
import { weightDB, bodyfatDB } from './dbService';

class WeightDataService extends DataService {
  constructor() {
    super(weightOfflineAPI, weightDB);
  }
}

class BodyFatDataService extends DataService {
  constructor() {
    super(bodyfatOfflineAPI, bodyfatDB);
  }
}

// Export singleton instances
export const weightDataService = new WeightDataService();
export const bodyfatDataService = new BodyFatDataService();
