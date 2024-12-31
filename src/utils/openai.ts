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
    modern: `Create a modern, feature-rich UI component that reflects current web design trends.
Focus on creating an impressive, production-ready design with:
- Bold typography and color schemes
- Interactive elements and micro-interactions
- Engaging visual hierarchy
- Responsive layout for all devices
- Accessibility features
- Modern UI patterns specific to the analyzed industry/purpose`,
    
    minimal: `Design a minimal, clean UI component that emphasizes content and functionality.
Focus on creating a sophisticated, professional design with:
- Clean typography and whitespace
- Clear visual hierarchy
- Essential interactive elements
- Responsive and adaptive layout
- Accessibility-first approach
- Industry-specific minimal UI patterns`,
    
    elegant: `Create an elegant, premium UI component with refined details and luxury aesthetics.
Focus on creating a high-end, polished design with:
- Sophisticated typography and color palette
- Premium visual elements and animations
- Refined interactive features
- Fully responsive premium layout
- Accessibility integration
- Luxury-focused industry patterns`
  };

  const systemPrompt = `You are an expert UI developer specializing in creating premium React components with Tailwind CSS.
Your task is to generate a comprehensive, production-ready UI component based on the following analysis and style requirements.

Analysis of user's request:
${analysis}

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
4. Include multiple interactive elements and micro-interactions
5. Use semantic HTML elements
6. Implement proper spacing and padding
7. Ensure accessibility with ARIA attributes
8. Generate realistic, context-appropriate content based on the analysis

The component should be fully functional and reflect the industry, purpose, and target audience identified in the analysis.`;

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