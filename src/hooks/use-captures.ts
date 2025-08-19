import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCategorization, MessageCategory } from '@/hooks/use-categorization';

export interface CaptureData {
  transactions?: {
    amount: number;
    description: string;
    type: 'income' | 'expense';
    category?: string;
  }[];
  connections?: {
    name: string;
    type: 'personal' | 'business' | 'client' | 'supplier';
    email?: string;
    phone?: string;
    company?: string;
  }[];
  notes?: string[];
}

export interface AIResponse {
  response: string;
  model: string;
  usage?: any;
}

export function useCaptures() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const { toast } = useToast();
  const { categorizeMessage } = useCategorization();

  const processCapture = async (input: string): Promise<{ success: boolean; aiText?: string; category?: MessageCategory }> => {
    setIsProcessing(true);
    setAiResponse('');
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para adicionar capturas.",
          variant: "destructive",
        });
        return { success: false };
      }

      // Store raw memory first
      const { error: memoryError } = await supabase
        .from('memories')
        .insert({
          user_id: user.id,
          content: input,
          type: 'note',
          processed: false
        });

      if (memoryError) {
        console.error('Memory error:', memoryError);
        throw memoryError;
      }

      // Process message exclusively via categorize-message
      const category = await categorizeMessage(input);
      console.log('Message categorized as:', category);

      // Show success message
      toast({
        title: "Mensagem processada!",
        description: "Sua mensagem foi analisada pelo sistema inteligente.",
      });

      return { success: true, aiText: '', category };
    } catch (error) {
      console.error('Error processing capture:', error);
      toast({
        title: "Erro ao processar",
        description: "Não foi possível processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAiResponse = () => {
    setAiResponse('');
  };

  const clearAllMemories = async (): Promise<boolean> => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para limpar memórias.",
          variant: "destructive",
        });
        return false;
      }

      // Delete all memories for the current user
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing memories:', error);
        toast({
          title: "Erro ao limpar memórias",
          description: "Não foi possível limpar as memórias. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Memórias limpas!",
        description: "Todas as suas memórias foram removidas com sucesso.",
      });
      return true;
    } catch (error) {
      console.error('Error clearing memories:', error);
      toast({
        title: "Erro ao limpar memórias",
        description: "Não foi possível limpar as memórias. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    processCapture,
    isProcessing,
    aiResponse,
    clearAiResponse,
    clearAllMemories
  };
}
