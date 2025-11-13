import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Brain, TrendingUp, Bell, Search, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">BioCalendar</span>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/api/login">Sign In</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6" data-testid="hero-title">
            Track FDA Trials & Clinical Events with AI-Powered Insights
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
            Real-time biotech calendar aggregating FDA decisions, clinical trial readouts, and PDUFA dates with scenario-based stock forecasting and expert AI analysis.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild data-testid="button-view-calendar">
              <a href="/api/login">View Calendar</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Biotech Investors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <Calendar className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Interactive Calendar</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Track FDA advisory committees, PDUFA dates, clinical trial readouts, and NDA/BLA submissions in one unified calendar view.
              </p>
            </Card>

            <Card className="p-6">
              <Brain className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Get plain-English summaries, key endpoints to watch, and clinical significance analysis powered by advanced AI models.
              </p>
            </Card>

            <Card className="p-6">
              <TrendingUp className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Scenario Forecasting</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Bull, Base, and Bear scenarios with probability estimates and 30-day price path projections for each outcome.
              </p>
            </Card>

            <Card className="p-6">
              <Search className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Advanced Filters</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Filter by trial phase, sponsor, therapeutic area, event type, and date range to find exactly what matters to you.
              </p>
            </Card>

            <Card className="p-6">
              <Bell className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Watchlist & Alerts</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Save events and companies to your watchlist. Never miss a critical FDA decision or data readout again.
              </p>
            </Card>

            <Card className="p-6">
              <BarChart3 className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Company Profiles</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                View comprehensive company pages with all upcoming and historical events, trial pipelines, and market data.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Data Ingestion</h3>
                <p className="text-muted-foreground">
                  We aggregate events from FDA calendars, ClinicalTrials.gov, press releases, and regulatory filings in real-time.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI models analyze trial design, endpoints, historical outcomes, and market data to generate insights and scenario forecasts.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Actionable Insights</h3>
                <p className="text-muted-foreground">
                  View probabilistic scenarios, price forecasts, and key factors to watch - helping you make informed investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join biotech investors tracking FDA events and clinical catalysts with AI-powered analysis.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/api/login">Start Tracking Events</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 BioCalendar. Forecasts are probabilistic and not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}
