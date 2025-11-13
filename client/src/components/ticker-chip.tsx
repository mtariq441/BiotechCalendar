import { Badge } from "@/components/ui/badge";

interface TickerChipProps {
  ticker: string;
  variant?: "default" | "outline";
}

export function TickerChip({ ticker, variant = "default" }: TickerChipProps) {
  return (
    <Badge 
      variant={variant} 
      className="font-mono text-xs font-semibold px-2 py-0.5"
      data-testid={`ticker-${ticker}`}
    >
      {ticker}
    </Badge>
  );
}
