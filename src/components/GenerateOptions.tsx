import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GenerateOptionsProps {
  onSelect: (provider: "openai" | "gemini") => void;
  disabled?: boolean;
}

const GenerateOptions = ({ onSelect, disabled }: GenerateOptionsProps) => {
  const [selectedProvider, setSelectedProvider] = useState<"openai" | "gemini">("openai");

  const handleSelect = (provider: "openai" | "gemini") => {
    setSelectedProvider(provider);
    onSelect(provider);
  };

  return (
    <div className="flex gap-4 justify-center mb-4">
      <Button
        variant={selectedProvider === "openai" ? "default" : "outline"}
        onClick={() => handleSelect("openai")}
        disabled={disabled}
      >
        OpenAI
      </Button>
      <Button
        variant={selectedProvider === "gemini" ? "default" : "outline"}
        onClick={() => handleSelect("gemini")}
        disabled={disabled}
      >
        Gemini
      </Button>
    </div>
  );
};

export default GenerateOptions;