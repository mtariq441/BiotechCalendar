import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WatchlistItem, Event, Company } from "@shared/schema";

export default function Watchlist() {
  const { toast } = useToast();

  const { data: watchlistItems, isLoading: watchlistLoading } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
  });

  const { data: events } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: companies } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (itemId: string) => {
      toast({
        title: "Watchlist Disabled",
        description: "Watchlist features require authentication (coming soon!).",
      });
      return Promise.resolve();
    },
  });

  if (watchlistLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const eventsMap = new Map(events?.map(e => [e.id, e]) || []);
  const companiesMap = new Map(companies?.map(c => [c.id, c]) || []);

  const watchedEvents = watchlistItems
    ?.filter(item => item.eventId)
    .map(item => ({
      item,
      event: eventsMap.get(item.eventId!),
      company: item.eventId ? companiesMap.get(eventsMap.get(item.eventId)?.companyId || "") : undefined,
    }))
    .filter(w => w.event) || [];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-8 h-8 text-primary fill-primary" />
        <h1 className="text-3xl font-bold">My Watchlist</h1>
      </div>

      {watchedEvents.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Start adding events to track important FDA decisions and clinical readouts.
          </p>
          <Button asChild>
            <a href="/calendar">Browse Events</a>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4" data-testid="watchlist-items">
          {watchedEvents.map(({ item, event, company }) => (
            <div key={item.id} className="relative">
              <EventCard
                event={event!}
                company={company}
                isWatched={true}
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-4 right-4"
                onClick={() => removeFromWatchlistMutation.mutate(item.id)}
                data-testid={`button-remove-${item.id}`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
