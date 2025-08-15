import { LayoutDashboard, BarChart3, FolderOpen, CheckSquare, Users, Search } from "lucide-react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatInput } from "@/components/dashboard/chat-input";
import { FinancialChart } from "@/components/dashboard/financial-chart";
import { HabitsChart } from "@/components/dashboard/habits-chart";
import { XPIndicator } from "@/components/dashboard/xp-indicator";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { Button } from "@/components/ui/button";
import userAvatar from "@/assets/user-avatar.png";

const navigationItems = [
  { title: "Dash", icon: LayoutDashboard, href: "/", isActive: true },
  { title: "Finanças", icon: BarChart3, href: "/finances" },
  { title: "Projetos", icon: FolderOpen, href: "/projects" },
  { title: "Tarefas", icon: CheckSquare, href: "/tasks" },
  { title: "Conexões", icon: Users, href: "/connections" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-muted via-coral-soft to-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-gradient-to-b from-coral-secondary/50 to-coral-muted/30 backdrop-blur-sm p-6">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-xl font-bold text-foreground">Seivah</h1>
          </div>
          
          {/* User Profile */}
          <div className="mb-8">
            <div className="flex items-center gap-3 p-4 bg-card/60 backdrop-blur-sm rounded-2xl">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userAvatar} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">Nome Usuário</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <SidebarNav items={navigationItems} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header with Search */}
          <div className="flex justify-end mb-8">
            <Button size="icon" variant="ghost" className="text-coral-primary hover:bg-coral-primary/10">
              <Search className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Chat and Right Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-0">
            {/* Chat Input */}
            <div className="lg:col-span-2">
              <ChatInput />
            </div>
            
            {/* Right Column - Calendar */}
            <div>
              <CalendarWidget />
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <FinancialChart context="professional" />
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <HabitsChart />
                </div>
                <div className="col-span-1">
                  <XPIndicator />
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <UpcomingTasks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
