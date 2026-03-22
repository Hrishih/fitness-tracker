import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { useMemo } from 'react';

const CaloriesChart = () => {
  const { allFoodLogs = [], user } = useAppContext();
  const dailyLimit = user?.dailyCaloriesIntake || 2000;

  const chartData = useMemo(() => {
    const last7Days = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      
      const dayTotal = allFoodLogs
        .filter((log: any) => log.created_at?.startsWith(dateStr))
        .reduce((sum: number, log: any) => sum + (log.calories || 0), 0);
        
      last7Days.push({
        name: dayName,
        calories: dayTotal,
        date: dateStr
      });
    }
    return last7Days;
  }, [allFoodLogs]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }}
            itemStyle={{ color: '#10b981' }}
          />
          <ReferenceLine y={dailyLimit} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Limit', position: 'right', fill: '#ef4444', fontSize: 10 }} />
          <Line 
            type="monotone" 
            dataKey="calories" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#10b981' }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CaloriesChart;
