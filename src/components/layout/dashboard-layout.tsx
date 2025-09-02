import { LayoutDashboard, BarChart3, FolderOpen, CheckSquare, Users, Search, LogOut, MessageSquare, PanelLeftClose, PanelLeftOpen, Edit3, Camera, Trash2, Hand } from "lucide-react";
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
export function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const {
    user,
    signOut
  } = useAuth();
  const {
    profile,
    updateProfile,
    uploadAvatar
  } = useProfile();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigationItems = [{
    title: "Dash",
    icon: LayoutDashboard,
    href: "/",
    isActive: location.pathname === "/"
  }, {
    title: "Finanças",
    icon: BarChart3,
    href: "/finances",
    isActive: location.pathname === "/finances"
  }, {
    title: "Projetos",
    icon: FolderOpen,
    href: "/projects",
    isActive: location.pathname === "/projects"
  }, {
    title: "Tarefas",
    icon: CheckSquare,
    href: "/tasks",
    isActive: location.pathname === "/tasks"
  }, {
    title: "Conexões",
    icon: Users,
    href: "/connections",
    isActive: location.pathname === "/connections"
  }, {
    title: "Conversas",
    icon: MessageSquare,
    href: "/conversations",
    isActive: location.pathname === "/conversations"
  }];
  const handleNameEdit = () => {
    setEditName(profile?.display_name || '');
    setIsEditingName(true);
  };
  const handleNameSave = async () => {
    if (editName.trim()) {
      await updateProfile({
        display_name: editName.trim()
      });
    }
    setIsEditingName(false);
  };
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };
  const handleClearMemories = async () => {
    if (confirm('Tem certeza que deseja limpar todas as memórias? Esta ação não pode ser desfeita.')) {
      // TODO: Implementar limpeza via n8n quando necessário
      console.log('Clear memories - será implementado via n8n');
    }
  };
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Usuário';
  const avatarUrl = profile?.avatar_url || userAvatar;
  return <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{
    backgroundImage: "url('/lovable-uploads/ed31b78c-8ec1-4796-9f40-6ff83cbdddb6.png')"
  }}>
      <div className="flex">
        {/* Sidebar */}
        <div className={`${isCollapsed ? 'w-20' : 'w-64'} min-h-screen rounded-2xl backdrop-blur-lg border border-white/20 transition-all duration-300 hover:border-white/30 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-white/5 before:to-transparent before:pointer-events-none bg-white/[0.49] p-6 flex flex-col relative`}>
          {/* Logo and Collapse Button */}
          <div className="mb-8 flex items-center justify-between">
            {!isCollapsed && <div className="flex items-center gap-2">
                <img src="/lovable-uploads/e61ea78e-1309-46a7-995c-89aa70715801.png" alt="Seivah" className="h-8 w-8" />
                <h1 className="text-xl font-bold text-[#df8a7f]">Seivah</h1>
              </div>}
            <Button size="icon" variant="ghost" onClick={() => setIsCollapsed(!isCollapsed)} className="text-muted-foreground hover:text-foreground hover:bg-card/50">
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
                {!isCollapsed && <>
                    <Button size="icon" variant="ghost" className="absolute -bottom-1 -right-1 h-6 w-6 bg-card hover:bg-card/80 border border-border" onClick={() => fileInputRef.current?.click()}>
                      <Camera className="h-3 w-3" />
                    </Button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </>}
              </div>
              {!isCollapsed && <div className="flex-1">
                  {isEditingName ? <div className="flex items-center gap-2">
                      <Input value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') setIsEditingName(false);
                }} className="h-8 text-sm" autoFocus />
                      <Button size="sm" onClick={handleNameSave}>
                        Salvar
                      </Button>
                    </div> : <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{displayName}</p>
                      <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleNameEdit}>
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>}
                </div>}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1">
            <SidebarNav items={navigationItems} isCollapsed={isCollapsed} />
          </div>

          {/* Clear Memories Button - Fixed at bottom */}
          <div className="border-t border-border/50 pt-4 mt-4">
            {!isCollapsed ? <Button variant="ghost" size="sm" onClick={handleClearMemories} className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-3 rounded-2xl">
                <Trash2 className="h-4 w-4" />
                Limpar Memória
              </Button> : <div className="flex justify-center">
                <Button variant="ghost" size="icon" onClick={handleClearMemories} className="w-12 h-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full" title="Limpar Memória">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header with Greeting and Logout */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-medium text-white flex items-center gap-2">
                <img src="/lovable-uploads/9a877381-6901-4c1e-9d31-cd9a57f7868b.png" alt="Acenando" className="h-5 w-5 animate-[wave_1.5s_ease-in-out_infinite] origin-[70%_70%]" />
                Olá, <span className="text-[hsl(var(--button-send))]">{displayName}</span>
              </h2>
            </div>
            <Button size="icon" variant="ghost" onClick={signOut} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>;
}