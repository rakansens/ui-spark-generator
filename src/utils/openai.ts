export const generateUIWithOpenAI = async (prompt: string, apiKey: string): Promise<Array<{ code: string; style?: string }>> => {
  const analyzePrompt = `Analyze the following prompt and extract key information:
- Industry/Domain (e.g., e-commerce, education, healthcare)
- Purpose (e.g., sales, information, learning)
- Target audience
- Key features needed
- Tone/Style preferences
- Required interactivity level
- Mobile responsiveness requirements

Prompt: "${prompt}"

Return the analysis in a structured format.`;

  const analysisResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: analyzePrompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!analysisResponse.ok) {
    const error = await analysisResponse.json();
    throw new Error(error.error?.message || "プロンプトの分析に失敗しました");
  }

  const analysisData = await analysisResponse.json();
  const analysis = analysisData.choices[0].message.content;

  const stylePrompts = {
    modern: `Create a premium, modern UI component that showcases contemporary web design excellence.

Key Design Requirements:
1. Visual Hierarchy:
   - Use bold typography with clear hierarchy (text-2xl to text-5xl for headings)
   - Implement consistent spacing (my-2 to my-8, px-4 to px-8)
   - Apply proper contrast ratios for readability

2. Responsive Design:
   - Mobile-first approach using Tailwind's responsive prefixes
   - Flexible layouts with grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
   - Adaptive spacing and typography

3. Interactive Elements:
   - Smooth hover transitions (duration-300)
   - Scale transforms on hover (hover:scale-105)
   - Loading states with skeleton animations
   - Error states with proper feedback

4. Accessibility:
   - Semantic HTML structure
   - ARIA labels and roles
   - Keyboard navigation support
   - Focus visible states

5. Professional Polish:
   - Gradient backgrounds (bg-gradient-to-r)
   - Subtle shadows (shadow-md to shadow-xl)
   - Border radius consistency (rounded-lg)
   - Professional color combinations

6. Component Integration:
   - Proper use of shadcn/ui components
   - Consistent styling with existing UI
   - Error boundary implementation
   - Loading state handling`,
    
    minimal: `Design a sophisticated, minimal UI component that emphasizes content and functionality.

Key Design Requirements:
1. Typography:
   - Clean font hierarchy (text-sm to text-2xl)
   - Optimal line heights (leading-relaxed)
   - Proper letter spacing
   - High contrast text colors

2. Spacing:
   - Consistent whitespace (p-4 to p-8)
   - Balanced margins (my-2 to my-6)
   - Grid gaps (gap-4 to gap-8)
   - Section separation

3. Interactive Elements:
   - Subtle hover effects (opacity changes)
   - Minimal transitions (duration-200)
   - Clean form elements
   - Simple loading states

4. Accessibility:
   - Semantic markup
   - ARIA attributes
   - Keyboard focus styles
   - Screen reader support

5. Visual Design:
   - Monochromatic color scheme
   - Thin borders (border-[0.5px])
   - Subtle shadows (shadow-sm)
   - Clean lines and shapes

6. Responsive Layout:
   - Mobile-first approach
   - Simple grid systems
   - Flexible containers
   - Breakpoint consistency`,
    
    elegant: `Create a luxury-grade UI component with meticulous attention to detail.

Key Design Requirements:
1. Typography:
   - Refined font combinations (serif headings)
   - Custom letter spacing
   - Balanced line heights
   - Rich text colors

2. Visual Elements:
   - Gold accents (#B4925E)
   - Subtle gradients
   - High-quality imagery
   - Refined borders

3. Interactions:
   - Smooth transitions (duration-500)
   - Elegant hover effects
   - Refined loading states
   - Professional animations

4. Layout:
   - Perfect symmetry
   - Golden ratio proportions
   - Consistent spacing
   - Proper alignment

5. Accessibility:
   - Semantic structure
   - ARIA labels
   - Keyboard navigation
   - Focus states

6. Responsive Design:
   - Graceful degradation
   - Maintained elegance
   - Proper spacing
   - Typography scaling`
  };

  const systemPrompt = `You are an expert UI developer specializing in creating premium React components with Tailwind CSS and shadcn/ui.
Your task is to generate a comprehensive, production-ready UI component based on the following analysis and style requirements.

Analysis of user's request:
${analysis}

Technical Requirements:
1. Return ONLY pure JSX code without any React component wrapper, imports, or exports
2. Use Tailwind CSS extensively for:
   - Responsive layouts (mobile-first)
   - Interactive states
   - Animations and transitions
   - Typography and spacing
3. Implement proper accessibility:
   - Semantic HTML
   - ARIA attributes
   - Keyboard navigation
   - Focus management
4. Include error handling:
   - Loading states
   - Error messages
   - Empty states
   - Form validation
5. Optimize performance:
   - Efficient class usage
   - Proper event handling
   - Conditional rendering
   - Lazy loading`;

  const styles: Array<"modern" | "minimal" | "elegant"> = ["modern", "minimal", "elegant"];
  const designs = await Promise.all(
    styles.map(async (style) => {
      const userPrompt = `${stylePrompts[style]}

Based on the analysis:
${analysis}

Create a beautiful UI component that perfectly matches the identified industry, purpose, and target audience.
Remember to return ONLY the JSX code without any wrapper, imports, or exports.
The code should be production-ready, responsive, and visually impressive using Tailwind CSS.
Include realistic content that matches the context and purpose.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "コードの生成に失敗しました");
      }

      const data = await response.json();
      const generatedCode = data.choices[0].message.content.trim();
      
      return { code: generatedCode, style };
    })
  );

  return designs;
};