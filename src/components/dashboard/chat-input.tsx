import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useN8n } from "@/hooks/use-n8n";
import { useNavigate } from "react-router-dom";
import { VoiceInput } from "@/components/ui/voice-input";
export function ChatInput() {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    sendMessageToN8n,
    isProcessing
  } = useN8n();
  const navigate = useNavigate();
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${newHeight}px`;

      // Check if textarea has expanded beyond initial height
      setIsExpanded(newHeight > 75);
    }
  };
  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };
  return <div className="p-6 px-0 py-[14px] -mt-28">
      <div className="text-center mb-4">
        <div className="flex justify-center -mb-0 py-0 ">
          <img src="/lovable-uploads/e61ea78e-1309-46a7-995c-89aa70715801.png" alt="Seivah Avatar" className="h-[120px] w-[120px]" />
        </div>
        <p style={{
        color: '#404040'
      }} className="mb-8 font-gothic text-5xl font-medium">
          O que deseja<br />
          <span className="font-light italic" style={{
          color: 'hsl(var(--button-send))'
        }}>capturar</span> agora?
        </p>
        
      </div>
      
      <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
        <div className={`relative rounded-2xl backdrop-blur-lg border border-white/40 transition-all duration-300 hover:border-white/50 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none ${input ? 'bg-white/[0.65]' : 'bg-white/[0.49]'}`} style={{
        boxShadow: '0 25px 50px -12px hsl(var(--input-block-shadow) / 0.25), 0 0 30px rgba(255, 255, 255, 0.1)'
      }}>
          <div className="relative">
            <textarea ref={textareaRef} rows={1} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escreva qualquer coisa..." className="w-full border-0 rounded-2xl text-[hsl(var(--input-text))] placeholder:text-[hsl(var(--input-placeholder))] focus:outline-none bg-transparent py-[30px] pr-[120px] relative z-10 px-[21px] resize-none overflow-y-auto min-h-[75px] max-h-[150px] flex items-center" style={{
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'center'
          }} />
            
            <div className={`absolute flex items-center gap-2 z-20 ${isExpanded ? 'bottom-[21px] right-[21px]' : 'top-1/2 right-[21px] -translate-y-1/2'}`}>
              <VoiceInput 
                onTranscriptionComplete={(text) => setInput(prev => prev + (prev ? ' ' : '') + text)}
                disabled={isProcessing}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isProcessing} className="bg-[hsl(var(--button-send))] hover:bg-[hsl(var(--button-send-hover))] text-white rounded-xl backdrop-blur-sm border border-white/30 shadow-[var(--button-send-shadow)] disabled:cursor-not-allowed enabled:shadow-[0_0_10px_hsl(11_88%_55%_/_0.4)] py-0 px-[10px] transition-all duration-200">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>;
}