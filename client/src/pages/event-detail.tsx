import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EventTypeBadge } from "@/components/event-type-badge";
import { StatusBadge } from "@/components/status-badge";
import { TickerChip } from "@/components/ticker-chip";
import { ScenarioCard } from "@/components/scenario-card";
import { PricePathChart } from "@/components/price-path-chart";
import { ArrowLeft, Star, ExternalLink, Calendar, Building2, FileText, Brain, Sparkles } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import type { Event, Company, AiAnalysis, Scenario, WatchlistItem } from "@shared/schema";

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const { data: event, isLoading: eventLoading } = useQuery<Event>({
    queryKey: ["/api/events", id],
  });

  const { data: company } = useQuery<Company>({
    queryKey: ["/api/companies", event?.companyId || "none"],
    enabled: !!event?.companyId,
  });

  const { data: aiAnalysis, isLoading: analysisLoading } = useQuery<AiAnalysis>({
    queryKey: ["/api/ai-analysis", id],
    enabled: !!id,
  });

  const { data: watchlistData } = useQuery<WatchlistItem[]>({
    queryKey: ["/api/watchlist"],
    enabled: isAuthenticated,
  });

  const watchlistItems = watchlistData || [];
  const isWatched = watchlistItems.some(item => item.eventId === id);

  const generateAnalysisMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/ai-analysis/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai-analysis", id] });
      toast({
        title: "Analysis Generated",
        description: "AI analysis has been generated successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Error",
        description: "Failed to generate analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/watchlist", { eventId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Added to Watchlist",
        description: "Event added to your watchlist successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add event to watchlist.",
        variant: "destructive",
      });
    },
  });

  if (eventLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <p className="text-muted-foreground">Event not found</p>
        <Button asChild className="mt-4">
          <Link href="/calendar">Back to Calendar</Link>
        </Button>
      </div>
    );
  }

  const scenarios = (aiAnalysis?.scenarios as Scenario[]) || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6" data-testid="button-back">
        <Link href="/calendar">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Link>
      </Button>

      {/* Event Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <EventTypeBadge type={event.type} />
              <StatusBadge status={event.status} />
              {event.nctId && (
                <Badge variant="outline" className="font-mono" data-testid="event-nct-id">
                  {event.nctId}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4" data-testid="event-title">{event.title}</h1>
            
            <div className="flex items-center gap-6 text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-mono" data-testid="event-date">
                  {new Date(event.dateUtc).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {company && (
                <Link href={`/company/${company.id}`}>
                  <div className="flex items-center gap-2 hover:text-foreground cursor-pointer">
                    <Building2 className="w-5 h-5" />
                    <span data-testid="company-name">{company.name}</span>
                  </div>
                </Link>
              )}
            </div>

            {event.relatedTickers && event.relatedTickers.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {event.relatedTickers.map((ticker) => (
                  <TickerChip key={ticker} ticker={ticker} />
                ))}
              </div>
            )}
          </div>

          <Button 
            size="lg" 
            data-testid="button-watchlist"
            variant={isWatched ? "default" : "outline"}
            onClick={() => addToWatchlistMutation.mutate()}
            disabled={isWatched || addToWatchlistMutation.isPending}
          >
            <Star className={`w-4 h-4 mr-2 ${isWatched ? "fill-current" : ""}`} />
            {isWatched ? "Watching" : "Add to Watchlist"}
          </Button>
        </div>

        {event.description && (
          <p className="text-muted-foreground leading-relaxed max-w-4xl">
            {event.description}
          </p>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analysis" data-testid="tab-analysis">
            <Brain className="w-4 h-4 mr-2" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="details" data-testid="tab-details">
            <FileText className="w-4 h-4 mr-2" />
            Event Details
          </TabsTrigger>
        </TabsList>

        {/* AI Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {!aiAnalysis && !analysisLoading ? (
            <Card className="p-12 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Generate AI Analysis</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get AI-powered insights, scenario forecasts, and key factors to watch for this event.
              </p>
              <Button
                size="lg"
                onClick={() => generateAnalysisMutation.mutate()}
                disabled={generateAnalysisMutation.isPending}
                data-testid="button-generate-analysis"
              >
                {generateAnalysisMutation.isPending ? "Generating..." : "Generate Analysis"}
              </Button>
            </Card>
          ) : analysisLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
            </div>
          ) : aiAnalysis ? (
            <>
              {/* Summary */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Executive Summary</h3>
                <p className="text-base leading-relaxed mb-6">{aiAnalysis.summary}</p>
                
                {aiAnalysis.keyFactors && aiAnalysis.keyFactors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Key Factors to Watch</h4>
                    <ul className="space-y-2">
                      {aiAnalysis.keyFactors.map((factor, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Confidence: </span>
                    <span className="font-mono">{(aiAnalysis.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="font-medium">Model: </span>
                    <span className="font-mono">{aiAnalysis.modelVersion}</span>
                  </div>
                  <div>
                    <span className="font-medium">Generated: </span>
                    <span className="font-mono">
                      {new Date(aiAnalysis.generatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Scenarios */}
              {scenarios.length > 0 && (
                <>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Scenario Forecasts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {scenarios.map((scenario) => (
                        <ScenarioCard key={scenario.name} scenario={scenario} />
                      ))}
                    </div>
                  </div>

                  {/* Price Chart */}
                  <PricePathChart scenarios={scenarios} />
                </>
              )}
            </>
          ) : null}
        </TabsContent>

        {/* Event Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Event Information</h3>
            <dl className="grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">Event Type</dt>
                <dd><EventTypeBadge type={event.type} /></dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground mb-1">Status</dt>
                <dd><StatusBadge status={event.status} /></dd>
              </div>
              {event.therapeuticArea && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">Therapeutic Area</dt>
                  <dd className="font-medium">{event.therapeuticArea}</dd>
                </div>
              )}
              {event.nctId && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-1">NCT ID</dt>
                  <dd className="font-mono font-medium">{event.nctId}</dd>
                </div>
              )}
            </dl>

            {event.sourceLinks && event.sourceLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Source Documents</h4>
                <div className="space-y-2">
                  {event.sourceLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {new URL(link).hostname}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
