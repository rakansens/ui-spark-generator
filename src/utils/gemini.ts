import { GoogleGenerativeAI } from "@google/generative-ai";

const generateUI = async (prompt: string) => {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("Gemini APIキーが設定されていません");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are an expert UI developer specializing in creating premium React components with Tailwind CSS and shadcn/ui.
Generate a comprehensive, production-ready UI component based on the user's request.

Important rules:
1. Return ONLY pure JSX code without any React component wrapper, imports, or exports
2. Use Tailwind CSS classes extensively for styling, including:
   - Advanced layouts with grid and flexbox
   - Rich animations (animate-fade-in, animate-bounce)
   - Hover effects (hover:scale-105, hover:shadow-lg)
   - Gradient backgrounds (bg-gradient-to-r, bg-gradient-to-br)
   - Professional typography hierarchy
   - Strategic use of shadows for depth
3. Create visually impressive designs with:
   - Vibrant colors and gradients
   - Smooth animations and transitions
   - Interactive hover states
   - Professional spacing
4. Include multiple interactive elements with proper states
5. Use semantic HTML elements
6. Implement proper spacing and padding
7. Ensure accessibility with ARIA attributes
8. Generate realistic content that matches the user's request
9. Use shadcn/ui components where appropriate
10. Add meaningful animations and transitions
11. ALWAYS wrap content in a light background container:
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
12. Make sure the generated UI directly addresses the user's specific request`;

  const prompt_template = `${systemPrompt}

User request: "${prompt}"

Create a beautiful UI component that perfectly matches the request.
Remember to:
1. Return ONLY the JSX code without any wrapper, imports, or exports
2. Make sure the component directly addresses the user's specific request
3. Include proper light backgrounds for visibility
4. Add meaningful animations and interactions
5. Use realistic content that matches the context`;

  const result = await model.generateContent(prompt_template);
  const response = await result.response;
  const text = response.text();
  
  const codeMatch = text.match(/```(?:jsx|tsx)?\s*([\s\S]*?)```/);
  return [codeMatch ? codeMatch[1].trim() : text.trim()];
};

export const generateUIWithGemini = generateUI;