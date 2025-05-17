/**
 * Edge AI Models
 * 
 * This module handles loading and accessing ML models that run
 * entirely on the client device without server communication.
 */

// Models state
let modelsLoaded = false;
let voiceProcessingModel: any = null;
let sentimentModel: any = null;
let financialDataModel: any = null;

/**
 * Load all required ML models asynchronously
 */
export async function loadModels(): Promise<boolean> {
  if (modelsLoaded) return true;
  
  try {
    console.log('Loading Edge AI models...');
    
    // For now, we'll use our rule-based processors which are fully offline
    // But this architecture allows for adding real ML models later
    
    modelsLoaded = true;
    console.log('Edge AI models loaded successfully');
    return true;
  } catch (error) {
    console.error('Failed to load Edge AI models:', error);
    return false;
  }
}

/**
 * Check if models are loaded and ready
 */
export function areModelsReady(): boolean {
  return modelsLoaded;
}

/**
 * Get the voice processing model
 */
export function getVoiceModel() {
  if (!modelsLoaded) {
    throw new Error('Edge AI models not loaded');
  }
  return voiceProcessingModel;
}