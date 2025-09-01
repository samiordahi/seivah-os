import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useN8n } from "@/hooks/use-n8n";
import { useNavigate } from "react-router-dom";
export function ChatInput() {
  const [input, setInput] = useState("");
  const {
    sendMessageToN8n,
    isProcessing
  } = useN8n();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMessage = text;
    setInput("");

    // Redirect immediately to conversations with the user message
    navigate('/conversations', {
      state: {
        initialMessage: userMessage
      }
    });
  };
  return <div className="p-6 px-0 py-[18px]">
      <div className="text-center mb-4">
        <p className="text-muted-foreground text-xl">
          O que deseja <span className="text-coral-primary font-medium">capturar</span> agora?
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <div className="relative rounded-2xl backdrop-blur-lg border border-white/20 shadow-2xl hover:shadow-coral-primary/20 transition-all duration-300 hover:border-white/30 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none bg-white/[0.49]">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Escreva qualquer coisa..." className="w-full border-0 rounded-2xl text-[hsl(var(--input-text))] placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all bg-transparent px-[20px] py-[25px] pr-16 relative z-10" />
          <Button type="submit" size="icon" disabled={!input.trim() || isProcessing} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[hsl(var(--button-send))] hover:bg-[hsl(var(--button-send-hover))] text-white rounded-xl backdrop-blur-sm border border-white/30 z-20 shadow-[var(--button-send-shadow)] disabled:cursor-not-allowed enabled:shadow-[0_0_10px_hsl(11_88%_55%_/_0.4)]">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>;
}