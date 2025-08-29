import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface N8nResponse {
  success: boolean;
  response: string;
  category?: string;
  error?: string;
}

export function useN8n() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const sendMessageToN8n = async (message: string): Promise<{ success: boolean; response?: string; category?: string }> => {
    setIsProcessing(true);
    
    try {
      // Get current user and session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (userError || !user || sessionError || !session) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para enviar mensagens.",
          variant: "destructive",
        });
        return { success: false };
      }

      console.log('Sending message to n8n:', message);

      // Send to n8n webhook
      const response = await fetch('https://webhook-url-placeholder.com/webhook/process-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message,
          user_id: user.id,
          access_token: session.access_token,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: N8nResponse = await response.json();
      console.log('n8n response:', result);

      if (!result.success) {
        throw new Error(result.error || 'n8n processing failed');
      }

      // Show success message
      toast({
        title: "Mensagem processada!",
        description: "Sua mensagem foi analisada pelo sistema inteligente.",
      });

      return { 
        success: true, 
        response: result.response,
        category: result.category 
      };

    } catch (error) {
      console.error('Error sending message to n8n:', error);
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

  return {
    sendMessageToN8n,
    isProcessing
  };
}