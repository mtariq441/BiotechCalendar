import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventTypeBadge } from "./event-type-badge";
import { Link } from "wouter";
import type { Event } from "@shared/schema";

interface CalendarGridProps {
  events: Event[];
  currentMonth: Date;
}

export function CalendarGrid({ events, currentMonth }: CalendarGridProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  // Get first day of month and total days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Create array of days to display
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  // Group events by date
  const eventsByDate: { [key: string]: Event[] } = {};
  events.forEach((event) => {
    const date = new Date(event.dateUtc);
    if (date.getMonth() === month && date.getFullYear() === year) {
      const day = date.getDate();
      if (!eventsByDate[day]) {
        eventsByDate[day] = [];
      }
      eventsByDate[day].push(event);
    }
  });
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div className="space-y-3" data-testid="calendar-grid">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2">
        {dayNames.map((day) => (
          <div key={day} className="text-xs font-semibold uppercase tracking-wide text-center text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <Card
            key={index}
            className={`aspect-square p-2 ${!day ? "bg-muted/30" : "hover-elevate"}`}
            data-testid={day ? `calendar-day-${day}` : undefined}
          >
            {day && (
              <div className="h-full flex flex-col">
                <div className="text-sm font-medium mb-2">{day}</div>
                <div className="flex-1 space-y-1 overflow-hidden">
                  {eventsByDate[day]?.slice(0, 3).map((event) => (
                    <Link key={event.id} href={`/event/${event.id}`}>
                      <div className="h-6 px-2 rounded text-xs truncate flex items-center gap-1 hover-elevate cursor-pointer border bg-card">
                        <EventTypeBadge type={event.type} showIcon={false} variant="secondary" />
                      </div>
                    </Link>
                  ))}
                  {eventsByDate[day] && eventsByDate[day].length > 3 && (
                    <div className="text-xs text-muted-foreground px-2">
                      +{eventsByDate[day].length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
