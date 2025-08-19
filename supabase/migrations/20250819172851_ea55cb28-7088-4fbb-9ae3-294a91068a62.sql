-- Add status and context fields to transactions table
ALTER TABLE public.transactions 
ADD COLUMN status text NOT NULL DEFAULT 'pendente',
ADD COLUMN context text NOT NULL DEFAULT 'pessoal';

-- Add check constraints for status and context
ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pendente', 'pago', 'vencido'));

ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_context_check 
CHECK (context IN ('pessoal', 'profissional'));

-- Create categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#FF6B6B',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Users can view their own categories" 
ON public.categories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
ON public.categories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
ON public.categories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for categories timestamps
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add category_id foreign key to transactions (optional, for future use)
ALTER TABLE public.transactions 
ADD COLUMN category_id uuid REFERENCES public.categories(id);

-- Create index for better performance
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_context ON public.transactions(context);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_categories_user_id ON public.categories(user_id);