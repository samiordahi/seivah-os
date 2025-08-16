import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarNavProps {
  items: {
    title: string;
    icon: LucideIcon;
    href: string;
    isActive?: boolean;
  }[];
  isCollapsed?: boolean;
}

export function SidebarNav({ items, isCollapsed = false }: SidebarNavProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200",
            item.isActive
              ? isCollapsed 
                ? "bg-card text-foreground shadow-sm rounded-full w-12 h-12 justify-center p-0"
                : "bg-card text-foreground shadow-sm rounded-2xl"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50 rounded-2xl",
            isCollapsed && !item.isActive && "justify-center rounded-2xl"
          )}
          title={isCollapsed ? item.title : undefined}
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && item.title}
        </a>
      ))}
    </nav>
  );
}