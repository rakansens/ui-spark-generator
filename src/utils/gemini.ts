import { GoogleGenerativeAI } from "@google/generative-ai";

const generateVariation = async (prompt: string, style: "modern" | "minimal" | "elegant") => {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("Gemini APIキーが設定されていません");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Update to use gemini-1.5-flash model as recommended
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const stylePrompts = {
    modern: `Create a premium, modern UI component that showcases the best of contemporary web design.
Focus on creating an impressive, production-ready design with:
- Bold typography with perfect hierarchy using font sizes and weights
- Rich interactive elements with hover states and micro-animations
- Advanced layout using CSS Grid and Flexbox for perfect responsiveness
- Strategic use of gradients, shadows, and depth
- Meaningful animations using Tailwind's transition and transform classes
- Professional spacing and padding using Tailwind's spacing system
- Accessibility features including ARIA labels and keyboard navigation
- Integration of shadcn/ui components where appropriate
- Error states and loading states
- Thoughtful empty states and placeholder content`,
    
    minimal: `Design a sophisticated, minimal UI component that emphasizes content and functionality.
Focus on creating a premium, refined design with:
- Thoughtful whitespace using Tailwind's spacing system
- Subtle animations that enhance usability
- Perfect typography with careful attention to line height and letter spacing
- Strategic use of borders and dividers
- High contrast for better readability
- Subtle hover states and focus indicators
- Clean form elements with proper validation states
- Loading skeletons and transitions
- Meaningful empty states
- Mobile-first responsive design`,
    
    elegant: `Create a luxury-grade UI component with meticulous attention to detail.
Focus on creating a high-end, polished design with:
- Premium typography combinations using custom font sizes
- Sophisticated color palette with accent colors
- Rich interactive states with smooth transitions
- Advanced grid layouts with perfect alignment
- Strategic use of borders and dividers
- Professional form validation and error states
- Loading states and transitions
- Thoughtful empty states
- Perfect mobile responsiveness
- Integration of professional icons from lucide-react`
  };

  const systemPrompt = `You are an expert UI developer specializing in creating premium React components with Tailwind CSS and shadcn/ui.
Generate a comprehensive, production-ready UI component based on the user's request.

Important rules:
1. Return ONLY pure JSX code without any React component wrapper, imports, or exports
2. Use Tailwind CSS classes extensively for styling, including:
   - Advanced layouts with grid and flexbox
   - Perfect responsive design for all screen sizes
   - Rich hover and focus states
   - Meaningful animations and transitions
   - Strategic use of gradients and shadows
   - Professional typography hierarchy
3. Create visually impressive designs that look premium and professional
4. Include multiple interactive elements with proper states
5. Use semantic HTML elements
6. Implement proper spacing and padding using Tailwind's spacing system
7. Ensure accessibility with ARIA attributes
8. Generate realistic, context-appropriate content
9. Use shadcn/ui components where appropriate
10. Include loading states and error states
11. Add meaningful empty states
12. Implement proper form validation where applicable`;

  const prompt_template = `${systemPrompt}

Style requirements:
${stylePrompts[style]}

User request: "${prompt}"

Create a beautiful UI component that perfectly matches the request and style requirements.
Remember to return ONLY the JSX code without any wrapper, imports, or exports.
The code should be production-ready, responsive, and visually impressive using Tailwind CSS.
Include realistic content that matches the context and purpose.`;

  const result = await model.generateContent(prompt_template);
  const response = await result.response;
  const text = response.text();
  
  const codeMatch = text.match(/```(?:jsx|tsx)?\s*([\s\S]*?)```/);
  return codeMatch ? codeMatch[1].trim() : text.trim();
};

export const generateUIWithGemini = async (prompt: string): Promise<string[]> => {
  const styles: Array<"modern" | "minimal" | "elegant"> = [
    "modern", "minimal", "elegant"
  ];
  const designs = await Promise.all(styles.map(style => generateVariation(prompt, style)));
  return designs;
};