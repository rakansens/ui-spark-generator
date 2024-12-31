import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PromptInput = ({ value, onChange, disabled }: PromptInputProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Textarea
        placeholder="Describe the UI you want to generate... (e.g. 'A modern dashboard with dark theme')"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="min-h-[120px] resize-none bg-white/5 backdrop-blur-sm border-gray-700/30 rounded-xl shadow-lg"
      />
    </div>
  );
};

export default PromptInput;