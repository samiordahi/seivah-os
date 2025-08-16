import { Search, LogOut } from "lucide-react";
import { ChatInput } from "@/components/dashboard/chat-input";
import { FinancialChart } from "@/components/dashboard/financial-chart";
import { HabitsChart } from "@/components/dashboard/habits-chart";
import { XPIndicator } from "@/components/dashboard/xp-indicator";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

const Index = () => {
  const { user, signOut } = useAuth();
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-gradient-to-br from-coral-muted via-coral-soft to-background flex w-full">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-medium text-foreground">
                Olá, <span className="text-coral-primary">{user?.email?.split('@')[0] || 'Usuário'}</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-coral-primary hover:bg-coral-primary/10">
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={signOut}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-8">
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
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;