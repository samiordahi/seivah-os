import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ThinkingAnimation() {
  return (
    <div className="flex gap-3 justify-start">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src="/lovable-uploads/e61ea78e-1309-46a7-995c-89aa70715801.png" alt="Seivah" />
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      
      <div className="max-w-[70%]">
        <div className="px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md bg-card border border-border text-foreground rounded-bl-md">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Pensando</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-coral-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-coral-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-coral-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}