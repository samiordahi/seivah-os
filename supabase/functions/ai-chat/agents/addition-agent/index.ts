import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ADDITION_AGENT_PROMPT } from './prompt.ts';

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    console.log('Addition Agent - Processing message:', message);

    if (!openRouterApiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://seivah.app',
        'X-Title': 'Seivah Addition Agent'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: ADDITION_AGENT_PROMPT
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Addition Agent - Raw response:', data);
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenRouter response');
    }

    // Try to parse the JSON response from the agent
    let agentResponse;
    try {
      agentResponse = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse agent response as JSON:', content);
      // Fallback response if parsing fails
      agentResponse = {
        tipo: null,
        dados: null,
        resposta: "Não consegui processar sua solicitação. Tente ser mais específico."
      };
    }

    console.log('Addition Agent - Parsed response:', agentResponse);

    return new Response(JSON.stringify({
      success: true,
      result: agentResponse,
      model: data.model,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in addition-agent function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      result: {
        tipo: null,
        dados: null,
        resposta: "Desculpe, ocorreu um erro ao processar sua solicitação."
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});