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

  const generateUICode = async (prompt: string) => {
    const apiKey = localStorage.getItem("openai_api_key");
    if (!apiKey) throw new Error("OpenAI APIキーが設定されていません");

    const systemPrompt = `You are a UI developer specializing in creating React components with Tailwind CSS.
Generate a single, self-contained JSX code snippet based on the user's description.

Important rules:
1. Return ONLY pure JSX code without any React component wrapper, imports, or exports
2. Use Tailwind CSS classes for all styling
3. Create responsive designs that work on all screen sizes
4. Keep the code clean and modern
5. Focus on creating beautiful, static UI elements
6. Do not include any JavaScript logic or event handlers

Example of good response:
<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg">
  <h1 className="text-2xl font-bold text-gray-800">Title</h1>
  <p className="mt-2 text-gray-600">Content</p>
</div>`;

    const userPrompt = `Create a beautiful UI component that represents: ${prompt}
Remember to return ONLY the JSX code without any wrapper, imports, or exports.
The code should be clean, responsive, and visually appealing using Tailwind CSS.`;

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
    for (let i = 0; i < 3; i++) {
      const design = await generateUICode(prompt);
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