import { ChatInput } from "@/components/dashboard/chat-input";
import { FinancialChart } from "@/components/dashboard/financial-chart";
import { HabitsChart } from "@/components/dashboard/habits-chart";
import { XPIndicator } from "@/components/dashboard/xp-indicator";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Layout principal: 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Chat + Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          <ChatInput />
          <FinancialChart context="professional" />
          <div className="grid grid-cols-3 gap-6 items-end">
            <div className="col-span-2">
              <HabitsChart />
            </div>
            <div className="col-span-1">
              <XPIndicator />
            </div>
          </div>
        </div>

        {/* Coluna Direita: calendário solto + tarefas */}
        <div className="space-y-4">
          {/* Calendário – sem card wrapper */}
          <CalendarWidget />

          {/* Linha divisória */}
          <div className="w-full h-px bg-border/30"></div>

          {/* O que está por vir – sem card wrapper */}
          <UpcomingTasks className="bg-transparent border-0 shadow-none" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;