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
            <div className="space-y-4 animate-pulse">
              <Skeleton className="w-full h-8 bg-gray-700/30" />
              <div className="space-y-2">
                <Skeleton className="w-3/4 h-4 bg-gray-700/30" />
                <Skeleton className="w-1/2 h-4 bg-gray-700/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="w-full h-12 bg-gray-700/30" />
                <Skeleton className="w-full h-12 bg-gray-700/30" />
              </div>
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            </div>
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