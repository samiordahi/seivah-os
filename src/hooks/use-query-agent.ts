import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface QueryResult {
  tipo: 'query';
  dados: any;
  resposta: string;
}

export interface QueryAgentResponse {
  success: boolean;
  result: QueryResult;
  model?: string;
  usage?: any;
  error?: string;
}

export function useQueryAgent() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processQuery = async (message: string): Promise<QueryResult> => {
    setIsProcessing(true);
    
    try {
      console.log('Query Agent - Processing message:', message);
      
      const { data, error } = await supabase.functions.invoke('ai-chat/agents/query-agent', {
        body: { message }
      });

      if (error) {
        console.error('Error calling query-agent:', error);
        throw error;
      }

      const response = data as QueryAgentResponse;
      console.log('Query Agent - Response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Query agent failed');
      }

      return response.result;
      
    } catch (error) {
      console.error('Error in processQuery:', error);
      // Return fallback response
      return {
        tipo: 'query',
        dados: null,
        resposta: 'Desculpe, não consegui processar sua consulta. Tente novamente.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processQuery,
    isProcessing
  };
}