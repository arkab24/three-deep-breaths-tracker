import { format, isThisMonth } from "date-fns";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MonthlyProgressIndicatorProps {
  month: Date;
  sessionsInMonth: number;
  perfectWeeks: number;
}

export const MonthlyProgressIndicator = ({
  month,
  sessionsInMonth,
  perfectWeeks,
}: MonthlyProgressIndicatorProps) => {
  const isCurrentMonth = isThisMonth(month);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex flex-col items-center p-1 rounded-lg ${
              isCurrentMonth ? 'bg-white border border-breath-border' : ''
            }`}
          >
            <span className="text-xs text-breath-text mb-1">
              {format(month, 'M')}
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                sessionsInMonth > 0
                  ? 'bg-breath-inhale text-white'
                  : 'bg-breath-subtle border border-breath-border'
              }`}
            >
              {sessionsInMonth > 0 ? (
                <span className="text-xs">{sessionsInMonth}</span>
              ) : (
                <X className="w-4 h-4 text-breath-text opacity-30" />
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Perfect weeks: {perfectWeeks}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
