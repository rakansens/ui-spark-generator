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
      className="bg-gradient-primary hover:opacity-90 transition-opacity px-8 py-6 rounded-xl text-white font-semibold shadow-lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        "Generate UI Designs"
      )}
    </Button>
  );
};

export default GenerateButton;