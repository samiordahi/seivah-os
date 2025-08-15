import { Card } from "@/components/ui/card";

const calendar = {
  month: "Janeiro 2025",
  days: [
    [30, 30, 30, 31, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31],
  ],
  highlightedDays: [19, 22],
};

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarWidget() {
  const isCurrentMonth = (day: number, weekIndex: number) => {
    return !(weekIndex === 0 && day > 15) && !(weekIndex === 4 && day < 15);
  };

  const isHighlighted = (day: number) => {
    return calendar.highlightedDays.includes(day);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{calendar.month}</h3>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-xs font-medium text-muted-foreground text-center py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendar.days.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <button
              key={`${weekIndex}-${dayIndex}`}
              className={`
                w-8 h-8 text-sm rounded-lg transition-colors
                ${
                  isCurrentMonth(day, weekIndex)
                    ? isHighlighted(day)
                      ? "bg-coral-primary text-white font-medium"
                      : "text-foreground hover:bg-muted"
                    : "text-muted-foreground/50"
                }
              `}
            >
              {day}
            </button>
          ))
        )}
      </div>
    </div>
  );
}