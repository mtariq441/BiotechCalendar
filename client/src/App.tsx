import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/components/layout";
import Landing from "@/pages/landing";
import Calendar from "@/pages/calendar";
import EventDetail from "@/pages/event-detail";
import CompanyDetail from "@/pages/company-detail";
import Watchlist from "@/pages/watchlist";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Calendar} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/event/:id" component={EventDetail} />
          <Route path="/company/:id" component={CompanyDetail} />
          <Route path="/watchlist" component={Watchlist} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
