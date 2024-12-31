import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PromptInput from "@/components/PromptInput";
import GenerateButton from "@/components/GenerateButton";
import UIPreviewCard from "@/components/UIPreviewCard";
import SettingsButton from "@/components/SettingsButton";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [designs, setDesigns] = useState<Array<{ code: string }>>([]);
  const { toast } = useToast();

  const generateUICode = async (prompt: string, style: "modern" | "minimal" | "elegant") => {
    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) throw new Error("OpenAI APIキーが設定されていません");

    const stylePrompts = {
      modern: `Create a modern, feature-rich UI component with a bold color scheme, gradients, and engaging visual elements.
Focus on creating an impressive, production-ready design that demonstrates modern web design principles.
Include interactive elements like hover states and transitions.`,
      
      minimal: `Design a minimal, clean UI component that emphasizes whitespace and typography.
Focus on creating a sophisticated, professional design that prioritizes content hierarchy and readability.
Include subtle animations and micro-interactions.`,
      
      elegant: `Create an elegant, luxury-focused UI component with rich visual details and premium aesthetics.
Focus on creating a high-end, polished design that combines beauty with functionality.
Include decorative elements and refined interactions.`
    };

    const systemPrompt = `You are an expert UI developer specializing in creating premium React components with Tailwind CSS.
Your task is to generate a comprehensive, production-ready UI component based on the user's description.

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
7. Ensure accessibility with ARIA attributes where appropriate
8. Add realistic placeholder content that matches the context

Example of good response:
<div className="max-w-4xl mx-auto p-6 space-y-8">
  <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
    <div className="relative z-10 space-y-4">
      <h1 className="text-4xl font-bold tracking-tight">Title</h1>
      <p className="text-lg text-white/80">Description with context</p>
    </div>
  </header>
  <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Multiple content sections */}
  </main>
</div>`;

    const userPrompt = `${stylePrompts[style]}

Create a beautiful UI component that represents: ${prompt}
Remember to return ONLY the JSX code without any wrapper, imports, or exports.
The code should be production-ready, responsive, and visually impressive using Tailwind CSS.
Include realistic placeholder content that matches the context.`;

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
  };

  const generateDesigns = async (prompt: string) => {
    const designs = [];
    const styles: Array<"modern" | "minimal" | "elegant"> = ["modern", "minimal", "elegant"];
    
    for (const style of styles) {
      const design = await generateUICode(prompt, style);
      designs.push(design);
    }
    return designs;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "プロンプトを入力してください",
        variant: "destructive",
      });
      return;
    }

    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) {
      toast({
        title: "OpenAI APIキーが設定されていません",
        description: "設定アイコンからAPIキーを設定してください",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const generatedDesigns = await generateDesigns(prompt);
      setDesigns(generatedDesigns);
      toast({
        title: "UIコードを生成しました",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "生成に失敗しました",
        description: error instanceof Error ? error.message : "もう一度お試しください",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">UI Code Generator</h1>
          <SettingsButton />
        </div>

        <div className="space-y-6">
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            disabled={loading}
          />
          <div className="flex justify-center">
            <GenerateButton
              onClick={handleGenerate}
              loading={loading}
              disabled={!prompt.trim()}
            />
          </div>
        </div>

        {(loading || designs.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading
              ? Array(3)
                  .fill(null)
                  .map((_, i) => <UIPreviewCard key={i} loading />)
              : designs.map((design, i) => (
                  <UIPreviewCard
                    key={i}
                    code={design.code}
                    alt={`Design ${i + 1}`}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;