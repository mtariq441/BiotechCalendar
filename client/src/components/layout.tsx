import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Star, User, LogOut, Menu } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/watchlist", label: "Watchlist", icon: Star },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <nav className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <Calendar className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">BioCalendar</span>
              </div>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        data-testid={`nav-${item.label.toLowerCase()}`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-muted">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium" data-testid="user-display">
                    {user?.email || "User"}
                  </span>
                </div>
                <Button variant="ghost" size="sm" asChild data-testid="button-logout">
                  <a href="/api/logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </a>
                </Button>
              </>
            ) : (
              <Button asChild data-testid="button-login">
                <a href="/api/login">Sign In</a>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden border-t bg-background p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 BioCalendar. Forecasts are probabilistic and not financial advice.</p>
        </div>
      </footer>
    </div>
  );
}
