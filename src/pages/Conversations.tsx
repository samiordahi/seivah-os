import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useN8n } from '@/hooks/use-n8n';
import { useProfile } from '@/hooks/use-profile';
import { useRealtimeSync } from '@/hooks/use-realtime-sync';
import { Send } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThinkingAnimation } from '@/components/ui/thinking-animation';
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Conversations() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const location = useLocation();
  const initialMessage = (location.state as any)?.initialMessage as string | undefined;
  const { profile } = useProfile();
  const { sendMessageToN8n, isProcessing } = useN8n();
  const hasProcessedInitial = useRef(false);
  
  // Enable realtime sync
  useRealtimeSync();

  // Auto-process initial message when arriving from dashboard
  useEffect(() => {
    const processInitialMessage = async () => {
      if (initialMessage && !hasProcessedInitial.current) {
        hasProcessedInitial.current = true;
        
        // Add user message immediately
        setMessages([{
          role: 'user',
          content: initialMessage
        }]);
        
        // Show thinking animation
        setIsThinking(true);
        
        // Send to n8n in background
        const result = await sendMessageToN8n(initialMessage);
        
        if (result.success && result.response) {
          // Replace thinking with actual response
          setIsThinking(false);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: result.response!
          }]);
        } else {
          // Show friendly error message
          setIsThinking(false);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Ops, não consegui processar agora. Tenta de novo?'
          }]);
        }
      }
    };
    
    processInitialMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);
  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    
    // Add user message immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content
    }]);
    setInput('');
    
    // Show thinking animation
    setIsThinking(true);
    
    // Send to n8n
    const result = await sendMessageToN8n(content);
    
    // Hide thinking and add response
    setIsThinking(false);
    
    if (result.success && result.response) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response
      }]);
    } else {
      // Show friendly error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ops, não consegui processar agora. Tenta de novo?'
      }]);
    }
    
    return result.success;
  };
  return <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 && <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">
                Comece digitando uma mensagem abaixo.
              </p>
            </div>}
          
          {messages.map((message, idx) => (
            <div key={idx} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                 <Avatar className="h-8 w-8 flex-shrink-0">
                   <AvatarImage src="/lovable-uploads/fae7e475-8296-41b0-9ed6-1f5cf3159fa0.png" alt="Seivah" />
                   <AvatarFallback>S</AvatarFallback>
                 </Avatar>
              )}
              
              <div className="max-w-[70%]">
                <div className={`
                  px-6 py-4 text-sm leading-relaxed shadow-lg
                  ${message.role === 'user' 
                    ? 'bg-coral-primary text-white rounded-[24px] rounded-br-[8px]' 
                    : 'bg-card border border-border text-foreground rounded-[24px] rounded-bl-[8px]'
                  }
                `}>
                  {message.content}
                </div>
              </div>
              
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={profile?.avatar_url || undefined} alt="Usuário" />
                  <AvatarFallback>{profile?.display_name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isThinking && <ThinkingAnimation />}
        </div>

        {/* Fixed Input Area */}
        <div className="border-t border-border backdrop-blur-sm p-4 bg-white/0 rounded-md">
          <form onSubmit={e => {
          e.preventDefault();
          handleSend();
        }} className="relative">
            <div className="flex items-center gap-2 bg-card border border-border rounded-2xl p-2">
              <Input value={input} onChange={e => setInput(e.target.value)} placeholder={isProcessing ? "Processando..." : "Digite sua mensagem..."} disabled={isProcessing} className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-3" />
              <Button type="submit" size="icon" disabled={!input.trim() || isProcessing} className="bg-coral-primary hover:bg-coral-primary/90 text-white rounded-xl h-9 w-9 flex-shrink-0">
                {isProcessing ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>;
}