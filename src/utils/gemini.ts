import { GoogleGenerativeAI } from "@google/generative-ai";

const generateVariation = async (prompt: string, style: "modern" | "minimal" | "elegant") => {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("Gemini APIキーが設定されていません");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const stylePrompts = {
    modern: `Create a modern, feature-rich UI component that reflects current web design trends.
Focus on creating an impressive, production-ready design with:
- Bold typography and color schemes
- Interactive elements and micro-interactions
- Engaging visual hierarchy
- Responsive layout for all devices
- Accessibility features
- Modern UI patterns`,
    
    minimal: `Design a minimal, clean UI component that emphasizes content and functionality.
Focus on creating a sophisticated, professional design with:
- Clean typography and whitespace
- Clear visual hierarchy
- Essential interactive elements
- Responsive and adaptive layout
- Accessibility-first approach
- Minimalist UI patterns`,
    
    elegant: `Create an elegant, premium UI component with refined details and luxury aesthetics.
Focus on creating a high-end, polished design with:
- Sophisticated typography and color palette
- Premium visual elements and animations
- Refined interactive features
- Fully responsive premium layout
- Accessibility integration
- Luxury-focused patterns`
  };

  const systemPrompt = `You are an expert UI developer specializing in creating premium React components with Tailwind CSS.
Generate a comprehensive, production-ready UI component based on the user's request.

Important rules:
1. Return ONLY pure JSX code without any React component wrapper, imports, or exports
2. Use Tailwind CSS classes extensively for styling, including:
   - Complex layouts with grid and flexbox
   - Responsive design for all screen sizes
   - Hover and focus states
   - Animations and transitions
   - Gradients and shadows
   - Typography hierarchy
3. Create visually impressive designs that look professional
4. Include multiple interactive elements
5. Use semantic HTML elements
6. Implement proper spacing and padding
7. Ensure accessibility with ARIA attributes
8. Generate realistic, context-appropriate content`;

  const prompt_template = `${systemPrompt}

Style requirements:
${stylePrompts[style]}

User request: "${prompt}"

Create a beautiful UI component that perfectly matches the request and style requirements.
Remember to return ONLY the JSX code without any wrapper, imports, or exports.
The code should be production-ready, responsive, and visually impressive using Tailwind CSS.`;

  const result = await model.generateContent(prompt_template);
  const response = await result.response;
  const text = response.text();
  
  const codeMatch = text.match(/```(?:jsx|tsx)?\s*([\s\S]*?)```/);
  return codeMatch ? codeMatch[1].trim() : text.trim();
};

export const generateUIWithGemini = async (prompt: string): Promise<string[]> => {
  const styles: Array<"modern" | "minimal" | "elegant"> = ["modern", "minimal", "elegant"];
  const designs = await Promise.all(styles.map(style => generateVariation(prompt, style)));
  return designs;
};