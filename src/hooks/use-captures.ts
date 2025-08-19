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

      // First, categorize the message to understand the intent
      const category = await categorizeMessage(input);
      console.log('Message categorized as:', category);

      // Get AI response (only for certain categories)
      let aiResponseText = '';
      if (category === 'conversation' || category === 'addition') {
        try {
          const { data: aiData, error: aiError } = await supabase.functions.invoke('ai-chat', {
            body: { 
              message: input,
              model: "meta-llama/llama-3.1-8b-instruct:free"
            }
          });
          if (aiError) throw aiError;
          aiResponseText = aiData?.response || '';
          setAiResponse(aiResponseText);
        } catch (err) {
          console.error('AI chat error:', err);
        }
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
          
          if (error) {
            console.error('Transaction insert error:', error);
            // Don't throw, continue with other operations
          }
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
          
          if (error) {
            console.error('Connection insert error:', error);
            // Don't throw, continue with other operations
          }
        }
      }

      // Show success message with AI response
      toast({
        title: "Captura processada!",
        description: "Sua captura foi analisada e organizada com sucesso.",
      });

      return { success: true, aiText: aiResponseText, category };
    } catch (error) {
      console.error('Error processing capture:', error);
      toast({
        title: "Erro ao processar",
        description: "Não foi possível processar sua captura. Tente novamente.",
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

  return {
    processCapture,
    isProcessing,
    aiResponse,
    clearAiResponse
  };
}

// Enhanced parsing logic - can be improved with AI later
function parseInput(input: string): CaptureData {
  const result: CaptureData = {};
  const text = input.toLowerCase();

  // Check for financial transactions
  const moneyPattern = /(?:r\$|reais?|\$)\s*(\d+(?:[.,]\d{2})?)/gi;
  const incomeKeywords = ['recebi', 'ganhou', 'salário', 'vendeu', 'entrada', 'receita'];
  const expenseKeywords = ['gastou', 'comprou', 'pagou', 'saída', 'despesa', 'conta'];

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