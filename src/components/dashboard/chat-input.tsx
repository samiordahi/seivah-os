import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCaptures } from "@/hooks/use-captures";

export function ChatInput() {
  const [input, setInput] = useState("");
  const { processCapture, isProcessing } = useCaptures();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const success = await processCapture(input);
    if (success) {
      setInput("");
    }
  };

  return (
    <div className="p-6 px-0 py-[14px]">
      <div className="text-center mb-4">
        <p className="text-muted-foreground text-xl">
          O que deseja <span className="text-coral-primary font-medium">capturar</span> agora?
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva qualquer coisa..." 
          disabled={isProcessing}
          className="w-full border-0 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral-primary/20 transition-all bg-card/90 backdrop-blur-sm shadow-lg mx-0 px-[20px] py-[25px] pr-16" 
        />
        <Button 
          type="submit"
          size="icon" 
          disabled={!input.trim() || isProcessing}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-coral-primary hover:bg-coral-primary/90 text-white rounded-xl disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}