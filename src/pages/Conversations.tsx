import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useCaptures } from '@/hooks/use-captures';
import { Send } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ChatMessage } from '@/components/conversations/chat-message';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Conversations() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const location = useLocation();
  const initialMessage = (location.state as any)?.initialMessage as string | undefined;
  const { processCapture, isProcessing } = useCaptures();
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

    setMessages(prev => [...prev, { role: 'user', content }]);
    setInput('');

    const { success, aiText } = await processCapture(content);
    const assistantText = aiText || 'Ok, registrei sua captura.';
    setMessages(prev => [...prev, { role: 'assistant', content: assistantText }]);
    return success;
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-coral-muted via-coral-soft to-background flex w-full">
        <AppSidebar />
        
        <SidebarInset className="flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Conversa</h1>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            <ScrollArea className="flex-1">
              <div className="min-h-0">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Comece uma nova conversa digitando uma mensagem abaixo.</p>
                  </div>
                ) : (
                  <div>
                    {messages.map((message, idx) => (
                      <ChatMessage
                        key={idx}
                        role={message.role}
                        content={message.content}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t bg-background p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative max-w-4xl mx-auto">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isProcessing ? 'Processando...' : 'Escreva sua mensagem...'}
                  disabled={isProcessing}
                  className="pr-14 h-12 bg-background border-input"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isProcessing}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-coral-primary hover:bg-coral-primary/90 text-white"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
