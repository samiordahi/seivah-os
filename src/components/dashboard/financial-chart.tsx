import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Fev", income: 3000, expenses: 1398 },
  { month: "Mar", income: 2000, expenses: 9800 },
  { month: "Abr", income: 2780, expenses: 3908 },
  { month: "Mai", income: 1890, expenses: 4800 },
  { month: "Jun", income: 2390, expenses: 3800 },
  { month: "Jul", income: 3490, expenses: 4300 },
];

interface FinancialChartProps {
  context: "personal" | "professional";
}

export function FinancialChart({ context }: FinancialChartProps) {
  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Fluxo Financeiro</h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-coral-primary"></div>
            <span className="text-muted-foreground">Gasto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-muted-foreground">Examination</span>
          </div>
        </div>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--coral-primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--coral-primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
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
            <YAxis hide />
            <Area
              type="monotone"
              dataKey="income"
              stroke="hsl(var(--coral-primary))"
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#94a3b8"
              fillOpacity={1}
              fill="url(#colorExpenses)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="bg-coral-primary text-white px-3 py-1 rounded-full text-sm font-medium">
          7,6B
        </div>
      </div>
    </Card>
  );
}