import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EventCard } from "@/components/event-card";
import { TickerChip } from "@/components/ticker-chip";
import { ArrowLeft, Building2, ExternalLink, Calendar } from "lucide-react";
import type { Company, Event } from "@shared/schema";

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: company, isLoading: companyLoading } = useQuery<Company>({
    queryKey: ["/api/companies", id],
  });

  const { data: events, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", { companyId: id }],
    enabled: !!id,
  });

  if (companyLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Company not found</p>
        <Button asChild className="mt-4">
          <Link href="/calendar">Back to Calendar</Link>
        </Button>
      </div>
    );
  }

  const upcomingEvents = events?.filter(e => e.status === "upcoming") || [];
  const pastEvents = events?.filter(e => e.status === "completed") || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6" data-testid="button-back">
        <Link href="/calendar">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Link>
      </Button>

      {/* Company Header */}
      <Card className="p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-3" data-testid="company-name">{company.name}</h1>
            
            {company.tickers && company.tickers.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {company.tickers.map((ticker) => (
                  <TickerChip key={ticker} ticker={ticker} />
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-6 mt-6">
              {company.marketCap && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Market Cap</div>
                  <div className="text-2xl font-bold font-mono">{company.marketCap}</div>
                </div>
              )}
              {company.sector && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Sector</div>
                  <div className="text-2xl font-bold">{company.sector}</div>
                </div>
              )}
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Total Events</div>
                <div className="text-2xl font-bold font-mono">{events?.length || 0}</div>
              </div>
            </div>

            {company.website && (
              <div className="mt-6 pt-6 border-t">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Upcoming Events */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Upcoming Events ({upcomingEvents.length})
        </h2>
        {eventsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : upcomingEvents.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            No upcoming events
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} company={company} />
            ))}
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Past Events ({pastEvents.length})
          </h2>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} company={company} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
