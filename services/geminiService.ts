import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Product } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment");
  }
  return new GoogleGenAI({ apiKey: apiKey || 'dummy-key-for-types' });
};

export const generateProductDescription = async (
  name: string,
  category: string,
  keywords: string
): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `
      You are an expert e-commerce copywriter for IntelliVend.
      Write a compelling, SEO-friendly product description (max 100 words) for a product.
      
      Product Name: ${name}
      Category: ${category}
      Keywords: ${keywords}
      
      Tone: Professional yet persuasive.
      Return ONLY the description text, no other conversational filler.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini Generate Description Error:", error);
    return "Error generating description. Please check your API Key.";
  }
};

export const chatWithShoppingAssistant = async (
  message: string,
  products: Product[],
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Create a simplified product catalog string for context
    const productContext = products.map(p => 
      `- ID: ${p.id}, Name: ${p.name}, Price: $${p.price}, Category: ${p.category}, Vendor: ${p.vendorName}`
    ).join('\n');

    const systemInstruction = `
      You are the "IntelliVend Assistant", an intelligent AI shopping assistant for the IntelliVend marketplace.
      Your goal is to help users find products, compare prices, and answer questions about the catalog.
      
      Current Product Catalog:
      ${productContext}
      
      Rules:
      1. Be helpful, concise, and friendly.
      2. If suggesting a product, mention its Name and Price.
      3. If the user asks about something not in the catalog, politely suggest they check back later or recommend a similar category if available.
      4. Keep responses under 3 sentences unless detailed comparison is asked.
    `;

    const chatHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: chatHistory,
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: message,
    });

    return result.text || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm currently offline (API Error). Please try again later.";
  }
};