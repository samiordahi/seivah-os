import { Card } from "@/components/ui/card";
import { Clock, FileText } from "lucide-react";

interface UpcomingTasksProps {
  className?: string;
}

const upcomingItems = [
  {
    id: 1,
    title: "Psychology Exam",
    description: "Carry out writing exams in school.",
    date: "18 Jan",
    duration: "45 Minutes",
    type: "exam",
    color: "bg-coral-primary",
  },
  {
    id: 2,
    title: "Mathematics Thory",
    description: "Carry out writing summary in school",
    date: "20 - 31 Jan",
    duration: "3 Hours",
    type: "study",
    color: "bg-gray-400",
  },
  {
    id: 3,
    title: "Literature Exam",
    description: "Carry out writing exams in school.",
    date: "22 Jan",
    duration: "50 Minutes",
    type: "exam",
    color: "bg-coral-primary",
  },
];

export function UpcomingTasks({ className }: UpcomingTasksProps) {
  return (
    <Card className={`p-6 bg-card/90 backdrop-blur-sm border-0 shadow-lg ${className || ""}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">O que está por vir</h3>
      </div>
      
      <div className="space-y-4">
        {upcomingItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full ${item.color} mt-2 flex-shrink-0`}></div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{item.date}</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.duration}</span>
                </div>
              </div>
            </div>
            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
          </div>
        ))}
      </div>
      
      <button className="mt-6 text-sm text-coral-primary hover:text-coral-primary/80 transition-colors flex items-center gap-1">
        View all upcoming <span>→</span>
      </button>
    </Card>
  );
}