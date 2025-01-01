import { GoogleGenerativeAI } from "@google/generative-ai";

const generateVariation = async (prompt: string, style: "modern" | "minimal" | "elegant") => {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("Gemini APIキーが設定されていません");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const stylePrompts = {
    modern: `Create a vibrant, modern UI component that directly addresses the user's request with dynamic animations and rich visual effects.
Focus on creating an impressive, production-ready design that matches the user's needs with:
- Bold typography with perfect hierarchy using custom font sizes (text-2xl to text-5xl)
- Rich interactive elements with hover states and micro-animations
- Advanced layout using CSS Grid and Flexbox for perfect responsiveness
- Strategic use of vibrant gradients (bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500)
- Multiple meaningful animations (animate-fade-in, animate-bounce, animate-pulse)
- Professional spacing and padding using Tailwind's spacing system
- Interactive hover effects with scale and glow (hover:scale-105 hover:shadow-glow)
- Smooth transition effects on all interactive elements
- Use vibrant colors like blue-500, purple-600, pink-500 for visual impact
- Add loading states with skeleton animations
- Implement micro-interactions on hover and focus

Important: 
1. ALWAYS wrap the entire component in a container with a light background:
   <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
2. Ensure all text has proper contrast against its background
3. Add proper aria-labels for accessibility
4. Return ONLY the JSX code without any wrapper, imports, or exports
5. Make sure the component directly addresses the user's specific request`,
    
    minimal: `Design a sophisticated, minimal UI component that directly addresses the user's request with clean aesthetics.
Focus on creating a refined, professional design that matches the user's needs with:
- Thoughtful whitespace using Tailwind's spacing system
- Subtle fade and scale animations on hover (animate-fade-in, hover:scale-[1.02])
- Perfect typography with careful attention to line height and spacing
- Strategic use of shadows for depth (shadow-md hover:shadow-lg)
- High contrast text with proper readability
- Elegant hover states with smooth transitions (duration-300)
- Clean form elements with proper validation states
- Loading skeletons with subtle pulse animations
- Mobile-first responsive design principles
- Use soft, muted colors (gray-700, gray-800, gray-900)
- Implement subtle micro-interactions

Important:
1. ALWAYS wrap the entire component in a container with a light background:
   <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
2. Ensure all text has proper contrast against its background
3. Add proper aria-labels for accessibility
4. Return ONLY the JSX code without any wrapper, imports, or exports
5. Make sure the component directly addresses the user's specific request`,
    
    elegant: `Create a luxury-grade UI component that directly addresses the user's request with premium animations and rich visual effects.
Focus on creating a high-end, polished design that matches the user's needs with:
- Premium typography using custom font weights and spacing
- Sophisticated color gradients (bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600)
- Rich interactive states with scale and fade animations
- Advanced grid layouts with perfect alignment
- Strategic use of shadows (shadow-xl hover:shadow-2xl)
- Professional hover effects with transform scale and glow
- Loading states with elegant transitions
- Perfect mobile responsiveness with breakpoints
- Integration of animated icons with smooth transitions
- Use rich colors like indigo-600, purple-600, pink-600
- Implement luxury-grade micro-interactions

Important:
1. ALWAYS wrap the entire component in a container with a light background:
   <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
2. Ensure all text has proper contrast against its background
3. Add proper aria-labels for accessibility
4. Return ONLY the JSX code without any wrapper, imports, or exports
5. Make sure the component directly addresses the user's specific request`
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
8. Generate realistic content that matches the user's request
9. Use shadcn/ui components where appropriate
10. Add meaningful animations and transitions
11. ALWAYS wrap content in a light background container for visibility
12. Make sure the generated UI directly addresses the user's specific request`;

  const prompt_template = `${systemPrompt}

Style requirements:
${stylePrompts[style]}

User request: "${prompt}"

Create a beautiful UI component that perfectly matches the request and style requirements.
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
  return codeMatch ? codeMatch[1].trim() : text.trim();
};

export const generateUIWithGemini = async (prompt: string): Promise<string[]> => {
  const styles: Array<"modern" | "minimal" | "elegant"> = [
    "modern", "minimal", "elegant"
  ];
  const designs = await Promise.all(styles.map(style => generateVariation(prompt, style)));
  return designs;
};