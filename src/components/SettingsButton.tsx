import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const SettingsButton = () => {
  const [apiKey, setApiKey] = useState("");

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("APIキーを入力してください");
      return;
    }
    localStorage.setItem("openai_api_key", apiKey);
    toast.success("APIキーを保存しました");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI API設定</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">OpenAI APIキー</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <Button onClick={handleSaveApiKey}>保存</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsButton;