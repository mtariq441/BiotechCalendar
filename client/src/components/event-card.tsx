import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventTypeBadge } from "./event-type-badge";
import { StatusBadge } from "./status-badge";
import { TickerChip } from "./ticker-chip";
import { Star, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { Event, Company } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface EventCardProps {
  event: Event;
  company?: Company;
  onAddToWatchlist?: (eventId: string) => void;
  isWatched?: boolean;
}

export function EventCard({ event, company, onAddToWatchlist, isWatched = false }: EventCardProps) {
  const daysUntil = Math.ceil((new Date(event.dateUtc).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card className="p-4 hover-elevate border-l-4 border-l-primary" data-testid={`event-card-${event.id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <EventTypeBadge type={event.type} />
            <StatusBadge status={event.status} />
            {event.nctId && (
              <span className="text-xs font-mono text-muted-foreground" data-testid="event-nct-id">
                {event.nctId}
              </span>
            )}
          </div>

          <Link href={`/event/${event.id}`}>
            <h3 className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer" data-testid="event-title">
              {event.title}
            </h3>
          </Link>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span className="font-mono" data-testid="event-date">
                {new Date(event.dateUtc).toLocaleDateString("en-US", { 
                  month: "short", 
                  day: "numeric", 
                  year: "numeric" 
                })}
              </span>
            </div>
            {daysUntil > 0 && (
              <span className="font-medium" data-testid="days-until">
                {daysUntil} days away
              </span>
            )}
            {company && (
              <span data-testid="company-name">{company.name}</span>
            )}
          </div>

          {event.relatedTickers && event.relatedTickers.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {event.relatedTickers.map((ticker) => (
                <TickerChip key={ticker} ticker={ticker} variant="outline" />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="icon"
            variant={isWatched ? "default" : "outline"}
            onClick={() => onAddToWatchlist?.(event.id)}
            data-testid="button-watchlist"
          >
            <Star className={`w-4 h-4 ${isWatched ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
