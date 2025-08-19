import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";

interface ExpensesPieChartProps {
  contextFilter: 'all' | 'pessoal' | 'profissional';
}

// Mock data - replace with real data from hook
const mockData = [
  { name: 'Alimentação', value: 2400, color: '#FF6B6B' },
  { name: 'Transporte', value: 1398, color: '#4ECDC4' },
  { name: 'Moradia', value: 9800, color: '#45B7D1' },
  { name: 'Entretenimento', value: 3908, color: '#96CEB4' },
  { name: 'Outros', value: 4800, color: '#FFEAA7' },
];

export function ExpensesPieChart({ contextFilter }: ExpensesPieChartProps) {
  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Despesas por Categoria</h3>
        <p className="text-sm text-muted-foreground">Distribuição dos gastos por categoria</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mockData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value),
                'Valor'
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}