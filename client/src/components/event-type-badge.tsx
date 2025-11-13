import { Badge } from "@/components/ui/badge";
import { Calendar, Beaker, FileText, CheckCircle, FlaskConical } from "lucide-react";

interface EventTypeBadgeProps {
  type: string;
  variant?: "default" | "secondary";
  showIcon?: boolean;
}

const EVENT_TYPE_CONFIG = {
  advisory_committee: {
    label: "Advisory Committee",
    icon: FileText,
    color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  pdufa: {
    label: "PDUFA Date",
    icon: Calendar,
    color: "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  readout: {
    label: "Data Readout",
    icon: Beaker,
    color: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
  },
  nda_bla: {
    label: "NDA/BLA",
    icon: CheckCircle,
    color: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  phase_result: {
    label: "Phase Result",
    icon: FlaskConical,
    color: "bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  },
};

export function EventTypeBadge({ type, variant = "default", showIcon = true }: EventTypeBadgeProps) {
  const config = EVENT_TYPE_CONFIG[type as keyof typeof EVENT_TYPE_CONFIG] || {
    label: type,
    icon: Calendar,
    color: "bg-muted text-muted-foreground",
  };

  const Icon = config.icon;

  if (variant === "secondary") {
    return (
      <Badge variant="secondary" className="gap-1.5">
        {showIcon && <Icon className="w-3 h-3" />}
        <span>{config.label}</span>
      </Badge>
    );
  }

  return (
    <Badge className={`gap-1.5 border ${config.color}`} variant="outline">
      {showIcon && <Icon className="w-3 h-3" />}
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
}
