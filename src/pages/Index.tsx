import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PromptInput from "@/components/PromptInput";
import GenerateButton from "@/components/GenerateButton";
import UIPreviewCard from "@/components/UIPreviewCard";
import SettingsButton from "@/components/SettingsButton";
import GenerateOptions from "@/components/GenerateOptions";
import { generateUIWithGemini } from "@/utils/gemini";
import { generateUIWithOpenAI } from "@/utils/openai";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [designs, setDesigns] = useState<Array<{ code: string; style?: string }>>([]);
  const [provider, setProvider] = useState<"openai" | "gemini">("openai");
  const { toast } = useToast();

  const generateDesigns = async (prompt: string) => {
    const apiKey = localStorage.getItem(`${provider}_api_key`);
    if (!apiKey) {
      throw new Error(`${provider === "openai" ? "OpenAI" : "Gemini"} APIキーが設定されていません`);
    }

    if (provider === "gemini") {
      const codes = await generateUIWithGemini(prompt);
      const styles = ["モダン", "ミニマル", "エレガント", "プレイフル", "コーポレート", "クリエイティブ"];
      return codes.map((code, index) => ({ code, style: styles[index] }));
    } else {
      return generateUIWithOpenAI(prompt, apiKey);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "プロンプトを入力してください",
        variant: "destructive",
      });
      return;
    }

    const apiKey = localStorage.getItem(`${provider}_api_key`);
    if (!apiKey) {
      toast({
        title: `${provider === "openai" ? "OpenAI" : "Gemini"} APIキーが設定されていません`,
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
          <GenerateOptions
            onSelect={setProvider}
            disabled={loading}
          />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array(6)
                  .fill(null)
                  .map((_, i) => <UIPreviewCard key={i} loading />)
              : designs.map((design, i) => (
                  <UIPreviewCard
                    key={i}
                    code={design.code}
                    style={design.style}
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