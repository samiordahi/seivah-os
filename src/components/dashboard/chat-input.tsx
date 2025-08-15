import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ChatInput() {
  return (
    <Card className="px-6 py-4 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="text-center mb-3">
        <h2 className="text-xl font-medium text-foreground mb-1">
          Olá, <span className="text-coral-primary">Usuário</span>
        </h2>
        <p className="text-muted-foreground">
          O que deseja <span className="text-coral-primary font-medium">capturar</span> agora?
        </p>
      </div>
      
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Escreva qualquer coisa..."
          className="w-full px-6 py-4 bg-muted/50 border-0 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-coral-primary/20 transition-all"
        />
        <Button 
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-coral-primary hover:bg-coral-primary/90 text-white rounded-xl"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}