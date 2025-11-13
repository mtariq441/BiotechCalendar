import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Brain, TrendingUp, Bell, Search, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  hover: {
    y: -8,
    transition: { duration: 0.2 },
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation with glass effect */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b backdrop-blur-md bg-background/80 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <Calendar className="w-6 h-6 text-primary" />
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--gradient-from))] via-[hsl(var(--gradient-via))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent">
              BioCalendar
            </span>
          </motion.div>
          <Button asChild data-testid="button-calendar" className="group">
            <a href="/calendar" className="flex items-center gap-2">
              View Calendar
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section with gradient background */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--gradient-from))/0.1] via-[hsl(var(--gradient-via))/0.05] to-[hsl(var(--gradient-to))/0.1]">
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-[hsl(var(--gradient-from))/0.2] rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-[hsl(var(--gradient-to))/0.2] rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="max-w-5xl mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Biotech Insights</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
            data-testid="hero-title"
          >
            Track FDA Trials with
            <span className="block bg-gradient-to-r from-[hsl(var(--gradient-from))] via-[hsl(var(--gradient-via))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl mb-10 max-w-3xl mx-auto text-muted-foreground leading-relaxed"
          >
            Real-time biotech calendar aggregating FDA decisions, clinical trial readouts, and PDUFA dates with scenario-based stock forecasting and expert AI analysis.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild data-testid="button-view-calendar" className="group shadow-lg hover:shadow-xl transition-shadow">
              <a href="/calendar" className="flex items-center gap-2">
                View Calendar
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="backdrop-blur-sm">
              <a href="#features">Learn More</a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid with stagger animation */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for Biotech Investors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay ahead in the biotech market
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                icon: Calendar,
                title: "Interactive Calendar",
                description: "Track FDA advisory committees, PDUFA dates, clinical trial readouts, and NDA/BLA submissions in one unified calendar view.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Brain,
                title: "AI Analysis",
                description: "Get plain-English summaries, key endpoints to watch, and clinical significance analysis powered by advanced AI models.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: TrendingUp,
                title: "Scenario Forecasting",
                description: "Bull, Base, and Bear scenarios with probability estimates and 30-day price path projections for each outcome.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Search,
                title: "Advanced Filters",
                description: "Filter by trial phase, sponsor, therapeutic area, event type, and date range to find exactly what matters to you.",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: Bell,
                title: "Watchlist & Alerts",
                description: "Save events and companies to your watchlist. Never miss a critical FDA decision or data readout again.",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: BarChart3,
                title: "Company Profiles",
                description: "View comprehensive company pages with all upcoming and historical events, trial pipelines, and market data.",
                color: "from-indigo-500 to-purple-500",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={featureCardVariants} whileHover="hover">
                <Card className="p-6 h-full border-2 hover:border-primary/50 transition-colors relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 shadow-lg`}>
                      <feature.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works with timeline */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            How It Works
          </motion.h2>

          <div className="space-y-12 relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[hsl(var(--gradient-from))] via-[hsl(var(--gradient-via))] to-[hsl(var(--gradient-to))] hidden md:block" />

            {[
              {
                step: 1,
                title: "Data Ingestion",
                description: "We aggregate events from FDA calendars, ClinicalTrials.gov, press releases, and regulatory filings in real-time.",
              },
              {
                step: 2,
                title: "AI Analysis",
                description: "Our AI models analyze trial design, endpoints, historical outcomes, and market data to generate insights and scenario forecasts.",
              },
              {
                step: 3,
                title: "Actionable Insights",
                description: "View probabilistic scenarios, price forecasts, and key factors to watch - helping you make informed investment decisions.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="flex gap-6 items-start relative"
              >
                <motion.div
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] text-white flex items-center justify-center font-bold text-lg shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {item.step}
                </motion.div>
                <div className="flex-1 pt-1">
                  <h3 className="text-2xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with gradient */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 px-6 bg-gradient-to-br from-[hsl(var(--gradient-from))] via-[hsl(var(--gradient-via))] to-[hsl(var(--gradient-to))] text-white relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl mb-10 opacity-90"
          >
            Join biotech investors tracking FDA events and clinical catalysts with AI-powered analysis.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" variant="secondary" asChild className="group shadow-xl hover:shadow-2xl transition-shadow">
              <a href="/calendar" className="flex items-center gap-2">
                Start Tracking Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 BioCalendar. Forecasts are probabilistic and not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}
