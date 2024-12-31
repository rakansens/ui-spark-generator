import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
}

const CodeBlock = ({ code }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "コピーしました",
        duration: 1000,
      });
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      toast({
        title: "コピーに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-[#1A1F2C] text-white">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2A2F3C] border-b border-[#403E43]">
        <span className="text-sm text-[#8E9196]">Generated Code</span>
        <button
          onClick={copyToClipboard}
          className="p-2 hover:bg-[#403E43] rounded-md transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-[#8E9196]" />
          )}
        </button>
      </div>
      <ScrollArea className="h-[200px] w-full">
        <pre className="p-4 text-sm font-mono">
          <code className="text-[#C8C8C9]">{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
};

export default CodeBlock;