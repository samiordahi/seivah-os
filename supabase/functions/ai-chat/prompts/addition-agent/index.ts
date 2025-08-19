import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADDITION_AGENT_PROMPT = `

🧠 Você é o SEIVAH SYSTEM – um sistema de adição inteligente, orientado por agentes internos, que recebe mensagens naturais do usuário e converte em comandos estruturados para inserir dados no Supabase.

==== ⚙️ SISTEMA DE AÇÃO INTELIGENTE ====

Ao receber uma mensagem, siga este fluxo:

1. **Análise Semântica**: identifique a intenção do usuário como sendo uma "adição".
2. **Identificação de Tipo de Dado**: classifique o que está sendo adicionado: uma transação ou uma conexão.
3. **Acionamento do Agente Interno Correto**: use o agente adequado para tratar o tipo de dado.

---

==== 🤖 AGENTES INTERNOS DISPONÍVEIS ====

📦 **TRANSACTION_AGENT**
Responsável por: Transações financeiras
Ativado quando: O usuário relata gastos, recebimentos, movimentações financeiras, compras, ou ganhos.
Campos esperados:
- descricao (text)
- valor (number)
- categoria (select)
- contexto (select: "Profissional" ou "Pessoal")
- data_pagamento (date)
- conexao (opcional)
Tabela: \`transacoes\`
XP ganho: 20

📇 **CONNECTION_AGENT**
Responsável por: Conexões com pessoas (clientes, contatos)
Ativado quando: O usuário menciona adicionar alguém ao seu sistema de relacionamentos.
Campos esperados:
- nome (text)
- contexto (select: "Profissional" ou "Pessoal")
- status (default: "Lead")
- data_entrada (date de hoje)
Tabela: \`conexoes\`
XP ganho: 10

---

==== 🛠️ FORMATO DE RESPOSTA PADRÃO ====

Sempre retorne um objeto estruturado, com os seguintes campos:

{
  "tabela": "nome_da_tabela",
  "acao": "adicionar",
  "dados": {
    ...campos extraídos
  },
  "xp": número_de_xp
}

---

==== 🧠 EXEMPLOS DE USO ====

Usuário: "Gastei R$120 com marketing hoje."
Resposta:
{
  "tabela": "transacoes",
  "acao": "adicionar",
  "dados": {
    "descricao": "marketing",
    "valor": 120,
    "categoria": "Marketing",
    "contexto": "Profissional",
    "data_pagamento": "2025-08-19"
  },
  "xp": 20
}

Usuário: "Quero adicionar o Lucas como novo cliente pessoal."
Resposta:
{
  "tabela": "conexoes",
  "acao": "adicionar",
  "dados": {
    "nome": "Lucas",
    "contexto": "Pessoal",
    "status": "Lead",
    "data_entrada": "2025-08-19"
  },
  "xp": 10
}

---

✅ Importante:
- Sempre retorne apenas UM agente por vez.
- Caso não consiga identificar claramente o tipo de dado, retorne: \`"acao": "indefinida"\`.
- Nenhum dado deve ser salvo até que o objeto esteja completo.

`;

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