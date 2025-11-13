import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { Scenario } from "@shared/schema";

interface PricePathChartProps {
  scenarios: Scenario[];
  currentPrice?: number;
}

export function PricePathChart({ scenarios, currentPrice = 100 }: PricePathChartProps) {
  // Combine all price paths into a single dataset
  const chartData = scenarios[0]?.pricePath.map((point, index) => {
    const dataPoint: any = { date: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
    
    scenarios.forEach((scenario) => {
      if (scenario.pricePath[index]) {
        dataPoint[scenario.name] = scenario.pricePath[index].price;
      }
    });
    
    return dataPoint;
  }) || [];

  const getColor = (name: string) => {
    if (name === "Bull") return "#16a34a";
    if (name === "Bear") return "#dc2626";
    return "#2563eb";
  };

  return (
    <Card className="p-6" data-testid="price-path-chart">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-1">30-Day Price Projection</h3>
        <p className="text-sm text-muted-foreground">Scenario-based stock price forecasts</p>
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis 
            dataKey="date" 
            className="text-xs font-mono"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis 
            className="text-sm font-mono"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            domain={["auto", "auto"]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.375rem",
            }}
            labelStyle={{ fontFamily: "monospace" }}
          />
          <Legend wrapperStyle={{ fontFamily: "Inter" }} />
          {scenarios.map((scenario) => (
            <Line
              key={scenario.name}
              type="monotone"
              dataKey={scenario.name}
              stroke={getColor(scenario.name)}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
