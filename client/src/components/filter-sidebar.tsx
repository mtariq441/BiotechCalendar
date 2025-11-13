import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

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

  return (
    <Card className="p-6 sticky top-6 max-h-[calc(100vh-8rem)] overflow-y-auto" data-testid="filter-sidebar">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wide">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClear} data-testid="button-clear-filters">
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Event Type Filter */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Event Type</h4>
        {EVENT_TYPES.map((type) => (
          <div key={type.value} className="flex items-center space-x-2">
            <Checkbox
              id={`type-${type.value}`}
              checked={filters.types.includes(type.value)}
              onCheckedChange={() => handleTypeToggle(type.value)}
              data-testid={`filter-type-${type.value}`}
            />
            <Label htmlFor={`type-${type.value}`} className="text-sm font-normal cursor-pointer">
              {type.label}
            </Label>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Status Filter */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Status</h4>
        {STATUSES.map((status) => (
          <div key={status.value} className="flex items-center space-x-2">
            <Checkbox
              id={`status-${status.value}`}
              checked={filters.status.includes(status.value)}
              onCheckedChange={() => handleStatusToggle(status.value)}
              data-testid={`filter-status-${status.value}`}
            />
            <Label htmlFor={`status-${status.value}`} className="text-sm font-normal cursor-pointer">
              {status.label}
            </Label>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      {/* Date Range Filter */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Date Range</h4>
        <div className="space-y-2">
          <Label htmlFor="date-from" className="text-sm">From</Label>
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
          <Label htmlFor="date-to" className="text-sm">To</Label>
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
    </Card>
  );
}
