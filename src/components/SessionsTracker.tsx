import { WeeklySessionsTracker } from "./WeeklySessionsTracker";
import { YearlySessionsTracker } from "./YearlySessionsTracker";

export const SessionsTracker = () => {
  return (
    <div className="space-y-4">
      <WeeklySessionsTracker />
      <YearlySessionsTracker />
    </div>
  );
};