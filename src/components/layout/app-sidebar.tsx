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
  SidebarTrigger,
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
    <Sidebar className="bg-gradient-to-b from-[#F5E6D8] to-[#E8D5C4] border-r border-border/50">
      <SidebarHeader className="p-6">
        {/* Collapse Toggle */}
        <div className="mb-6 flex justify-end">
          <SidebarTrigger className="h-8 w-8" />
        </div>
        
        {/* Logo */}
        <div className="mb-8">
          <h1 className={cn(
            "font-bold text-[#8B5A3C] transition-all duration-200",
            isCollapsed ? "text-sm text-center" : "text-xl"
          )}>
            {isCollapsed ? "S" : "Seivah"}
          </h1>
        </div>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="mb-8">
            <div className="flex items-center gap-3 p-4 bg-white/40 backdrop-blur-sm rounded-2xl">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userAvatar} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-[#8B5A3C]">Nome Usuário</p>
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
                          "flex items-center gap-3 px-4 py-4 mb-2 text-sm font-medium rounded-2xl transition-all duration-200",
                          isActive
                            ? "bg-white/60 text-[#8B5A3C] shadow-sm"
                            : "text-[#A67B5B] hover:text-[#8B5A3C] hover:bg-white/40",
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