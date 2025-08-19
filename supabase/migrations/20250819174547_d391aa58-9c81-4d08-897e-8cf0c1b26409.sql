-- Adicionar colunas Status e Contexto na tabela transactions
ALTER TABLE public.transactions 
ADD COLUMN status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido'));

ALTER TABLE public.transactions 
ADD COLUMN context text NOT NULL DEFAULT 'pessoal' CHECK (context IN ('pessoal', 'profissional'));