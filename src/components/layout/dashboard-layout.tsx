import { LayoutDashboard, BarChart3, FolderOpen, CheckSquare, Users, Search, LogOut, MessageSquare, PanelLeftClose, PanelLeftOpen, Edit3, Camera } from "lucide-react";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import userAvatar from "@/assets/user-avatar.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const { profile, updateProfile, uploadAvatar } = useProfile();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigationItems = [
    { title: "Dash", icon: LayoutDashboard, href: "/", isActive: location.pathname === "/" },
    { title: "Finanças", icon: BarChart3, href: "/finances", isActive: location.pathname === "/finances" },
    { title: "Projetos", icon: FolderOpen, href: "/projects", isActive: location.pathname === "/projects" },
    { title: "Tarefas", icon: CheckSquare, href: "/tasks", isActive: location.pathname === "/tasks" },
    { title: "Conexões", icon: Users, href: "/connections", isActive: location.pathname === "/connections" },
    { title: "Conversas", icon: MessageSquare, href: "/conversations", isActive: location.pathname === "/conversations" },
  ];

  const handleNameEdit = () => {
    setEditName(profile?.display_name || '');
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    if (editName.trim()) {
      await updateProfile({ display_name: editName.trim() });
    }
    setIsEditingName(false);
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Usuário';
  const avatarUrl = profile?.avatar_url || userAvatar;

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-muted via-coral-soft to-background">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} min-h-screen bg-gradient-to-b from-coral-secondary/50 to-coral-muted/30 backdrop-blur-sm p-6 transition-all duration-300`}>
          {/* Logo and Collapse Button */}
          <div className="mb-8 flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/f0d3c801-cf7c-4a27-8e94-d8b7dfbb629b.png" alt="Seivah" className="h-8 w-8" />
                <h1 className="text-xl font-bold text-foreground">Seivah</h1>
              </div>
            )}
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
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={avatarUrl} alt="User" />
                  <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute -bottom-1 -right-1 h-6 w-6 bg-card hover:bg-card/80 border border-border"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </>
                )}
              </div>
              {!isCollapsed && (
                <div className="flex-1">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleNameSave();
                          if (e.key === 'Escape') setIsEditingName(false);
                        }}
                        className="h-8 text-sm"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleNameSave}>
                        Salvar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{displayName}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={handleNameEdit}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
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
                Olá, <span className="text-coral-primary">{displayName}</span>
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