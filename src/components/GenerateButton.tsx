import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const GenerateButton = ({ onClick, loading, disabled }: GenerateButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="relative bg-gradient-primary hover:opacity-90 transition-opacity px-8 py-6 rounded-xl text-white font-semibold shadow-lg overflow-hidden"
    >
      <div className="relative z-10 flex items-center justify-center">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span className="animate-pulse">Generating...</span>
          </>
        ) : (
          "Generate UI Designs"
        )}
      </div>
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-gradient" />
      )}
    </Button>
  );
};

export default GenerateButton;