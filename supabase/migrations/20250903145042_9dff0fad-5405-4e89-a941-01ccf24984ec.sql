-- Clean orphaned records and add foreign key constraints for all tables

-- First, remove orphaned records from categories (categories without valid user_id)
DELETE FROM public.categories 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Add foreign key constraint for categories
ALTER TABLE public.categories 
ADD CONSTRAINT categories_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id NOT NULL for categories if it isn't already
ALTER TABLE public.categories 
ALTER COLUMN user_id SET NOT NULL;

-- Clean orphaned records from connections
DELETE FROM public.connections 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Add foreign key constraint for connections
ALTER TABLE public.connections 
ADD CONSTRAINT connections_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id NOT NULL for connections if it isn't already
ALTER TABLE public.connections 
ALTER COLUMN user_id SET NOT NULL;

-- Clean orphaned records from transactions
DELETE FROM public.transactions 
WHERE user_id NOT IN (SELECT id FROM auth.users);

-- Add foreign key constraint for transactions
ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id NOT NULL for transactions if it isn't already
ALTER TABLE public.transactions 
ALTER COLUMN user_id SET NOT NULL;

-- Create memories table (referenced in code but missing from database)
CREATE TABLE IF NOT EXISTS public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT memories_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS for memories
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for memories
CREATE POLICY "Users can view their own memories" 
ON public.memories 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memories" 
ON public.memories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories" 
ON public.memories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories" 
ON public.memories 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for memories updated_at
CREATE TRIGGER update_memories_updated_at
BEFORE UPDATE ON public.memories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();