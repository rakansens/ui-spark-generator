import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateUIWithGemini = async (prompt: string): Promise<string> => {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("Gemini APIキーが設定されていません");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = `You are an expert UI developer specializing in creating premium React components with Tailwind CSS.
Generate a comprehensive, production-ready UI component based on the user's request.

Important rules:
1. Return ONLY pure JSX code without any React component wrapper, imports, or exports
2. Use Tailwind CSS classes extensively for styling
3. Create visually impressive designs that look professional
4. Include multiple interactive elements
5. Use semantic HTML elements
6. Implement proper spacing and padding
7. Ensure accessibility with ARIA attributes
8. Generate realistic, context-appropriate content`;

  const prompt_template = `${systemPrompt}

User request: "${prompt}"

Create a beautiful UI component that perfectly matches the request.
Remember to return ONLY the JSX code without any wrapper, imports, or exports.
The code should be production-ready, responsive, and visually impressive using Tailwind CSS.`;

  const result = await model.generateContent(prompt_template);
  const response = await result.response;
  const text = response.text();
  
  // コードブロックから実際のコードを抽出
  const codeMatch = text.match(/```(?:jsx|tsx)?\s*([\s\S]*?)```/);
  return codeMatch ? codeMatch[1].trim() : text.trim();
};