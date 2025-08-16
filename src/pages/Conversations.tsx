import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';
import { useCaptures } from '@/hooks/use-captures';
import { Send } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

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
    <DashboardLayout>
      <div className="min-h-[70vh] flex flex-col gap-4">
        <Card className="bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Conversas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground">Comece digitando uma mensagem abaixo.</p>
              )}
              {messages.map((m, idx) => (
                <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div className={
                    'inline-block rounded-2xl px-4 py-2 ' +
                    (m.role === 'user' ? 'bg-coral-primary text-white' : 'bg-muted text-foreground')
                  }>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isProcessing ? 'Processando...' : 'Escreva sua mensagem...'}
            disabled={isProcessing}
            className="pr-14"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isProcessing}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-coral-primary hover:bg-coral-primary/90 text-white"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
