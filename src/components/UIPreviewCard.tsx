import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import CodePreview from "./CodePreview";
import DynamicUIRenderer from "./DynamicUIRenderer";

interface UIPreviewCardProps {
  loading?: boolean;
  code?: string;
  alt?: string;
  style?: string;
}

const UIPreviewCard = ({ loading, code, alt, style }: UIPreviewCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Card 
        className="overflow-hidden bg-white/5 backdrop-blur-sm border-gray-700/30 rounded-xl shadow-lg transition-all hover:scale-[1.02] cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-4 relative">
          {loading ? (
            <Skeleton className="w-full aspect-video" />
          ) : (
            <>
              {style && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-purple-500/80 text-white text-xs rounded-full">
                  {style}
                </span>
              )}
              {code && <DynamicUIRenderer code={code} />}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">クリックして詳細を表示</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{style || "生成されたUI"}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <div className="border rounded-lg p-4 bg-white/5">
              <DynamicUIRenderer code={code || ""} />
            </div>
            {code && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-white/80">生成されたコード:</h3>
                <CodePreview code={code} />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UIPreviewCard;