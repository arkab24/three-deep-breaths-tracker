import { useQuery } from "@tanstack/react-query";
import { startOfWeek, eachDayOfInterval, endOfWeek, format, isToday } from "date-fns";
import { Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const WeeklySessionsTracker = () => {
  // Get the current week's dates
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start week on Monday
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Fetch sessions for the current week
  const { data: sessions } = useQuery({
    queryKey: ['sessions', 'weekly'],
    queryFn: async () => {
      console.log('Fetching weekly sessions...');
      const { data, error } = await supabase
        .from('sessions')
        .select('completed_at')
        .gte('completed_at', weekStart.toISOString())
        .lte('completed_at', weekEnd.toISOString());

      if (error) {
        console.error('Error fetching sessions:', error);
        throw error;
      }

      console.log('Weekly sessions data:', data);
      return data || [];
    },
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

  return (
    <div className="mt-8 mb-8 p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-breath-text mb-4">
        Weekly Progress ({completedDays} of 7 days completed)
      </h2>

      {/* Line Chart */}
      <div className="h-24 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="sessions" 
              stroke="#48bb78"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#48bb78" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between gap-2">
        {weekDays.map((day, index) => {
          const hasSessionsForDay = getSessionsForDay(day) > 0;
          const isCurrentDay = isToday(day);

          return (
            <div
              key={index}
              className={`flex flex-col items-center p-2 rounded-lg ${
                isCurrentDay ? 'bg-breath-background' : ''
              }`}
            >
              <span className="text-sm text-breath-text mb-2">
                {format(day, 'EEE')}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  hasSessionsForDay
                    ? 'bg-breath-inhale text-white'
                    : 'bg-gray-100'
                }`}
              >
                {hasSessionsForDay ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};