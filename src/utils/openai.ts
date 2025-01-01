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

  const systemPrompt = `You are an expert UI developer specializing in creating premium React components with Tailwind CSS and shadcn/ui.
Your task is to generate a SINGLE, comprehensive, production-ready UI component based on the following analysis and style requirements.

Analysis of user's request:
${analysis}

Important rules:
1. Return ONLY pure JSX code for a SINGLE component without any React component wrapper, imports, or exports
2. Use Tailwind CSS classes extensively for styling, including:
   - Advanced layouts with grid and flexbox
   - Perfect responsive design
   - Rich hover and focus states
   - Professional animations
   - Strategic use of shadows
   - Typography hierarchy
3. Create visually impressive designs
4. Include interactive elements with proper states
5. Use semantic HTML
6. Implement proper spacing
7. Ensure accessibility
8. Generate realistic content
9. Use shadcn/ui components where appropriate
10. ALWAYS wrap content in a light background container:
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">`;

  const userPrompt = `Based on the analysis:
${analysis}

Create a beautiful SINGLE UI component that perfectly matches the identified industry, purpose, and target audience.
Remember to:
1. Return ONLY the JSX code for ONE component without any wrapper, imports, or exports
2. Make sure the component directly addresses the user's specific request
3. Include proper light backgrounds for visibility
4. Add meaningful animations and interactions
5. Use realistic content that matches the context`;

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
  
  return [{ code: generatedCode }];
};