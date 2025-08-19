import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type MessageCategory = 'conversation' | 'query' | 'addition' | 'modification' | 'mixed';

interface CategorizationResponse {
  category: MessageCategory;
  originalResponse: string;
}

export function useCategorization() {
  const [isCategorizing, setIsCategorizing] = useState(false);

  const categorizeMessage = async (message: string): Promise<MessageCategory> => {
    setIsCategorizing(true);
    
    try {
      console.log('Categorizing message:', message);
      
      const { data, error } = await supabase.functions.invoke('categorize-message', {
        body: { message }
      });

      if (error) {
        console.error('Error categorizing message:', error);
        // Fallback to 'conversation' if categorization fails
        return 'conversation';
      }

      const response = data as CategorizationResponse;
      console.log('Message categorized as:', response.category);
      
      return response.category || 'conversation';
      
    } catch (error) {
      console.error('Error in categorizeMessage:', error);
      // Fallback to 'conversation' if categorization fails
      return 'conversation';
    } finally {
      setIsCategorizing(false);
    }
  };

  return {
    categorizeMessage,
    isCategorizing
  };
}