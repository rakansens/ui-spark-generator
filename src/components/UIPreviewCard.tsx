import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 shadow-inner relative">
                <div className="absolute inset-0 bg-grid opacity-5"></div>
                {code && <DynamicUIRenderer code={code} />}
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-medium">クリックして詳細を表示</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[90vw] max-w-4xl h-[90vh] flex flex-col bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">{style || "生成されたUI"}</DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400">
              生成されたUIのプレビューとコードを確認できます
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto space-y-6 p-6 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-lg">
              <div className="preview-container relative">
                <div className="absolute inset-0 grid grid-cols-[10px_10px] grid-rows-[10px_10px] bg-gray-400/10 dark:bg-gray-600/10"></div>
                <div className="relative z-10">
                  <DynamicUIRenderer code={code || ""} />
                </div>
              </div>
            </div>
            {code && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">生成されたコード:</h3>
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