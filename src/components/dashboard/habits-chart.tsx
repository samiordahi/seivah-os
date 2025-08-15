import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { day: "T", value: 80 },
  { day: "W", value: 60 },
  { day: "T", value: 90 },
  { day: "F", value: 70 },
  { day: "S", value: 85 },
  { day: "S", value: 95 },
  { day: "M", value: 75 },
];

export function HabitsChart() {
  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Frequência de Hábitos</h3>
        <button className="text-sm text-coral-primary hover:text-coral-primary/80 transition-colors">
          View All
        </button>
      </div>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <XAxis 
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--coral-primary))"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}