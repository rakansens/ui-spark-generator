import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";

const SettingsButton = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");

  const handleSaveOpenAIApiKey = () => {
    if (!openaiApiKey.trim()) {
      toast.error("OpenAI APIキーを入力してください");
      return;
    }
    localStorage.setItem("openai_api_key", openaiApiKey);
    toast.success("OpenAI APIキーを保存しました");
  };

  const handleSaveGeminiApiKey = () => {
    if (!geminiApiKey.trim()) {
      toast.error("Gemini APIキーを入力してください");
      return;
    }
    localStorage.setItem("gemini_api_key", geminiApiKey);
    toast.success("Gemini APIキーを保存しました");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-[20px] w-[20px]" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API設定</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="openai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
          </TabsList>
          <TabsContent value="openai" className="space-y-4">
            <div>
              <label className="text-sm font-medium">OpenAI APIキー</label>
              <Input
                type="password"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="sk-..."
              />
            </div>
            <Button onClick={handleSaveOpenAIApiKey}>保存</Button>
          </TabsContent>
          <TabsContent value="gemini" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Gemini APIキー</label>
              <Input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AI..."
              />
            </div>
            <Button onClick={handleSaveGeminiApiKey}>保存</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsButton;