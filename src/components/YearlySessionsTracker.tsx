import { useQuery } from "@tanstack/react-query";
import { startOfYear, endOfYear, eachMonthOfInterval, format, isThisMonth } from "date-fns";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    sessions: getUniqueDaysForMonth(month),
  }));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-8 mb-8 p-6 bg-breath-subtle rounded-xl border border-breath-border">
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

      <div className="flex justify-between gap-2">
        {months.map((month, index) => {
          const sessionsInMonth = getUniqueDaysForMonth(month);
          const isCurrentMonth = isThisMonth(month);

          return (
            <div
              key={index}
              className={`flex flex-col items-center p-2 rounded-lg ${
                isCurrentMonth ? 'bg-white border border-breath-border' : ''
              }`}
            >
              <span className="text-sm text-breath-text mb-2">
                {format(month, 'MMM')}
              </span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  sessionsInMonth > 0
                    ? 'bg-breath-inhale text-white'
                    : 'bg-breath-subtle border border-breath-border'
                }`}
              >
                {sessionsInMonth > 0 ? (
                  <span className="text-sm">{sessionsInMonth}</span>
                ) : (
                  <X className="w-5 h-5 text-breath-text opacity-30" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};