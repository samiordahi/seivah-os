import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdditionResult {
  tipo: 'transacao' | 'conexao' | 'tarefa' | 'projeto' | null;
  dados: any;
  resposta: string;
}

export interface AdditionAgentResponse {
  success: boolean;
  result: AdditionResult;
  model?: string;
  usage?: any;
  error?: string;
}

export function useAdditionAgent() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processAddition = async (message: string): Promise<AdditionResult> => {
    setIsProcessing(true);
    
    try {
      console.log('Addition Agent - Processing message:', message);
      
      const { data, error } = await supabase.functions.invoke('ai-chat/prompts/addition-agent', {
        body: { message }
      });

      if (error) {
        console.error('Error calling addition-agent:', error);
        throw error;
      }

      const response = data as AdditionAgentResponse;
      console.log('Addition Agent - Response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Addition agent failed');
      }

      return response.result;
      
    } catch (error) {
      console.error('Error in processAddition:', error);
      // Return fallback response
      return {
        tipo: null,
        dados: null,
        resposta: 'Desculpe, não consegui processar sua solicitação. Tente novamente.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processAddition,
    isProcessing
  };
}