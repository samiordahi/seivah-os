import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";

interface MonthlyFlowChartProps {
  contextFilter: 'all' | 'pessoal' | 'profissional';
}

// Mock data - replace with real data from hook
const mockData = [
  { month: "Jan", receitas: 4000, despesas: 2400 },
  { month: "Fev", receitas: 3000, despesas: 1398 },
  { month: "Mar", receitas: 2000, despesas: 2800 },
  { month: "Abr", receitas: 2780, despesas: 3908 },
  { month: "Mai", receitas: 1890, despesas: 4800 },
  { month: "Jun", receitas: 2390, despesas: 3800 },
  { month: "Jul", receitas: 3490, despesas: 4300 },
];

export function MonthlyFlowChart({ contextFilter }: MonthlyFlowChartProps) {
  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Fluxo Mensal</h3>
        <p className="text-sm text-muted-foreground">Receitas vs Despesas por mês</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--coral-primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--coral-primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#e2e8f0" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              formatter={(value: number) => [
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(value),
                ''
              ]}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="receitas"
              stroke="hsl(var(--coral-primary))"
              fillOpacity={1}
              fill="url(#colorReceitas)"
              strokeWidth={2}
              name="Receitas"
            />
            <Area
              type="monotone"
              dataKey="despesas"
              stroke="#94a3b8"
              fillOpacity={1}
              fill="url(#colorDespesas)"
              strokeWidth={2}
              name="Despesas"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}