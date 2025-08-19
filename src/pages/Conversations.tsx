import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useCaptures } from '@/hooks/use-captures';
import { useProfile } from '@/hooks/use-profile';
import { Send } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
export default function Conversations() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const location = useLocation();
  const initialMessage = (location.state as any)?.initialMessage as string | undefined;
  const { profile } = useProfile();
  const {
    processCapture,
    isProcessing
  } = useCaptures();
  const hasProcessedInitial = useRef(false);

  // Auto-process initial message when arriving from dashboard
  useEffect(() => {
    const run = async () => {
      if (initialMessage && !hasProcessedInitial.current) {
        hasProcessedInitial.current = true;
        await handleSend(initialMessage);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);
  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setMessages(prev => [...prev, {
      role: 'user',
      content
    }]);
    setInput('');
    const {
      success,
      aiText
    } = await processCapture(content);
    const assistantText = aiText || 'Ok, registrei sua captura.';
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: assistantText
    }]);
    return success;
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
                  <AvatarImage src="/lovable-uploads/f0d3c801-cf7c-4a27-8e94-d8b7dfbb629b.png" alt="Seivah" />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
              )}
              
              <div className="max-w-[70%]">
                <div className={`
                  px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md
                  ${message.role === 'user' 
                    ? 'bg-coral-primary text-white rounded-br-md' 
                    : 'bg-card border border-border text-foreground rounded-bl-md'
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