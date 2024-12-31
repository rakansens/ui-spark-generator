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
            content: `You are a UI developer who creates React components using Tailwind CSS. 
            Generate only the component's JSX code (the return statement content) without any imports or component declaration. 
            Use only Tailwind CSS classes for styling. The code should be clean, responsive, and modern.`
          },
          {
            role: "user",
            content: `Create a React component UI for: ${prompt}. 
            Return only the JSX code (what's inside the return statement).
            Make it responsive and visually appealing using Tailwind CSS.
            Do not include any imports or the component declaration.`
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
    const generatedCode = data.choices[0].message.content;
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