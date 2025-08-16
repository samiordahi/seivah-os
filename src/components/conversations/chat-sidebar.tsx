import { MessageSquare, Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

export function ChatSidebar() {
  const { state } = useSidebar();

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          {state === 'expanded' && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 justify-start gap-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              Nova conversa
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {state === 'expanded' && (
            <SidebarGroupLabel>Conversas Recentes</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <MessageSquare className="h-4 w-4" />
                  {state === 'expanded' && (
                    <span className="truncate">Conversa atual</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}