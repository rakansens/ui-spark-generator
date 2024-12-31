import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodePreviewProps {
  code: string;
}

const CodePreview = ({ code }: CodePreviewProps) => {
  return (
    <Card className="mt-4 bg-gray-900">
      <CardContent className="p-4">
        <ScrollArea className="h-[200px] w-full">
          <pre className="text-sm text-white font-mono">{code}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CodePreview;