import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  isCount?: boolean;
}

export function KPICard({ title, value, icon: Icon, trend, trendUp, isCount }: KPICardProps) {
  const formatValue = (val: number) => {
    if (isCount) return val.toString();
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-coral-primary/10">
            <Icon className="h-5 w-5 text-coral-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{formatValue(value)}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          trendUp ? 'text-green-600' : 'text-destructive'
        }`}>
          <span>{trend}</span>
        </div>
      </div>
    </Card>
  );
}