import { useQuery } from "@tanstack/react-query";
import { startOfYear, endOfYear, eachMonthOfInterval, format, isThisMonth, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const YearlySessionsTracker = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Get the current year's dates
  const yearStart = startOfYear(new Date());
  const yearEnd = endOfYear(new Date());
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  // Fetch sessions for the current year
  const { data: sessions } = useQuery({
    queryKey: ['sessions', 'yearly'],
    queryFn: async () => {
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping query');
        return [];
      }

      console.log('Fetching yearly sessions...');
      const { data, error } = await supabase
        .from('sessions')
        .select('completed_at')
        .gte('completed_at', yearStart.toISOString())
        .lte('completed_at', yearEnd.toISOString());

      if (error) {
        console.error('Error fetching sessions:', error);
        if (error.message.includes('JWT expired')) {
          navigate('/');
        }
        throw error;
      }

      console.log('Yearly sessions data:', data);
      return data || [];
    },
    enabled: isAuthenticated,
  });

  // Get unique days with sessions for each month
  const getUniqueDaysForMonth = (month: Date) => {
    const uniqueDays = new Set();
    sessions?.forEach(session => {
      const sessionDate = new Date(session.completed_at);
      if (
        sessionDate.getMonth() === month.getMonth() &&
        sessionDate.getFullYear() === month.getFullYear()
      ) {
        uniqueDays.add(sessionDate.getDate());
      }
    });
    return uniqueDays.size;
  };

  // Get total sessions for each month (for the line chart)
  const getTotalSessionsForMonth = (month: Date) => {
    return sessions?.filter(session => {
      const sessionDate = new Date(session.completed_at);
      return (
        sessionDate.getMonth() === month.getMonth() &&
        sessionDate.getFullYear() === month.getFullYear()
      );
    }).length || 0;
  };

  // Calculate perfect weeks for a month
  const getPerfectWeeksForMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    
    let perfectWeeks = 0;
    weeks.forEach(weekStart => {
      const weekEnd = endOfWeek(weekStart);
      const hasSessionEveryDay = Array.from({ length: 7 }).every((_, index) => {
        const currentDate = new Date(weekStart);
        currentDate.setDate(currentDate.getDate() + index);
        
        // Only count days within the current month
        if (currentDate.getMonth() !== month.getMonth()) return true;
        
        return sessions?.some(session => {
          const sessionDate = new Date(session.completed_at);
          return (
            sessionDate.getDate() === currentDate.getDate() &&
            sessionDate.getMonth() === currentDate.getMonth() &&
            sessionDate.getFullYear() === currentDate.getFullYear()
          );
        });
      });
      
      if (hasSessionEveryDay) perfectWeeks++;
    });
    
    return perfectWeeks;
  };

  // Get total unique days with sessions for the year
  const totalUniqueDays = new Set(
    sessions?.map(session => {
      const date = new Date(session.completed_at);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    })
  ).size;

  // Prepare data for the line chart
  const chartData = months.map(month => ({
    name: format(month, 'MMM'),
    sessions: getTotalSessionsForMonth(month),
  }));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 bg-breath-subtle rounded-xl border border-breath-border">
      <h2 className="text-lg font-medium text-breath-text mb-4">
        yearly progress: {totalUniqueDays}/365
      </h2>

      {/* Line Chart */}
      <div className="h-24 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#484848' }} 
              axisLine={false}
              tickLine={false}
            />
            <RechartsTooltip 
              contentStyle={{ 
                background: 'white',
                border: '1px solid #EBEBEB',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                color: '#484848'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="sessions" 
              stroke="#008489"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#008489" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-12 gap-1">
        {months.map((month, index) => {
          const sessionsInMonth = getUniqueDaysForMonth(month);
          const perfectWeeks = getPerfectWeeksForMonth(month);
          const isCurrentMonth = isThisMonth(month);

          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex flex-col items-center p-1 rounded-lg ${
                      isCurrentMonth ? 'bg-white border border-breath-border' : ''
                    }`}
                  >
                    <span className="text-xs text-breath-text mb-1">
                      {format(month, 'MMM')}
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
        })}
      </div>
    </div>
  );
};