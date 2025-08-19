-- Inserir transações de exemplo para demonstração
INSERT INTO public.transactions (user_id, amount, description, category, type, date, status, context) 
SELECT 
  auth.uid() as user_id,
  amount,
  description, 
  category,
  type,
  date,
  status,
  context
FROM (
  VALUES 
    (1500.00, 'Freelance - Desenvolvimento Website', 'Freelance', 'receita', '2025-01-15', 'pago', 'profissional'),
    (-450.00, 'Aluguel Escritório', 'Aluguel', 'despesa', '2025-01-10', 'pago', 'profissional'),
    (2800.00, 'Salário Janeiro', 'Salário', 'receita', '2025-01-05', 'pendente', 'pessoal'),
    (-180.00, 'Supermercado', 'Alimentação', 'despesa', '2025-01-18', 'vencido', 'pessoal')
) AS example_data(amount, description, category, type, date, status, context)
WHERE auth.uid() IS NOT NULL;