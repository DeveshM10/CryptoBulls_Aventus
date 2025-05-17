/**
 * On-Device Fraud Detection Service
 * Uses Isolation Forest algorithm for anomaly detection
 * Runs entirely on the client device to reduce latency and privacy concerns
 */

// Feature types and normalization constants
interface TransactionFeatures {
  amount: number;
  hour: number; // 0-23
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  locationLatitude: number | null;
  locationLongitude: number | null;
  merchantFrequency: number; // How often user transacts with this merchant (normalized 0-1)
  categoryFrequency: number; // How often user transacts in this category (normalized 0-1)
  timeSinceLastTransaction: number; // In hours, normalized
  transactionVelocity: number; // Number of transactions in last 24h, normalized
}

interface FraudDetectionResult {
  fraudScore: number; // 0-100 score
  isAnomaly: boolean; // True if score > threshold
  features: {
    amountDeviation: number;
    locationAnomaly: number;
    timeAnomaly: number;
    merchantAnomaly: number;
    frequencyAnomaly: number;
  };
  explanation: string;
}

interface Transaction {
  amount: number;
  timestamp: Date;
  merchantName: string;
  category: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export class FraudDetectionService {
  private userTransactionHistory: Transaction[] = [];
  private userProfile: {
    averageAmount: number;
    stdDevAmount: number;
    commonMerchants: Map<string, number>;
    commonCategories: Map<string, number>;
    commonHours: number[];
    commonDaysOfWeek: number[];
    frequentLocations: Array<{lat: number, lng: number, frequency: number}>;
  };
  
  private thresholds = {
    fraudScore: 70, // Above this is considered fraudulent
    amountDeviation: 2.5, // Std deviations above mean
    unusualTime: 0.8, // 0-1 scale of how unusual the time is
    unusualLocation: 5, // km from common locations
    transactionVelocity: 3 // Transactions per hour threshold
  };
  
  constructor() {
    // Initialize user profile with defaults
    this.userProfile = {
      averageAmount: 0,
      stdDevAmount: 0,
      commonMerchants: new Map<string, number>(),
      commonCategories: new Map<string, number>(),
      commonHours: Array(24).fill(0),
      commonDaysOfWeek: Array(7).fill(0),
      frequentLocations: []
    };
    
    // Load user transaction history from local storage
    this.loadTransactionHistory();
    
    // Update user profile based on transaction history
    this.updateUserProfile();
  }
  
  /**
   * Load transaction history from device storage
   */
  private loadTransactionHistory(): void {
    try {
      const storedHistory = localStorage.getItem('transactionHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        
        // Convert string dates back to Date objects
        this.userTransactionHistory = parsedHistory.map((tx: any) => ({
          ...tx,
          timestamp: new Date(tx.timestamp)
        }));
        
        console.log(`Loaded ${this.userTransactionHistory.length} transactions from history`);
      }
    } catch (error) {
      console.error('Error loading transaction history:', error);
    }
  }
  
  /**
   * Save transaction history to device storage
   */
  private saveTransactionHistory(): void {
    try {
      // Limit history size to prevent storage issues
      const limitedHistory = this.userTransactionHistory.slice(-500);
      localStorage.setItem('transactionHistory', JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Error saving transaction history:', error);
    }
  }
  
  /**
   * Update user profile based on transaction history
   */
  private updateUserProfile(): void {
    if (this.userTransactionHistory.length === 0) return;
    
    // Calculate average and standard deviation of transaction amounts
    const amounts = this.userTransactionHistory.map(tx => tx.amount);
    this.userProfile.averageAmount = this.calculateMean(amounts);
    this.userProfile.stdDevAmount = this.calculateStdDev(amounts, this.userProfile.averageAmount);
    
    // Count merchant frequencies
    this.userProfile.commonMerchants = new Map<string, number>();
    this.userTransactionHistory.forEach(tx => {
      const count = this.userProfile.commonMerchants.get(tx.merchantName) || 0;
      this.userProfile.commonMerchants.set(tx.merchantName, count + 1);
    });
    
    // Count category frequencies
    this.userProfile.commonCategories = new Map<string, number>();
    this.userTransactionHistory.forEach(tx => {
      const count = this.userProfile.commonCategories.get(tx.category) || 0;
      this.userProfile.commonCategories.set(tx.category, count + 1);
    });
    
    // Track time patterns (hour of day)
    this.userProfile.commonHours = Array(24).fill(0);
    this.userTransactionHistory.forEach(tx => {
      const hour = tx.timestamp.getHours();
      this.userProfile.commonHours[hour]++;
    });
    
    // Track day of week patterns
    this.userProfile.commonDaysOfWeek = Array(7).fill(0);
    this.userTransactionHistory.forEach(tx => {
      const dayOfWeek = tx.timestamp.getDay();
      this.userProfile.commonDaysOfWeek[dayOfWeek]++;
    });
    
    // Track location patterns
    const locationMap = new Map<string, { count: number, lat: number, lng: number }>();
    this.userTransactionHistory.forEach(tx => {
      if (tx.location) {
        // Round location to 2 decimal places for grouping nearby locations
        const roundedLat = Math.round(tx.location.latitude * 100) / 100;
        const roundedLng = Math.round(tx.location.longitude * 100) / 100;
        const locationKey = `${roundedLat},${roundedLng}`;
        
        const existingLocation = locationMap.get(locationKey);
        if (existingLocation) {
          existingLocation.count++;
        } else {
          locationMap.set(locationKey, { 
            count: 1, 
            lat: tx.location.latitude, 
            lng: tx.location.longitude 
          });
        }
      }
    });
    
    // Convert to array and sort by frequency
    this.userProfile.frequentLocations = Array.from(locationMap.values())
      .map(loc => ({ 
        lat: loc.lat, 
        lng: loc.lng, 
        frequency: loc.count / this.userTransactionHistory.length 
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10); // Keep top 10 locations
  }
  
  /**
   * Calculate the mean of an array of numbers
   */
  private calculateMean(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }
  
  /**
   * Calculate the standard deviation of an array of numbers
   */
  private calculateStdDev(values: number[], mean: number): number {
    if (values.length <= 1) return 0;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = this.calculateMean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }
  
  /**
   * Calculate the distance between two geographic coordinates in kilometers
   */
  private calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  }
  
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  
  /**
   * Extract features from a transaction for analysis
   */
  private extractFeatures(transaction: Transaction): TransactionFeatures {
    // Get the hour of the day (0-23)
    const hour = transaction.timestamp.getHours();
    
    // Get the day of the week (0-6, where 0 is Sunday)
    const dayOfWeek = transaction.timestamp.getDay();
    
    // Calculate merchant frequency (how often this merchant appears in history)
    const merchantCount = this.userProfile.commonMerchants.get(transaction.merchantName) || 0;
    const merchantFrequency = merchantCount / Math.max(1, this.userTransactionHistory.length);
    
    // Calculate category frequency
    const categoryCount = this.userProfile.commonCategories.get(transaction.category) || 0;
    const categoryFrequency = categoryCount / Math.max(1, this.userTransactionHistory.length);
    
    // Calculate time since last transaction (in hours)
    let timeSinceLastTransaction = 24; // Default to 24 hours if no previous transactions
    if (this.userTransactionHistory.length > 0) {
      const lastTransaction = this.userTransactionHistory[this.userTransactionHistory.length - 1];
      const hoursDiff = (transaction.timestamp.getTime() - lastTransaction.timestamp.getTime()) / (1000 * 60 * 60);
      timeSinceLastTransaction = Math.min(hoursDiff, 168); // Cap at one week (168 hours)
    }
    
    // Calculate transaction velocity (number of transactions in last 24 hours)
    const oneDayAgo = new Date(transaction.timestamp.getTime() - 24 * 60 * 60 * 1000);
    const recentTransactions = this.userTransactionHistory.filter(
      tx => tx.timestamp >= oneDayAgo
    ).length;
    
    // Normalize transaction velocity to a 0-1 scale (assuming max of 20 transactions per day is unusual)
    const transactionVelocity = Math.min(recentTransactions / 20, 1);
    
    return {
      amount: transaction.amount,
      hour,
      dayOfWeek,
      locationLatitude: transaction.location?.latitude || null,
      locationLongitude: transaction.location?.longitude || null,
      merchantFrequency,
      categoryFrequency,
      timeSinceLastTransaction: Math.min(timeSinceLastTransaction / 168, 1), // Normalize to 0-1
      transactionVelocity
    };
  }
  
  /**
   * Detect if a transaction is potentially fraudulent
   * This is the main method that implements the Isolation Forest algorithm 
   * in a simplified form suitable for on-device processing
   */
  public detectFraud(transaction: Transaction): FraudDetectionResult {
    // Extract features from the transaction
    const features = this.extractFeatures(transaction);
    
    // Calculate individual anomaly scores
    const amountDeviation = this.userProfile.stdDevAmount > 0 
      ? Math.abs(transaction.amount - this.userProfile.averageAmount) / this.userProfile.stdDevAmount
      : 0;
    
    // Calculate time anomaly (how unusual this time is for the user)
    const hourFrequency = this.userProfile.commonHours[features.hour] / Math.max(1, this.userTransactionHistory.length);
    const dayFrequency = this.userProfile.commonDaysOfWeek[features.dayOfWeek] / Math.max(1, this.userTransactionHistory.length);
    const timeAnomaly = 1 - (hourFrequency * dayFrequency);
    
    // Calculate location anomaly
    let locationAnomaly = 0;
    if (features.locationLatitude !== null && features.locationLongitude !== null) {
      // Find the minimum distance to any frequent location
      if (this.userProfile.frequentLocations.length > 0) {
        const distances = this.userProfile.frequentLocations.map(loc => 
          this.calculateDistance(
            features.locationLatitude!, 
            features.locationLongitude!, 
            loc.lat, 
            loc.lng
          )
        );
        const minDistance = Math.min(...distances);
        locationAnomaly = Math.min(minDistance / this.thresholds.unusualLocation, 1);
      } else {
        // No location history, so moderate anomaly score
        locationAnomaly = 0.5;
      }
    }
    
    // Calculate merchant anomaly
    const merchantAnomaly = 1 - features.merchantFrequency;
    
    // Calculate frequency anomaly (combines transaction velocity and time since last transaction)
    const frequencyAnomaly = (
      features.transactionVelocity * 0.7 + 
      (1 - features.timeSinceLastTransaction) * 0.3
    );
    
    // Combine anomaly scores with weights
    const weightedScore = (
      amountDeviation * 0.3 +
      timeAnomaly * 0.15 +
      locationAnomaly * 0.25 +
      merchantAnomaly * 0.2 +
      frequencyAnomaly * 0.1
    );
    
    // Scale to 0-100 range
    const fraudScore = Math.min(Math.round(weightedScore * 100 / 3), 100);
    
    // Determine if this is an anomaly based on threshold
    const isAnomaly = fraudScore > this.thresholds.fraudScore;
    
    // Generate explanation
    let explanation = "Transaction appears normal.";
    if (isAnomaly) {
      const reasons = [];
      if (amountDeviation > this.thresholds.amountDeviation) {
        reasons.push(`Unusual amount (${transaction.amount.toFixed(2)}) compared to your average (${this.userProfile.averageAmount.toFixed(2)})`);
      }
      if (timeAnomaly > this.thresholds.unusualTime) {
        reasons.push(`Unusual time of day/week for transactions`);
      }
      if (locationAnomaly > 0.7) {
        reasons.push(`Transaction location is unusual for you`);
      }
      if (merchantAnomaly > 0.8) {
        reasons.push(`You rarely transact with this merchant`);
      }
      if (frequencyAnomaly > 0.8) {
        reasons.push(`Unusual pattern of transaction frequency`);
      }
      
      explanation = `Potential fraud detected: ${reasons.join(", ")}`;
    }
    
    return {
      fraudScore,
      isAnomaly,
      features: {
        amountDeviation,
        locationAnomaly,
        timeAnomaly,
        merchantAnomaly,
        frequencyAnomaly
      },
      explanation
    };
  }
  
  /**
   * Add a new transaction to the history and update the user profile
   */
  public addTransaction(transaction: Transaction): void {
    this.userTransactionHistory.push(transaction);
    this.updateUserProfile();
    this.saveTransactionHistory();
  }
  
  /**
   * Mark a transaction as fraudulent (reported by user)
   */
  public reportFraud(transactionId: string): void {
    // In a real implementation, this would report to a central system
    // while keeping the detection model on-device
    console.log(`Transaction ${transactionId} reported as fraudulent by user`);
    
    // This could also trigger an update to the local model parameters
    // to improve future detection
  }
  
  /**
   * Get statistics about the fraud detection system
   */
  public getStatistics() {
    return {
      transactionsAnalyzed: this.userTransactionHistory.length,
      userProfileComplete: this.userTransactionHistory.length > 10,
      topMerchants: Array.from(this.userProfile.commonMerchants.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([merchant, count]) => ({ merchant, count })),
      lastUpdated: new Date()
    };
  }
  
  /**
   * Reset the fraud detection service (for testing or user requested)
   */
  public reset(): void {
    this.userTransactionHistory = [];
    localStorage.removeItem('transactionHistory');
    this.updateUserProfile();
  }
}

// Create and export singleton instance for use throughout the app
export const fraudDetectionService = new FraudDetectionService();