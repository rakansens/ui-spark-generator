import { GoogleGenerativeAI } from "@google/generative-ai";

const generateVariation = async (prompt: string, style: "modern" | "minimal" | "elegant") => {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("Gemini APIキーが設定されていません");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const stylePrompts = {
    modern: `Create a vibrant, modern UI component with dynamic animations and rich visual effects.
Focus on creating an impressive, production-ready design with:
- Bold typography with perfect hierarchy using custom font sizes
- Rich interactive elements with hover states and micro-animations using Tailwind's animate classes
- Advanced layout using CSS Grid and Flexbox for perfect responsiveness
- Strategic use of gradients (bg-gradient-to-r from-blue-500 to-cyan-500)
- Meaningful animations (animate-fade-in, animate-bounce, animate-pulse)
- Professional spacing and padding using Tailwind's spacing system
- Accessibility features including ARIA labels
- Integration of shadcn/ui components
- Hover effects with scale transformations (hover:scale-105)
- Transition effects on interactive elements
- Use vibrant colors like blue-500, cyan-600, indigo-500

Important: Ensure the component has a white or light background (bg-white or bg-gray-50) for visibility, and wrap interactive elements in proper containers with background colors.
Return ONLY the JSX code without any wrapper, imports, or exports.`,
    
    minimal: `Design a sophisticated, minimal UI component with subtle animations and clean aesthetics.
Focus on creating a refined, professional design with:
- Thoughtful whitespace using Tailwind's spacing system
- Subtle fade and scale animations on hover
- Perfect typography with careful attention to line height
- Strategic use of shadows for depth (shadow-md, shadow-lg)
- High contrast for better readability
- Elegant hover states with smooth transitions
- Clean form elements with validation states
- Loading skeletons with pulse animations
- Meaningful empty states
- Mobile-first responsive design
- Use soft, muted colors and gradients (bg-gradient-to-br from-gray-50 to-gray-100)

Important: Ensure the component has a white or light background (bg-white or bg-gray-50) for visibility, and wrap interactive elements in proper containers with background colors.
Return ONLY the JSX code without any wrapper, imports, or exports.`,
    
    elegant: `Create a luxury-grade UI component with premium animations and rich visual effects.
Focus on creating a high-end, polished design with:
- Premium typography using custom font sizes and weights
- Sophisticated color gradients (bg-gradient-to-br from-indigo-600 to-purple-600)
- Rich interactive states with scale and fade animations
- Advanced grid layouts with perfect alignment
- Strategic use of shadows (shadow-lg, shadow-xl)
- Professional hover effects with transform scale
- Loading states with smooth transitions
- Thoughtful empty states with illustrations
- Perfect mobile responsiveness
- Integration of animated icons
- Use rich colors and gradients for visual impact

Important: Ensure the component has a white or light background (bg-white or bg-gray-50) for visibility, and wrap interactive elements in proper containers with background colors.
Return ONLY the JSX code without any wrapper, imports, or exports.`
  };

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
8. Generate realistic content
9. Use shadcn/ui components where appropriate
10. Add meaningful animations and transitions
11. ALWAYS wrap content in a container with a light background color for visibility`;

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