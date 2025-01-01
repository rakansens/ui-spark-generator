import { GoogleGenerativeAI } from "@google/generative-ai";

const generateVariation = async (prompt: string, style: "modern" | "minimal" | "elegant") => {
  const apiKey = localStorage.getItem("gemini_api_key");
  if (!apiKey) {
    throw new Error("Gemini APIキーが設定されていません");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const stylePrompts = {
    modern: `Create a **bold, cutting-edge, modern UI component** that showcases the best of contemporary design.

Design concept:
- **Vibrant gradients & subtle neon effects**: Utilize gradient backgrounds or accent elements with bright, bold colors. Subtle neon glows can be used for hover states.
- **Big, confident typography**: Use large headlines with heavy font weights to make an immediate impact. Supplement with refined subheadings.
- **Micro-interactions & 3D transforms**: Add micro-animations on hover (e.g., slight scale-up, rotate, or translate). Use transitions in transform and opacity to make elements feel dynamic.
- **Layered layouts**: Consider overlapping cards, images, or shapes to create depth. Incorporate blobs, angled sections, or subtle glassmorphism effects.
- **Futuristic highlights**: Integrate elements like subtle animated icons, toggles, or interactive charts (if relevant to the user's request).

Focus points:
- Eye-catching color palette (e.g., bright purples, electric blues, hot pinks) in gradient form.
- Clear content hierarchy with large headings and well-spaced sections.
- Engaging hover/focus states that feel snappy and modern.
- Use of grid or flex for interesting layout compositions (e.g., multi-column designs, asymmetrical grids).
- Rich transitions for modals, dropdowns, or other interactive components from shadcn/ui.
- Thorough use of Tailwind's advanced classes like backdrop-blur, ring, blur, etc. (when it makes sense).

User request: "${prompt}"`,
    
    minimal: `Design a **clean, timeless, and minimal UI component** that emphasizes simplicity and content clarity.

Design concept:
- **Generous whitespace**: Leverage large margins and padding to allow each element to breathe.
- **Understated color palette**: Primarily a neutral or grayscale look, perhaps with a single accent color (e.g., muted blue or soft green) for calls to action.
- **Elegant typography**: Opt for refined font pairings with careful attention to line height, letter spacing, and minimal weights. Typically rely on subtle font weight differences to denote hierarchy.
- **Discrete dividers & borders**: Use light gray or thin lines to separate sections and guide the user's eye.
- **Subtle animations**: Keep motion minimal—fades, gentle slides, or slight scale changes on hover. Avoid flashy animations.
- **Clean form elements**: Simple shapes, consistent spacing, straightforward labeling, and a clear error handling system.

Focus points:
- Smooth transitions that "fade in/out" or gently scale content for hover/focus states.
- Stark contrast between background and text for optimal readability.
- Careful alignment of text blocks and images; no clutter or crowded elements.
- Crisp, minimal icons (using lucide-react or any built-in from shadcn/ui) in small sizes.
- Mobile-first approach: The design should function well on smaller screens with a logical layout flow.

User request: "${prompt}"`,
    
    elegant: `Create a **luxury-grade, polished UI component** exuding sophistication and exclusivity.

Design concept:
- **Opulent color palette**: Combine deep, rich tones (e.g., charcoal, midnight blue, emerald green, or burgundy) with striking accent colors (e.g., gold, champagne, or silver) for highlights.
- **Refined typography**: Pair a luxurious serif for headlines with a sleek sans-serif for body text, adjusting custom font sizes for an editorial feel.
- **Smooth, graceful transitions**: Use soft fade-ins, slide-ins, and hover glows or shadows with a slight spread to evoke high-end ambiance.
- **Elevated design elements**: Intricate borders, subtle use of shadows and gradients that mimic engraved or embossed details.
- **Showcasing images or hero banners**: If relevant, large, high-quality images or hero sections with layered text overlays that fade in elegantly.
- **Interactive states**: Hover states might have a gentle shimmer or accent underlines in gold. Forms should have advanced validation with thoughtful error messages, possibly a refined toast/alert system.

Focus points:
- Perfect alignment in grid layouts. Possibly symmetrical or intentionally off-centered to show design boldness.
- Integration of lucide-react icons or relevant icons from shadcn/ui but styled to match the luxurious theme (e.g., subtle gold outlines).
- Polished loading indicators—progress bars or skeleton loaders with a subtle shimmer or gradient effect.
- Meaningful empty states with tasteful use of negative space and an inviting call to action.

User request: "${prompt}"`
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
${stylePrompts[style]}`;

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