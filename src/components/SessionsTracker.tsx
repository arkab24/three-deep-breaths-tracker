import { useState } from "react";
import { WeeklySessionsTracker } from "./WeeklySessionsTracker";
import { YearlySessionsTracker } from "./YearlySessionsTracker";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const SessionsTracker = () => {
  const [showYearly, setShowYearly] = useState(false);

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowYearly(!showYearly)}
          className="p-2 rounded-full bg-white border border-breath-border hover:bg-breath-subtle transition-colors"
        >
          {showYearly ? (
            <ArrowLeft className="w-4 h-4 text-breath-text" />
          ) : (
            <ArrowRight className="w-4 h-4 text-breath-text" />
          )}
        </button>
      </div>
      <div className="relative">
        <div
          className={`transition-all duration-300 ease-in-out ${
            showYearly ? 'opacity-0 translate-x-full absolute' : 'opacity-100 translate-x-0'
          }`}
        >
          {!showYearly && <WeeklySessionsTracker />}
        </div>
        <div
          className={`transition-all duration-300 ease-in-out ${
            !showYearly ? 'opacity-0 -translate-x-full absolute' : 'opacity-100 translate-x-0'
          }`}
        >
          {showYearly && <YearlySessionsTracker />}
        </div>
      </div>
    </div>
  );
};