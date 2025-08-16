import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

export function useCaptures() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processCapture = async (input: string) => {
    setIsProcessing(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para adicionar capturas.",
          variant: "destructive",
        });
        return false;
      }

      // Store raw capture first
      const { error: captureError } = await supabase
        .from('captures')
        .insert({
          user_id: user.id,
          content: input,
          type: 'note',
          processed: false
        });

      if (captureError) {
        console.error('Capture error:', captureError);
        throw captureError;
      }

      // Parse the input to identify types and extract data
      const parsedData = parseInput(input);
      
      // Process transactions
      if (parsedData.transactions?.length) {
        for (const transaction of parsedData.transactions) {
          const { error } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              ...transaction
            });
          
          if (error) throw error;
        }
      }

      // Process connections
      if (parsedData.connections?.length) {
        for (const connection of parsedData.connections) {
          const { error } = await supabase
            .from('connections')
            .insert({
              user_id: user.id,
              ...connection
            });
          
          if (error) throw error;
        }
      }

      // Show success message
      const itemCount = (parsedData.transactions?.length || 0) + (parsedData.connections?.length || 0);
      if (itemCount > 0) {
        toast({
          title: "Captura processada!",
          description: `${itemCount} item(s) adicionado(s) com sucesso.`,
        });
      } else {
        toast({
          title: "Nota salva!",
          description: "Sua captura foi salva como uma nota.",
        });
      }

      return true;
    } catch (error) {
      console.error('Error processing capture:', error);
      toast({
        title: "Erro ao processar",
        description: "Não foi possível processar sua captura. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processCapture,
    isProcessing
  };
}

// Simple parsing logic - can be enhanced with AI later
function parseInput(input: string): CaptureData {
  const result: CaptureData = {};
  const text = input.toLowerCase();

  // Check for financial transactions
  const moneyPattern = /(?:r\$|reais?|\$)\s*(\d+(?:[.,]\d{2})?)/gi;
  const incomeKeywords = ['recebi', 'ganhou', 'salário', 'vendeu', 'entrada'];
  const expenseKeywords = ['gastou', 'comprou', 'pagou', 'saída', 'despesa'];

  const moneyMatches = Array.from(input.matchAll(moneyPattern));
  
  if (moneyMatches.length > 0) {
    result.transactions = [];
    
    for (const match of moneyMatches) {
      const amount = parseFloat(match[1].replace(',', '.'));
      const isIncome = incomeKeywords.some(keyword => text.includes(keyword));
      const isExpense = expenseKeywords.some(keyword => text.includes(keyword));
      
      result.transactions.push({
        amount,
        description: input.substring(0, 100), // Truncate description
        type: isIncome ? 'income' : 'expense',
        category: isExpense ? 'geral' : undefined
      });
    }
  }

  // Check for contact information
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phonePattern = /\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4}/g;
  
  const emails = input.match(emailPattern);
  const phones = input.match(phonePattern);
  
  if (emails || phones) {
    result.connections = [];
    
    // Extract name (first few words before contact info)
    const words = input.split(' ');
    const name = words.slice(0, 3).join(' ') || 'Contato';
    
    result.connections.push({
      name,
      type: 'personal',
      email: emails?.[0],
      phone: phones?.[0]
    });
  }

  return result;
}