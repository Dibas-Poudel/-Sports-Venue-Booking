import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import supabase from "../../services/supabaseClient";

const RevenueAnalytics = () => {
  const [bookingVolumeData, setBookingVolumeData] = useState([]);

  useEffect(() => {
    fetchBookingVolumeData();
  }, []);

  // Fetch booking volume data
  const fetchBookingVolumeData = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("venue_name");

    if (error) {
      console.error("Error fetching booking volume data", error);
      return;
    }

    const bookingCounts = data.reduce((acc, booking) => {
      acc[booking.venue_name] = (acc[booking.venue_name] || 0) + 1;
      return acc;
    }, {});

    const formattedData = Object.keys(bookingCounts).map((venue) => ({
      venue,
      bookings: bookingCounts[venue],
    }));

    setBookingVolumeData(formattedData);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Booking Volume Analytics</h2>
      
      {/* Bar Chart - Booking Volume */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={bookingVolumeData}>
          <XAxis dataKey="venue" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bookings" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
      
      {/* Pie Chart - Booking Volume by Venue */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={bookingVolumeData} dataKey="bookings" nameKey="venue" outerRadius={100}>
            {bookingVolumeData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={["#4F46E5", "#22C55E", "#F97316"][index % 3]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueAnalytics;
