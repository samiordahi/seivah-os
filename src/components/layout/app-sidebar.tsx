import { LayoutDashboard, BarChart3, FolderOpen, CheckSquare, Users, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import userAvatar from "@/assets/user-avatar.png";

const navigationItems = [
  { title: "Dash", icon: LayoutDashboard, href: "/" },
  { title: "Finanças", icon: BarChart3, href: "/finances" },
  { title: "Projetos", icon: FolderOpen, href: "/projects" },
  { title: "Tarefas", icon: CheckSquare, href: "/tasks" },
  { title: "Conexões", icon: Users, href: "/connections" },
  { title: "Conversas", icon: MessageSquare, href: "/conversations" },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="bg-gradient-to-b from-coral-secondary/50 to-coral-muted/30 backdrop-blur-sm border-r border-border/50">
      <SidebarHeader className="p-6">
        {/* Logo */}
        <div className="mb-8">
          <h1 className={cn(
            "font-bold text-foreground transition-all duration-200",
            isCollapsed ? "text-sm text-center" : "text-xl"
          )}>
            {isCollapsed ? "S" : "Seivah"}
          </h1>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
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
        )}

        {isCollapsed && (
          <div className="mb-8 flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200",
                          isActive
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/50",
                          isCollapsed && "justify-center"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}