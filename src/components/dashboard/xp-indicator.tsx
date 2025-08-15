import { Card } from "@/components/ui/card";
import { ProgressCircle } from "@/components/ui/progress-circle";
export function XPIndicator() {
  return <Card className="p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Pontos de XP</h3>
      
      <div className="flex flex-col items-center">
        <ProgressCircle value={68} size={100}>
          <div className="text-center">
            <div className="text-2xl font-bold text-coral-primary">68%</div>
          </div>
        </ProgressCircle>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">Good work!</p>
          
        </div>
      </div>
    </Card>;
}