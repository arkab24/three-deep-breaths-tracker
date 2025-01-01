import { eachMonthOfInterval } from "date-fns";
import { useYearlySessions } from "@/hooks/useYearlySessions";
import { getUniqueDaysForMonth, getTotalSessionsForMonth, getPerfectWeeksForMonth, getTotalUniqueDays } from "@/utils/sessionCalculations";
import { MonthlyProgressIndicator } from "./MonthlyProgressIndicator";
import { SessionsLineChart } from "./SessionsLineChart";

export const YearlySessionsTracker = () => {
  const { sessions, isAuthenticated, yearStart, yearEnd } = useYearlySessions();
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  if (!isAuthenticated) {
    return null;
  }

  const totalUniqueDays = getTotalUniqueDays(sessions);

  return (
    <div className="p-6 bg-breath-subtle rounded-xl border border-breath-border">
      <h2 className="text-lg font-medium text-breath-text mb-4">
        yearly progress: {totalUniqueDays}/365
      </h2>

      <SessionsLineChart 
        months={months} 
        getTotalSessionsForMonth={(month) => getTotalSessionsForMonth(sessions, month)} 
      />

      <div className="grid grid-cols-12 gap-1">
        {months.map((month, index) => (
          <MonthlyProgressIndicator
            key={index}
            month={month}
            sessionsInMonth={getUniqueDaysForMonth(sessions, month)}
            perfectWeeks={getPerfectWeeksForMonth(sessions, month)}
          />
        ))}
      </div>
    </div>
  );
};