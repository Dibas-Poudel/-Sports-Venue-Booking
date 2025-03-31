import { useSelector } from 'react-redux';
import { XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const COLORS = ['#4F46E5', '#22C55E', '#F97316', '#EC4899', '#14B8A6'];

const RevenueAnalytics = () => {
  const { analytics, status } = useSelector((state) => state.admin);

  if (status.fetch === 'loading' && analytics.length === 0) {
    return <div className="text-white">Loading analytics...</div>;
  }

  if (analytics.length === 0) {
    return <div className="text-white">No booking data available</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Booking Volume Analytics</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2 text-white">Bookings by Venue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics}>
            <XAxis dataKey="venue" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#4B5563', 
                borderColor: '#4B5563',
                color: '#fff'
              }}
            />
            <Legend />
            <Bar dataKey="bookings" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2 text-white">Booking Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie 
              data={analytics} 
              dataKey="bookings" 
              nameKey="venue" 
              outerRadius={100}
              label={({ venue, percent }) => `${venue}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {analytics.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#4B5563', 
                borderColor: '#4B5563',
                color: '#fff'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueAnalytics;