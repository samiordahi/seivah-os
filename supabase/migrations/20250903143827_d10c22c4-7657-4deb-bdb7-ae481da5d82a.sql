-- Adicionar políticas RLS para a tabela profiles
-- A tabela profiles precisa ter políticas para permitir acesso aos dados dos usuários

-- Política para visualizar o próprio perfil
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (id = auth.uid());

-- Política para inserir o próprio perfil  
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (id = auth.uid());

-- Política para atualizar o próprio perfil
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (id = auth.uid());

-- Adicionar políticas RLS para a tabela transactions
-- As transações devem ser vinculadas ao user_id

-- Política para visualizar as próprias transações
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (user_id = auth.uid());

-- Política para inserir as próprias transações (para quando o n8n inserir)
CREATE POLICY "Users can insert their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Política para atualizar as próprias transações
CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (user_id = auth.uid());

-- Política para deletar as próprias transações
CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (user_id = auth.uid());

-- Também vamos garantir que o user_id não seja nulo na tabela transactions
ALTER TABLE public.transactions 
ALTER COLUMN user_id SET NOT NULL;