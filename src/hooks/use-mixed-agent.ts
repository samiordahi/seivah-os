import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MixedResult {
  tipo: 'mixed';
  dados: {
    acoes_identificadas?: string[];
    prioridade?: string[];
  };
  resposta: string;
}

export interface MixedAgentResponse {
  success: boolean;
  result: MixedResult;
  model?: string;
  usage?: any;
  error?: string;
}

export function useMixedAgent() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processMixed = async (message: string): Promise<MixedResult> => {
    setIsProcessing(true);
    
    try {
      console.log('Mixed Agent - Processing message:', message);
      
      const { data, error } = await supabase.functions.invoke('ai-chat/agents/mixed-agent', {
        body: { message }
      });

      if (error) {
        console.error('Error calling mixed-agent:', error);
        throw error;
      }

      const response = data as MixedAgentResponse;
      console.log('Mixed Agent - Response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Mixed agent failed');
      }

      return response.result;
      
    } catch (error) {
      console.error('Error in processMixed:', error);
      // Return fallback response
      return {
        tipo: 'mixed',
        dados: {
          acoes_identificadas: [],
          prioridade: []
        },
        resposta: 'Desculpe, não consegui processar sua solicitação complexa. Tente dividir em partes menores.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processMixed,
    isProcessing
  };
}