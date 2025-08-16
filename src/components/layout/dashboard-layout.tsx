import { LayoutDashboard, BarChart3, FolderOpen, CheckSquare, Users, Search, LogOut, MessageSquare, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import userAvatar from "@/assets/user-avatar.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    { title: "Dash", icon: LayoutDashboard, href: "/", isActive: location.pathname === "/" },
    { title: "Finanças", icon: BarChart3, href: "/finances", isActive: location.pathname === "/finances" },
    { title: "Projetos", icon: FolderOpen, href: "/projects", isActive: location.pathname === "/projects" },
    { title: "Tarefas", icon: CheckSquare, href: "/tasks", isActive: location.pathname === "/tasks" },
    { title: "Conexões", icon: Users, href: "/connections", isActive: location.pathname === "/connections" },
    { title: "Conversas", icon: MessageSquare, href: "/conversations", isActive: location.pathname === "/conversations" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-muted via-coral-soft to-background">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} min-h-screen bg-gradient-to-b from-coral-secondary/50 to-coral-muted/30 backdrop-blur-sm p-6 transition-all duration-300`}>
          {/* Logo and Collapse Button */}
          <div className="mb-8 flex items-center justify-between">
            {!isCollapsed && <h1 className="text-xl font-bold text-foreground">Seivah</h1>}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-muted-foreground hover:text-foreground hover:bg-card/50"
            >
              {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </Button>
          </div>

          {/* User Profile */}
          <div className="mb-8">
            <div className={`flex items-center gap-3 p-4 rounded-2xl ${isCollapsed ? 'justify-center bg-transparent p-2' : 'bg-card/60 backdrop-blur-sm'}`}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={userAvatar} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div>
                  <p className="font-medium text-foreground">Nome Usuário</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <SidebarNav items={navigationItems} isCollapsed={isCollapsed} />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header with Greeting and Logout */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-medium text-foreground">
                Olá, <span className="text-coral-primary">{user?.email?.split('@')[0] || 'Usuário'}</span>
              </h2>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={signOut}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}