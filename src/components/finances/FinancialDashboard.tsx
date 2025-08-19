import { KPICard } from "./KPICard";
import { ExpensesPieChart } from "./charts/ExpensesPieChart";
import { MonthlyFlowChart } from "./charts/MonthlyFlowChart";
import { TopCategoriesChart } from "./charts/TopCategoriesChart";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react";

interface FinancialDashboardProps {
  contextFilter: 'all' | 'pessoal' | 'profissional';
}

export function FinancialDashboard({ contextFilter }: FinancialDashboardProps) {
  const { data: summary, isLoading } = useFinancialSummary(contextFilter);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const kpis = [
    {
      title: "Receita Total",
      value: summary?.totalIncome || 0,
      icon: TrendingUp,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Despesa Total",
      value: summary?.totalExpense || 0,
      icon: TrendingDown,
      trend: "-5%",
      trendUp: false,
    },
    {
      title: "Saldo Atual",
      value: (summary?.totalIncome || 0) - (summary?.totalExpense || 0),
      icon: DollarSign,
      trend: "+7%",
      trendUp: true,
    },
    {
      title: "Transações no Mês",
      value: summary?.monthlyTransactions || 0,
      icon: CreditCard,
      trend: "+3",
      trendUp: true,
      isCount: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensesPieChart contextFilter={contextFilter} />
        <TopCategoriesChart contextFilter={contextFilter} />
      </div>

      {/* Monthly Flow Chart - Full Width */}
      <div className="w-full">
        <MonthlyFlowChart contextFilter={contextFilter} />
      </div>
    </div>
  );
}