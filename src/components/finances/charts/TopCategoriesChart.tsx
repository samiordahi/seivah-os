import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface TopCategoriesChartProps {
  contextFilter: 'all' | 'pessoal' | 'profissional';
}

// Mock data - replace with real data from hook
const mockData = [
  { category: "Moradia", amount: 9800 },
  { category: "Outros", amount: 4800 },
  { category: "Entretenimento", amount: 3908 },
  { category: "Alimentação", amount: 2400 },
  { category: "Transporte", amount: 1398 },
];

export function TopCategoriesChart({ contextFilter }: TopCategoriesChartProps) {
  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Top 5 Categorias</h3>
        <p className="text-sm text-muted-foreground">Maiores gastos por categoria</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData} layout="horizontal">
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              width={80}
            />
            <Tooltip 
              formatter={(value: number) => [
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value),
                'Valor'
              ]}
            />
            <Bar 
              dataKey="amount" 
              fill="hsl(var(--coral-primary))" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}