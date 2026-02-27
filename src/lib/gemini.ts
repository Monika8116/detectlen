import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeImage(base64Image: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `You are an AI defect detection assistant for small-scale industries.
Analyze the product image taken from a smartphone.

Tasks:
1. Detect visible manufacturing defects.
2. Classify defect type.
3. Suggest corrective action.

Use simple language. Return the analysis in a structured JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          inspectionResult: { type: Type.STRING, enum: ['PASS', 'FAIL'] },
          defectIdentified: { type: Type.STRING, description: "Name/type of defect found, or 'None' if PASS" },
          locationOfDefect: { type: Type.STRING, description: "Where the defect is located on the product, or 'N/A' if PASS" },
          severityLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'N/A'] },
          suggestedFix: { type: Type.STRING, description: "Simple corrective action to fix the defect" },
          confidenceLevel: { type: Type.STRING, description: "Confidence percentage (e.g. 95%)" }
        },
        required: ['inspectionResult', 'defectIdentified', 'locationOfDefect', 'severityLevel', 'suggestedFix', 'confidenceLevel']
      }
    }
  });


  try {
    return JSON.parse(response.text || '{}') as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid analysis result from AI");
  }
}
