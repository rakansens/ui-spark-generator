import { Card } from "@/components/ui/card";
import CodeBlock from "./CodeBlock";

interface CodePreviewProps {
  code: string;
}

const CodePreview = ({ code }: CodePreviewProps) => {
  return (
    <Card className="mt-4">
      <CodeBlock code={code} />
    </Card>
  );
};

export default CodePreview;