import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventTypeBadge } from "./event-type-badge";
import { StatusBadge } from "./status-badge";
import { TickerChip } from "./ticker-chip";
import { Star, Calendar, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { Event, Company } from "@shared/schema";
import { motion } from "framer-motion";

interface EventCardProps {
  event: Event;
  company?: Company;
  onAddToWatchlist?: (eventId: string) => void;
  isWatched?: boolean;
}

export function EventCard({ event, company, onAddToWatchlist, isWatched = false }: EventCardProps) {
  const daysUntil = Math.ceil((new Date(event.dateUtc).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-5 border-l-4 border-l-primary relative overflow-hidden group" data-testid={`event-card-${event.id}`}>
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <EventTypeBadge type={event.type} />
              <StatusBadge status={event.status} />
              {event.nctId && (
                <span className="text-xs font-mono px-2 py-1 rounded bg-muted text-muted-foreground" data-testid="event-nct-id">
                  {event.nctId}
                </span>
              )}
            </div>

            <Link href={`/event/${event.id}`}>
              <motion.h3 
                className="text-lg font-semibold mb-2 hover:text-primary cursor-pointer flex items-center gap-1 group/title" 
                data-testid="event-title"
              >
                {event.title}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
              </motion.h3>
            </Link>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span className="font-medium" data-testid="event-date">
                  {new Date(event.dateUtc).toLocaleDateString("en-US", { 
                    month: "short", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                </span>
              </div>
              {daysUntil > 0 && (
                <motion.span 
                  className="px-2 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs" 
                  data-testid="days-until"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {daysUntil} days away
                </motion.span>
              )}
              {company && (
                <span className="font-medium" data-testid="company-name">{company.name}</span>
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
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="icon"
                variant={isWatched ? "default" : "outline"}
                onClick={() => onAddToWatchlist?.(event.id)}
                data-testid="button-watchlist"
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <motion.div
                  animate={isWatched ? { rotate: [0, -10, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Star className={`w-4 h-4 ${isWatched ? "fill-current" : ""}`} />
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
