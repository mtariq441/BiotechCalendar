import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X, Filter } from "lucide-react";
import { motion } from "framer-motion";

interface FilterSidebarProps {
  filters: {
    types: string[];
    status: string[];
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (filters: any) => void;
  onClear: () => void;
}

const EVENT_TYPES = [
  { value: "advisory_committee", label: "Advisory Committee" },
  { value: "pdufa", label: "PDUFA Date" },
  { value: "readout", label: "Data Readout" },
  { value: "nda_bla", label: "NDA/BLA" },
  { value: "phase_result", label: "Phase Result" },
];

const STATUSES = [
  { value: "upcoming", label: "Upcoming" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
];

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export function FilterSidebar({ filters, onFilterChange, onClear }: FilterSidebarProps) {
  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onFilterChange({ ...filters, types: newTypes });
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFilterChange({ ...filters, status: newStatus });
  };

  const activeFilterCount = 
    filters.types.length + 
    filters.status.filter(s => s !== 'upcoming').length + // Don't count 'upcoming' as it's default
    (filters.dateFrom ? 1 : 0) + 
    (filters.dateTo ? 1 : 0);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="p-6 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto backdrop-blur-sm bg-card/95 shadow-lg" data-testid="filter-sidebar">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wide">Filters</h3>
            {activeFilterCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold"
              >
                {activeFilterCount}
              </motion.span>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClear} data-testid="button-clear-filters" className="hover:bg-destructive/10 hover:text-destructive">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>

        {/* Event Type Filter */}
        <motion.div className="space-y-3 mb-6" variants={itemVariants}>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            Event Type
          </h4>
          <div className="space-y-2">
            {EVENT_TYPES.map((type) => (
              <motion.div
                key={type.value}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Checkbox
                  id={`type-${type.value}`}
                  checked={filters.types.includes(type.value)}
                  onCheckedChange={() => handleTypeToggle(type.value)}
                  data-testid={`filter-type-${type.value}`}
                />
                <Label htmlFor={`type-${type.value}`} className="text-sm font-normal cursor-pointer flex-1">
                  {type.label}
                </Label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator className="my-6" />

        {/* Status Filter */}
        <motion.div className="space-y-3 mb-6" variants={itemVariants}>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            Status
          </h4>
          <div className="space-y-2">
            {STATUSES.map((status) => (
              <motion.div
                key={status.value}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Checkbox
                  id={`status-${status.value}`}
                  checked={filters.status.includes(status.value)}
                  onCheckedChange={() => handleStatusToggle(status.value)}
                  data-testid={`filter-status-${status.value}`}
                />
                <Label htmlFor={`status-${status.value}`} className="text-sm font-normal cursor-pointer flex-1">
                  {status.label}
                </Label>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator className="my-6" />

        {/* Date Range Filter */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            Date Range
          </h4>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="date-from" className="text-sm font-medium">From</Label>
              <Input
                id="date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
                className="font-mono"
                data-testid="input-date-from"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to" className="text-sm font-medium">To</Label>
              <Input
                id="date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
                className="font-mono"
                data-testid="input-date-to"
              />
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
