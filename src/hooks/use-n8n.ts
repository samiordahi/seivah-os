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
        return { success: false };
      }

      console.log('Sending message to n8n:', message);

      // Send to n8n webhook
      const response = await fetch('https://n8n.samiraordahi.com.br/webhook-test/seivah', {
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

      // Try to parse JSON response, but don't fail if it's not the expected format
      try {
        const result: N8nResponse = await response.json();
        console.log('n8n response:', result);
        
        return { 
          success: true, 
          response: result.response,
          category: result.category 
        };
      } catch (parseError) {
        // If we can't parse JSON or format is different, still consider it successful
        // since the webhook was received by n8n (200 status)
        console.log('n8n webhook sent successfully, response format may vary:', parseError);
        return { success: true };
      }

    } catch (error) {
      console.error('Error sending message to n8n:', error);
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