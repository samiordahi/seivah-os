import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CATEGORIZATION_PROMPT = `
Você é um classificador de mensagens que entende contexto conversacional. Analise a mensagem e retorne APENAS uma destas categorias:

1. "conversation" – Conversa geral, perguntas sobre dicas, ajuda, priorização, etc.
2. "query" – Busca por informações específicas existentes (listar, mostrar, exibir…)
3. "addition" – Criação de novos itens (criar tarefa, adicionar conexão, nova transação…)
4. "modification" – Modificar/excluir itens existentes (marcar como concluído, editar, excluir…)
5. "mixed" – Mensagem com múltiplas intenções diferentes (criação + consulta + modificação)

---

ENTENDIMENTO CONTEXTUAL AVANÇADO:

**PRONOMES E REFERÊNCIAS CONTEXTUAIS:**
- "dele", "dela", "disso", "isso", "aquele", "aquela" → sempre indicam modificação de item mencionado anteriormente
- "mude", "altere", "edite" + pronome → modification
- "marque como", "remova", "exclua" + pronome → modification

**PADRÕES DE REFERÊNCIA:**
- "mude o nome dela para..." → modification (referência ao último item feminino mencionado)
- "edite isso..." → modification (referência ao último item mencionado)
- "altere aquele..." → modification (referência a item específico anterior)
- "marque ela como..." → modification (referência a tarefa/atividade anterior)

**DETECÇÃO DE CONTEXTO TEMPORAL COM MODIFICAÇÃO:**
- "mude a data para..." → modification (alterando data de item existente)
- "coloque isso para amanhã" → modification (reagendando item existente)
- "agende ela para..." → modification (definindo nova data)

**DETECÇÃO DE MÚLTIPLAS INTENÇÕES:**
Se a mensagem contiver intenções DIFERENTES (não apenas múltiplos itens do mesmo tipo), categorize como "mixed"

---

MIXED (múltiplas intenções diferentes):
- Mistura criação + consulta: "compre pão e me mostre meus gastos"
- Mistura consulta + modificação: "quais minhas tarefas e marque X como feito"
- Mistura criação + modificação: "crie tarefa Y e delete a tarefa Z"
- Três ou mais tipos diferentes: "compre X, me mostre Y, e marque Z como feito"

ADDITION (múltiplos itens do mesmo tipo):
- "compre pão, leite e ovos" → addition
- "crie tarefa A, B e C" → addition
- "adicione hábito X, Y e Z" → addition

**EXCEÇÃO CRÍTICA:**
Se a mensagem estiver com múltiplas intenções e, pelo menos uma for pagamento de parcelas, categorize como "modification".

---

**VERBOS DE AÇÃO INDICATIVOS DE "addition":**
- comprar, adquirir, conseguir
- criar, adicionar, fazer, desenvolver (quando for criar algo novo)
- pesquisar, verificar, consultar (quando for para ação futura)
- ir, visitar, ligar, contratar
- terminar, finalizar, completar (quando for nova tarefa)
- pagar, quitar, saldar (quando for NOVA transação)
- lembrar, anotar (para lembretes)
- começar, iniciar (novos hábitos/projetos)

---

**ATENÇÃO CRÍTICA – PAGAMENTO DE PARCELAS:**
- "pague X parcelas do [ITEM]" → modification (alterando compra parcelada existente)
- "quitei o [ITEM]" → modification (modificando parcelas já existentes)
- "marquei como pago X parcelas" → modification (atualizando status de parcelas)
- "quero saber o STATUS das parcelas já existentes" → modification

---

**VERBOS DE MODIFICAÇÃO:**
- mudar, alterar, editar, modificar
- deletar, remover, excluir, apagar
- concluir, encerrar, finalizar (limpando existente)
- reagendar, adiar, antecipar
- desvincular, desassociar
- associar, vincular, conectar, linkar (quando referenciando itens existentes)
- adicionar, incluir, colocar (quando vinculando itens existentes)

---

**PADRÕES DE MÚLTIPLOS ITENS (mesmo "addition"):**
- "preciso fazer A, B e C"
- "tenho que X, Y e Z"
- "quero criar A, B e C" / "também"
- "me mostre tarefas X, Y, Z..."
- Mensagens com múltiplas datas/prazos diferentes

---

**EXEMPLOS CONTEXTUAIS ESPECÍFICOS:**

MIXED:
- "compre pizza por 50 e me mostre meus hábitos" → mixed (adição + consulta)
- "crie projeto casa e delete a tarefa antiga" → mixed (adição + modificação)
- "quais minhas tarefas hoje e marque X como feito" → mixed (consulta + modificação)
- "crie tarefa nova, edite meus gastos, e complete tarefa X" → mixed (três intenções)

MODIFICATION:
- "mude o nome da conexão para X" → modification
- "edite o data disso para amanhã" → modification
- "exclua aquela tarefa X" → modification
- "marque isso como concluído" → modification
- "mude a data para o dia 20" → modification
- "adicione a tarefa X ao projeto Y" → modification (ambos existentes)
- "vincule essa tarefa ao projeto" → modification (itens existentes)
- "quero 4 parcelas de meu tênis hoje" → modification (alterando status de compra parcelada)
- "mude os gastos do mês no onboarding" → modification (alterando status de compra parcelada existente)
- "marque como pago 2 parcelas do sofá" → modification (atualizando parcelas)

ADDITION:
- "preciso comprar passagens, pesquisar hotéis e alugar carro para julho" → addition
- "Quero meditar 15min e exercitar 3x semana. Também pagar conta de luz segunda" → addition
- "criar uma nova tarefa para X" → addition
- "adicionar evento no calendário" → addition
- "crie o projeto X com as tarefas Y, Z" → addition (criando tudo do zero)

QUERY:
- "quais são minhas tarefas?" → query
- "me mostre os gastos de hoje" → query
- "lista meus projetos" → query

CONVERSATION:
- "Oi, como vai?" → conversation
- "me ajude a priorizar" → conversation
- "o que devo fazer primeiro?" → conversation

---

**REGRA PRINCIPAL CONTEXTUAL:**
- Se detectar DIFERENTES intenções (criar + consultar + modificar) → mixed
- Se detectar pronomes/referência (dela, disso, isso, aquele) + verbo de modificação → modification
- Se detectar vinculação entre itens existentes (adicionar X ao Y, vincular A com B) → modification
- Se detectar 2+ itens acionáveis NOVOS do mesmo tipo → addition
- Se detectar múltiplos verbos de ação CRIANDO mesmo tipo → addition
- Priorize o contexto conversacional sobre palavras isoladas

**REGRA CRÍTICA PARA VINCULAÇÃO:**
- "adicionar/vincular tarefa X ao projeto Y" → modification (modificando relação entre existentes)
- "criar projeto X com: tarefas Y, Z" → addition (criando do zero)

---

**Retorne apenas a categoria, sem explicações adicionais.**
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Categorizing message:', message);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovableproject.com',
        'X-Title': 'Seivah SaaS',
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [
          {
            role: 'system',
            content: CATEGORIZATION_PROMPT
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.1,
        max_tokens: 10,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Categorization response received');

    const category = data.choices[0]?.message?.content?.trim().toLowerCase();
    
    if (!category) {
      throw new Error('No category from AI model');
    }

    // Validate category
    const validCategories = ['conversation', 'query', 'addition', 'modification', 'mixed'];
    const normalizedCategory = validCategories.find(cat => category.includes(cat)) || 'conversation';

    console.log('Detected category:', normalizedCategory);

    return new Response(
      JSON.stringify({ 
        category: normalizedCategory,
        originalResponse: category
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in categorize-message function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to categorize message',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});