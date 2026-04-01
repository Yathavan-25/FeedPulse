import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const analyzeFeedback = async (title: string, description: string, category: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Analyse this product feedback. Return ONLY valid JSON with these fields: 
  {
    "category": "Bug | Feature Request | Improvement | Other",
    "sentiment": "Positive | Neutral | Negative",
    "priority_score": 1-10,
    "summary": "short string",
    "tags": ["tag1", "tag2"]
  }
  
  Title: ${title}
  Description: ${description}
  Category ${category}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean JSON if model wraps it in markdown blocks
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return null;
  }
};