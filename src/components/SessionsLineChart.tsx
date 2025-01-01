import { format } from "date-fns";
import { LineChart, Line, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface SessionsLineChartProps {
  months: Date[];
  getTotalSessionsForMonth: (month: Date) => number;
}

export const SessionsLineChart = ({ months, getTotalSessionsForMonth }: SessionsLineChartProps) => {
  const chartData = months.map(month => ({
    name: format(month, 'MMM'),
    sessions: getTotalSessionsForMonth(month),
  }));

  return (
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
  );
};