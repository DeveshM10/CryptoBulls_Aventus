import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

// Process voice input to extract structured data
export async function processVoiceInput(req: Request, res: Response) {
  try {
    const { text, type } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    if (!type || (type !== "asset" && type !== "liability")) {
      return res.status(400).json({ error: "Invalid type. Must be 'asset' or 'liability'" });
    }

    // Generate a prompt based on the type
    const prompt = generatePrompt(text, type);
    
    let responseText = "";
    
    // Use Google Gemini API
    if (process.env.GOOGLE_GEMINI_API_KEY) {
      try {
        console.log("Attempting to use Google Gemini API...");
        // Use Google Gemini to process the text
        const model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-pro", // Updated to use the latest Gemini model 
          generationConfig: {
            temperature: 0.2, // Lower temperature for more deterministic extraction
            maxOutputTokens: 1024,
          }
        });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
        console.log("Google Gemini API response received successfully");
      } catch (geminiError) {
        console.error("Google Gemini API error:", geminiError);
        throw new Error("Google Gemini API failed - check your API key");
      }
    } else {
      return res.status(500).json({ error: "No AI API keys configured. Please add GOOGLE_GEMINI_API_KEY" });
    }
    
    // Parse the JSON response
    try {
      // Extract JSON from the response text
      const jsonMatch = responseText.match(/```json\n([\s\S]*)\n```/) || 
                        responseText.match(/```\n([\s\S]*)\n```/) ||
                        responseText.match(/{[\s\S]*}/);
                        
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText;
      console.log("Extracted JSON string:", jsonStr);
      const extractedData = JSON.parse(jsonStr);
      
      res.status(200).json(extractedData);
    } catch (parseError) {
      console.error("Error parsing JSON from AI response:", parseError);
      console.log("Raw AI response:", responseText);
      res.status(500).json({ error: "Failed to parse structured data from voice input" });
    }
  } catch (error) {
    console.error("Voice processing error:", error);
    res.status(500).json({ error: "Failed to process voice input" });
  }
}

// Generate a prompt based on the type of data we want to extract
function generatePrompt(text: string, type: string): string {
  if (type === "asset") {
    return `
      You are a financial data extraction assistant. Extract structured information about an asset from the following text:
      
      "${text}"
      
      Parse and return only a JSON object with these fields (use null for missing values):
      - title: The name or description of the asset
      - value: The monetary value with currency symbol (preferably ₹)
      - type: The asset type (e.g., real-estate, stocks, bonds, gold, cash, other)
      - change: Any percentage change in value, if mentioned (e.g., "5%")
      - trend: "up" if the value has increased, "down" if decreased
      
      Return ONLY the JSON object without any explanation, enclosed in markdown code block with json syntax highlighting.
    `;
  } else {
    return `
      You are a financial data extraction assistant. Extract structured information about a liability from the following text:
      
      "${text}"
      
      Parse and return only a JSON object with these fields (use null for missing values):
      - title: The name or description of the liability
      - amount: The monetary value with currency symbol (preferably ₹)
      - type: The liability type (e.g., mortgage, loan, credit-card, auto-loan, student-loan, other)
      - interest: Interest rate, if mentioned (e.g., "7.5%")
      - payment: Monthly/regular payment amount with currency symbol (preferably ₹), if mentioned
      - dueDate: Due date in YYYY-MM-DD format, if mentioned
      - status: "current" if on time, "warning" if close to deadline, "late" if overdue (default to "current" if not mentioned)
      
      Return ONLY the JSON object without any explanation, enclosed in markdown code block with json syntax highlighting.
    `;
  }
}