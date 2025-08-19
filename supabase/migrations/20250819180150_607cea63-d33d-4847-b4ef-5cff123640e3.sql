-- Rename table captures to memories
ALTER TABLE public.captures RENAME TO memories;

-- Update RLS policies to reflect the new table name
DROP POLICY "Users can create their own captures" ON public.memories;
DROP POLICY "Users can delete their own captures" ON public.memories;
DROP POLICY "Users can update their own captures" ON public.memories;
DROP POLICY "Users can view their own captures" ON public.memories;

-- Create new RLS policies for memories table
CREATE POLICY "Users can create their own memories" 
ON public.memories 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories" 
ON public.memories 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories" 
ON public.memories 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own memories" 
ON public.memories 
FOR SELECT 
USING (auth.uid() = user_id);