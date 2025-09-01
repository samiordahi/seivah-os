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
  return <div className="p-6 px-0 py-[14px]">
      <div className="text-center mb-4">
        <p className="text-3xl font-bold mb-2" style={{
        color: 'hsl(var(--chat-title-text))'
      }}>
          O que deseja <span className="font-bold" style={{
          color: 'hsl(var(--button-send))'
        }}>capturar</span> agora?
        </p>
        <p className="text-sm font-light opacity-80" style={{
        color: 'hsl(var(--chat-title-text))'
      }}>
          Converse com seu mentor particular e libere sua mente para o que realmente importa
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <div className="relative rounded-2xl backdrop-blur-lg border border-white/20 transition-all duration-300 hover:border-white/30 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none bg-white/[0.49]" style={{
        boxShadow: '0 25px 50px -12px hsl(var(--input-block-shadow) / 0.25)'
      }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Escreva qualquer coisa..." className="w-full border-0 rounded-2xl text-[hsl(var(--input-text))] placeholder:text-[hsl(var(--input-placeholder))] focus:outline-none focus:ring-2 focus:ring-white/30 transition-all bg-transparent py-[25px] pr-16 relative z-10 px-[21px]" />
          <Button type="submit" size="icon" disabled={!input.trim() || isProcessing} className="absolute right-2 top-1/2 -translate-y-1/2 bg-[hsl(var(--button-send))] hover:bg-[hsl(var(--button-send-hover))] text-white rounded-xl backdrop-blur-sm border border-white/30 z-20 shadow-[var(--button-send-shadow)] disabled:cursor-not-allowed enabled:shadow-[0_0_10px_hsl(11_88%_55%_/_0.4)] py-0 mx-[10px] px-[10px]">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>;
}