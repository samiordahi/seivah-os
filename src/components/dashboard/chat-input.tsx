import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processInput = async (text: string) => {
    const lowercaseText = text.toLowerCase();

    // Simple pattern matching for different types of captures
    if (lowercaseText.includes('transação') || lowercaseText.includes('gasto') || lowercaseText.includes('receita') || lowercaseText.match(/\$|r\$|\d+/)) {
      return await processTransaction(text);
    } else if (lowercaseText.includes('contato') || lowercaseText.includes('conexão') || lowercaseText.includes('pessoa')) {
      return await processConnection(text);
    } else {
      return await processCapture(text);
    }
  };

  const processTransaction = async (text: string) => {
    // Extract amount from text (simple regex for demonstration)
    const amountMatch = text.match(/\d+(?:\.\d{2})?/);
    const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;
    
    const type = text.toLowerCase().includes('receita') || text.toLowerCase().includes('ganho') ? 'income' : 'expense';
    
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        amount,
        description: text,
        type,
        category: 'geral'
      });

    if (error) throw error;
    return { type: 'transaction', data };
  };

  const processConnection = async (text: string) => {
    const { data, error } = await supabase
      .from('connections')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        name: text.replace(/contato|conexão|pessoa/gi, '').trim(),
        type: 'personal',
        notes: text
      });

    if (error) throw error;
    return { type: 'connection', data };
  };

  const processCapture = async (text: string) => {
    const { data, error } = await supabase
      .from('captures')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        content: text,
        type: 'note'
      });

    if (error) throw error;
    return { type: 'capture', data };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await processInput(input);
      
      toast({
        title: "Captura realizada!",
        description: `${result.type === 'transaction' ? 'Transação' : result.type === 'connection' ? 'Conexão' : 'Nota'} salva com sucesso.`,
      });
      
      setInput("");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a captura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="p-6 px-0 py-[14px]">
      <div className="text-center mb-4">
        <p className="text-muted-foreground text-xl">
          O que deseja <span className="text-coral-primary font-medium">capturar</span> agora?
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
        <input 
          type="text" 
          placeholder="Escreva qualquer coisa..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="w-full border-0 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral-primary/20 transition-all bg-card/90 backdrop-blur-sm shadow-lg mx-0 px-[20px] py-[25px]" 
        />
        <Button 
          type="submit"
          size="icon" 
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-coral-primary hover:bg-coral-primary/90 text-white rounded-xl disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>;
}