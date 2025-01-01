import { useQuery } from "@tanstack/react-query";
import { startOfWeek, eachDayOfInterval, endOfWeek, format, isToday } from "date-fns";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const WeeklySessionsTracker = () => {
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

  // Get the current week's dates
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start week on Monday
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Fetch sessions for the current week
  const { data: sessions } = useQuery({
    queryKey: ['sessions', 'weekly'],
    queryFn: async () => {
      if (!isAuthenticated) {
        console.log('User not authenticated, skipping query');
        return [];
      }

      console.log('Fetching weekly sessions...');
      const { data, error } = await supabase
        .from('sessions')
        .select('completed_at')
        .gte('completed_at', weekStart.toISOString())
        .lte('completed_at', weekEnd.toISOString());

      if (error) {
        console.error('Error fetching sessions:', error);
        if (error.message.includes('JWT expired')) {
          navigate('/');
        }
        throw error;
      }

      console.log('Weekly sessions data:', data);
      return data || [];
    },
    enabled: isAuthenticated,
  });

  // Check if a day has sessions and count them
  const getSessionsForDay = (date: Date) => {
    return sessions?.filter(session => {
      const sessionDate = new Date(session.completed_at);
      return (
        sessionDate.getDate() === date.getDate() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getFullYear() === date.getFullYear()
      );
    }).length || 0;
  };

  // Count completed days (days with at least one session)
  const completedDays = weekDays.filter(day => getSessionsForDay(day) > 0).length;

  // Prepare data for the line chart
  const chartData = weekDays.map(day => ({
    name: format(day, 'EEE'),
    sessions: getSessionsForDay(day),
  }));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-4 md:mt-8 mb-4 md:mb-8 p-4 md:p-6 bg-breath-subtle rounded-xl border border-breath-border">
      <h2 className="text-base md:text-lg font-medium text-breath-text mb-4">
        weekly progress: {completedDays}/7
      </h2>

      <div className="h-20 md:h-24 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#484848' }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
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

      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {weekDays.map((day, index) => {
          const hasSessionsForDay = getSessionsForDay(day) > 0;
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              className={`flex flex-col items-center p-1 md:p-2 rounded-lg ${
                isCurrentDay ? 'bg-white border border-breath-border' : ''
              }`}
            >
              <span className="text-xs md:text-sm text-breath-text mb-1 md:mb-2">
                {format(day, 'EEE')}
              </span>
              <div
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                  hasSessionsForDay
                    ? 'bg-breath-inhale text-white'
                    : 'bg-breath-subtle border border-breath-border'
                }`}
              >
                {hasSessionsForDay ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <X className="w-4 h-4 md:w-5 md:h-5 text-breath-text opacity-30" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
