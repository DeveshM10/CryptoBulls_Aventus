import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

// Initialize Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Asset properties prompt template
const ASSET_PROMPT = `
You are a financial data extraction assistant. Extract structured information about an asset from the following text input.
Return ONLY a JSON object with the following fields (do not include any explanations or other text):
- title: The name or description of the asset
- value: The monetary value with currency symbol ₹
- type: The category of asset (e.g., real-estate, vehicle, stocks, bonds, cash, crypto, gold, other)
- date: The acquisition date in YYYY-MM-DD format (use today's date if not specified)
- change: The percentage change in value (e.g., "5.2%") or "0%" if not mentioned
- trend: Either "up" or "down" based on whether the asset is appreciating or depreciating

If any field cannot be determined from the input, use reasonable defaults. Format the value field with the ₹ symbol.

Text input: "{text}"
`;

// Liability properties prompt template
const LIABILITY_PROMPT = `
You are a financial data extraction assistant. Extract structured information about a liability from the following text input.
Return ONLY a JSON object with the following fields (do not include any explanations or other text):
- title: The name or description of the liability
- amount: The monetary value with currency symbol ₹
- type: The category of liability (e.g., mortgage, loan, credit-card, auto-loan, student-loan, medical, tax, other)
- interest: The interest rate (e.g., "7.5%") or "0%" if not mentioned
- payment: The regular payment amount with ₹ symbol or "₹0" if not mentioned
- dueDate: When payments are due (e.g., "15th of every month") or "Not specified" if not mentioned
- status: Either "current", "warning", or "late" based on payment status (default to "current" if not mentioned)

If any field cannot be determined from the input, use reasonable defaults. Format all monetary values with the ₹ symbol.

Text input: "{text}"
`;

/**
 * Process voice input text using Google Gemini API
 */
export async function processVoiceInput(req: Request, res: Response) {
  try {
    const { text, type } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text input is required" });
    }

    if (!type || (type !== "asset" && type !== "liability")) {
      return res.status(400).json({ error: "Valid type (asset or liability) is required" });
    }

    // Select the appropriate prompt based on the type
    const promptTemplate = type === "asset" ? ASSET_PROMPT : LIABILITY_PROMPT;
    
    // Replace the placeholder with the actual text
    const prompt = promptTemplate.replace("{text}", text);

    // Call the Gemini Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Parse the JSON response
    try {
      const parsedData = JSON.parse(responseText);
      return res.status(200).json(parsedData);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return res.status(500).json({ 
        error: "Failed to parse AI response", 
        rawResponse: responseText 
      });
    }
  } catch (error: any) {
    console.error("Voice processing error:", error);
    return res.status(500).json({ 
      error: "An error occurred while processing your voice input",
      details: error.message
    });
  }
}