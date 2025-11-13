import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    className: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  live: {
    label: "Live",
    icon: AlertCircle,
    className: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-muted text-muted-foreground border-border",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.upcoming;
  const Icon = config.icon;

  return (
    <Badge className={`gap-1.5 border ${config.className}`} variant="outline">
      <Icon className="w-3 h-3" />
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
}
