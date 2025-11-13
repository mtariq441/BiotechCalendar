import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Scenario } from "@shared/schema";

interface ScenarioCardProps {
  scenario: Scenario;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  const getIcon = () => {
    if (scenario.name === "Bull") return <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />;
    if (scenario.name === "Bear") return <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />;
    return <Minus className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
  };

  const getColor = () => {
    if (scenario.name === "Bull") return "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30";
    if (scenario.name === "Bear") return "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30";
    return "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30";
  };

  return (
    <Card className={`p-6 ${getColor()} border-2`} data-testid={`scenario-card-${scenario.name.toLowerCase()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="text-lg font-semibold">{scenario.name}</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold font-mono" data-testid={`probability-${scenario.name.toLowerCase()}`}>
            {(scenario.prob * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-muted-foreground">Probability</div>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-4 text-foreground/90">{scenario.narrative}</p>

      <div className="border-t pt-4 mt-4">
        <div className="text-xs text-muted-foreground mb-1">Price Target</div>
        <div className="text-3xl font-bold font-mono" data-testid={`price-target-${scenario.name.toLowerCase()}`}>
          ${scenario.priceTarget.toFixed(2)}
        </div>
      </div>
    </Card>
  );
}
