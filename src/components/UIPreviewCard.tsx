import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CodePreview from "./CodePreview";

interface UIPreviewCardProps {
  loading?: boolean;
  imageUrl?: string;
  alt?: string;
  code?: string;
}

const UIPreviewCard = ({ loading, imageUrl, alt, code }: UIPreviewCardProps) => {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-gray-700/30 rounded-xl shadow-lg transition-transform hover:scale-[1.02]">
        <CardContent className="p-0">
          {loading ? (
            <Skeleton className="w-full aspect-video" />
          ) : (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={alt || "UI Preview"}
              className="w-full aspect-video object-cover"
            />
          )}
        </CardContent>
      </Card>
      {code && <CodePreview code={code} />}
    </div>
  );
};

export default UIPreviewCard;