export const generateUIWithOpenAI = async (prompt: string, apiKey: string): Promise<Array<{ code: string }>> => {
  const analyzePrompt = `Analyze the following prompt and extract key information:
- Industry/Domain (e.g., e-commerce, education, healthcare)
- Purpose (e.g., sales, information, learning)
- Target audience
- Key features needed
- Tone/Style preferences

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
Focus on creating an impressive, production-ready design with:
- Perfect typography hierarchy using custom font sizes
- Rich interactive elements with micro-animations
- Advanced CSS Grid and Flexbox layouts
- Strategic use of gradients and shadows
- Professional animations and transitions
- Perfect spacing and padding
- Accessibility features
- Integration of shadcn/ui components
- Loading states and error handling
- Mobile-first responsive design`,
    
    minimal: `Design a sophisticated, minimal UI component that emphasizes content and functionality.
Focus on creating a refined, professional design with:
- Strategic use of whitespace
- Perfect typography with attention to detail
- Subtle animations that enhance usability
- Clean form elements with validation
- High contrast for readability
- Professional hover and focus states
- Loading skeletons
- Meaningful empty states
- Mobile-first approach
- Integration of professional icons`,
    
    elegant: `Create a luxury-grade UI component with meticulous attention to detail.
Focus on creating a high-end, polished design with:
- Premium typography combinations
- Sophisticated color palette
- Rich interactive states
- Advanced grid layouts
- Strategic use of borders
- Professional form validation
- Loading states and transitions
- Perfect responsiveness
- Integration of shadcn/ui
- Meaningful empty states`
  };

  const systemPrompt = `You are an expert UI developer specializing in creating premium React components with Tailwind CSS and shadcn/ui.
Your task is to generate a comprehensive, production-ready UI component based on the following analysis and style requirements.

Analysis of user's request:
${analysis}

Important rules:
1. Return ONLY pure JSX code without any React component wrapper, imports, or exports
2. Use Tailwind CSS classes extensively for styling, including:
   - Advanced layouts with grid and flexbox
   - Perfect responsive design
   - Rich hover and focus states
   - Professional animations
   - Strategic use of shadows
   - Typography hierarchy
3. Create visually impressive designs
4. Include multiple interactive elements
5. Use semantic HTML
6. Implement proper spacing
7. Ensure accessibility
8. Generate realistic content
9. Use shadcn/ui components
10. Include loading states
11. Add empty states
12. Implement validation`;

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
      
      return { code: generatedCode };
    })
  );

  return designs;
};