import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarGrid } from "@/components/calendar-grid";
import { EventCard } from "@/components/event-card";
import { FilterSidebar } from "@/components/filter-sidebar";
import { Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event, Company } from "@shared/schema";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<"month" | "list">("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    types: [] as string[],
    status: ["upcoming"] as string[],
    dateFrom: "",
    dateTo: "",
  });

  // Fetch events
  const { data: eventsData, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", filters],
  });

  // Fetch companies
  const { data: companiesData } = useQuery<Company[]>({
    queryKey: ["/api/companies"],
  });

  const events = eventsData || [];
  const companies = companiesData || [];

  // Create company lookup map
  const companyMap = new Map(companies.map(c => [c.id, c]));

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.relatedTickers?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      event.nctId?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filters.types.length === 0 || filters.types.includes(event.type);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(event.status);

    const eventDate = new Date(event.dateUtc);
    const matchesDateFrom = !filters.dateFrom || eventDate >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || eventDate <= new Date(filters.dateTo);

    return matchesSearch && matchesType && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const handleClearFilters = () => {
    setFilters({
      types: [],
      status: ["upcoming"],
      dateFrom: "",
      dateTo: "",
    });
    setSearchQuery("");
  };

  return (
    <div className="flex gap-6">
      {/* Filter Sidebar */}
      <div className="w-80 flex-shrink-0">
        <FilterSidebar 
          filters={filters} 
          onFilterChange={setFilters}
          onClear={handleClearFilters}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events, companies, tickers, or NCT IDs..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousMonth}
              data-testid="button-prev-month"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-bold font-mono min-w-[200px] text-center" data-testid="current-month">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              data-testid="button-next-month"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              data-testid="button-today"
            >
              Today
            </Button>
          </div>

          <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")}>
            <TabsList>
              <TabsTrigger value="month" data-testid="tab-month">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Month
              </TabsTrigger>
              <TabsTrigger value="list" data-testid="tab-list">
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground" data-testid="results-count">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
        </div>

        {/* Calendar/List View */}
        {eventsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <>
            {view === "month" ? (
              <CalendarGrid events={filteredEvents} currentMonth={currentMonth} />
            ) : (
              <div className="space-y-4">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No events found matching your criteria</p>
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      company={event.companyId ? companyMap.get(event.companyId) : undefined}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
