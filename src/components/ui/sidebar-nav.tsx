import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarNavProps {
  items: {
    title: string;
    icon: LucideIcon;
    href: string;
    isActive?: boolean;
  }[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200",
            item.isActive
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-card/50"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.title}
        </a>
      ))}
    </nav>
  );
}