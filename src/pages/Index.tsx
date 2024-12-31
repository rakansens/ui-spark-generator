import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import PromptInput from "@/components/PromptInput";
import GenerateButton from "@/components/GenerateButton";
import UIPreviewCard from "@/components/UIPreviewCard";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [designs, setDesigns] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe the UI you want to generate",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    // TODO: Implement actual AI generation
    // This is a mock implementation
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setDesigns(["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]);
      toast({
        title: "UI Designs Generated!",
        description: "Check out your new designs below",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">UI Design Generator</h1>
          <p className="text-lg text-gray-300">
            Describe your dream UI and let AI generate it for you
          </p>
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
              : designs.map((url, i) => (
                  <UIPreviewCard key={i} imageUrl={url} alt={`Design ${i + 1}`} />
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;