import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CodePreview from "./CodePreview";
import DynamicUIRenderer from "./DynamicUIRenderer";

interface UIPreviewCardProps {
  loading?: boolean;
  code?: string;
  alt?: string;
}

const UIPreviewCard = ({ loading, code, alt }: UIPreviewCardProps) => {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-gray-700/30 rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
        <CardContent className="p-4">
          {loading ? (
            <Skeleton className="w-full aspect-video" />
          ) : (
            code && <DynamicUIRenderer code={code} />
          )}
        </CardContent>
      </Card>
      {code && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/80">Generated Code:</h3>
          <CodePreview code={code} />
        </div>
      )}
    </div>
  );
};

export default UIPreviewCard;