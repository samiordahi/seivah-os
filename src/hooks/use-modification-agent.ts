import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ModificationResult {
  tipo: 'modification';
  dados: any;
  resposta: string;
}

export interface ModificationAgentResponse {
  success: boolean;
  result: ModificationResult;
  model?: string;
  usage?: any;
  error?: string;
}

export function useModificationAgent() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processModification = async (message: string): Promise<ModificationResult> => {
    setIsProcessing(true);
    
    try {
      console.log('Modification Agent - Processing message:', message);
      
      const { data, error } = await supabase.functions.invoke('ai-chat/agents/modification-agent', {
        body: { message }
      });

      if (error) {
        console.error('Error calling modification-agent:', error);
        throw error;
      }

      const response = data as ModificationAgentResponse;
      console.log('Modification Agent - Response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Modification agent failed');
      }

      return response.result;
      
    } catch (error) {
      console.error('Error in processModification:', error);
      // Return fallback response
      return {
        tipo: 'modification',
        dados: null,
        resposta: 'Desculpe, não consegui processar sua solicitação de modificação. Tente novamente.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processModification,
    isProcessing
  };
}