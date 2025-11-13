import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import Landing from "@/pages/landing";
import Calendar from "@/pages/calendar";
import EventDetail from "@/pages/event-detail";
import CompanyDetail from "@/pages/company-detail";
import Watchlist from "@/pages/watchlist";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <Calendar /> : <Landing />}
      </Route>
      <Route path="/calendar">
        {() => <ProtectedRoute component={Calendar} />}
      </Route>
      <Route path="/event/:id">
        {() => <ProtectedRoute component={EventDetail} />}
      </Route>
      <Route path="/company/:id">
        {() => <ProtectedRoute component={CompanyDetail} />}
      </Route>
      <Route path="/watchlist">
        {() => <ProtectedRoute component={Watchlist} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <TooltipProvider>
      <Toaster />
      {isAuthenticated ? (
        <Layout>
          <Router />
        </Layout>
      ) : (
        <Router />
      )}
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
