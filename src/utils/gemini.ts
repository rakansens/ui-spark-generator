import { GoogleGenerativeAI } from "@google/generative-ai";

const generateVariation = async (prompt: string, style: "modern" | "minimal" | "elegant" | "playful" | "corporate" | "creative") => {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("Gemini APIキーが設定されていません");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const stylePrompts = {
    modern: `Create a modern, feature-rich UI component that reflects current web design trends.
Focus on creating an impressive, production-ready design with:
- Bold typography and vibrant color schemes
- Interactive elements and micro-interactions
- Engaging visual hierarchy with gradients
- Responsive layout with grid/flexbox
- Accessibility features
- Modern UI patterns like floating elements`,
    
    minimal: `Design a minimal, clean UI component that emphasizes content and functionality.
Focus on creating a sophisticated, professional design with:
- Clean typography and ample whitespace
- Monochromatic or duotone color scheme
- Essential interactive elements
- Grid-based minimal layout
- Subtle animations
- Focus on content hierarchy`,
    
    elegant: `Create an elegant, premium UI component with refined details and luxury aesthetics.
Focus on creating a high-end, polished design with:
- Sophisticated serif/sans-serif typography
- Rich color palette with gold/silver accents
- Premium visual elements and animations
- Asymmetrical layouts
- Luxury-focused patterns
- High-end imagery placement`,

    playful: `Design a fun, engaging UI component with playful elements and interactions.
Focus on creating an energetic, friendly design with:
- Rounded shapes and organic elements
- Bright, vibrant color combinations
- Playful animations and transitions
- Informal typography
- Interactive elements with feedback
- Fun imagery and icon usage`,

    corporate: `Create a professional, business-focused UI component suitable for enterprise applications.
Focus on creating a trustworthy, efficient design with:
- Professional typography with clear hierarchy
- Corporate color schemes
- Data visualization elements
- Clean grid layouts
- Efficient use of space
- Business-appropriate imagery`,

    creative: `Design an artistic, unique UI component that pushes creative boundaries.
Focus on creating an innovative, eye-catching design with:
- Experimental typography and layouts
- Unique color combinations
- Creative animations
- Artistic elements and patterns
- Innovative navigation
- Distinctive visual elements`
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
8. Generate realistic, context-appropriate content
9. Use shadcn/ui components where appropriate`;

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
  const styles: Array<"modern" | "minimal" | "elegant" | "playful" | "corporate" | "creative"> = [
    "modern", "minimal", "elegant", "playful", "corporate", "creative"
  ];
  const designs = await Promise.all(styles.map(style => generateVariation(prompt, style)));
  return designs;
};