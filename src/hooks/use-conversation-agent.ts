import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ConversationResult {
  tipo: 'conversation';
  dados: null;
  resposta: string;
}

export interface ConversationAgentResponse {
  success: boolean;
  result: ConversationResult;
  model?: string;
  usage?: any;
  error?: string;
}

export function useConversationAgent() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processConversation = async (message: string): Promise<ConversationResult> => {
    setIsProcessing(true);
    
    try {
      console.log('Conversation Agent - Processing message:', message);
      
      const { data, error } = await supabase.functions.invoke('ai-chat/agents/conversation-agent', {
        body: { message }
      });

      if (error) {
        console.error('Error calling conversation-agent:', error);
        throw error;
      }

      const response = data as ConversationAgentResponse;
      console.log('Conversation Agent - Response:', response);
      
      if (!response.success) {
        throw new Error(response.error || 'Conversation agent failed');
      }

      return response.result;
      
    } catch (error) {
      console.error('Error in processConversation:', error);
      // Return fallback response
      return {
        tipo: 'conversation',
        dados: null,
        resposta: 'Desculpe, não consegui processar sua mensagem. Tente novamente.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processConversation,
    isProcessing
  };
}