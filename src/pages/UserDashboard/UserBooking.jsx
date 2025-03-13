import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import supabase from "../../services/supabaseClient";

const UserBookings = () => {
  const user = useSelector((state) => state.user.profile); 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [updatedVenueName, setUpdatedVenueName] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  const [updatedTime, setUpdatedTime] = useState("");

  // Fetch bookings for the current user
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_id, venue_name, date, time, user_id, verified") // Include verified column
        .eq("user_id", user?.id)
        .order("date", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      setBookings(data || []);
    } catch (err) {
      setError("Error fetching bookings: " + err.message);
      console.error("Error fetching bookings:", err.message);
    }
    setLoading(false);
  };

  // Fetch bookings when the user is available
  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

  // Handle deletion of booking
  const handleDelete = async (booking_id) => {
    if (!booking_id) {
      setError("Invalid booking ID.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete this booking?");
    if (!isConfirmed) return;

    try {
      const { error } = await supabase.from("bookings").delete().eq("booking_id", booking_id);

      if (error) {
        throw new Error(error.message);
      }

      // Re-fetch bookings after delete
      fetchBookings();
    } catch (err) {
      setError("Error deleting booking: " + err.message);
      console.error("Delete error:", err.message);
    }
  };

  // Handle edit of booking
  const handleEdit = (booking) => {
    setIsEditing(true);
    setCurrentBooking(booking); 
    setUpdatedVenueName(booking.venue_name);
    setUpdatedDate(booking.date);
    setUpdatedTime(booking.time);
  };

  // Handle update of booking
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!currentBooking || !currentBooking.booking_id) {
      setError("Invalid booking ID.");
      return;
    }

    const updatedBookingData = {
      venue_name: updatedVenueName,
      date: updatedDate,
      time: updatedTime,
    };

    try {
      const { data, error } = await supabase
        .from("bookings")
        .update(updatedBookingData)
        .eq("booking_id", currentBooking.booking_id);

      if (error) {
        throw new Error(error.message);
      }
      
      fetchBookings();

      setIsEditing(false);
      setCurrentBooking(null);
    } catch (err) {
      setError("Error updating booking: " + err.message);
      console.error("Update error:", err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Venue</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Time</th>
              <th className="py-2 px-4 border">Status</th> {/* Add Status column */}
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id}>
                <td className="py-2 px-4 border">{booking.venue_name}</td>
                <td className="py-2 px-4 border">{booking.date}</td>
                <td className="py-2 px-4 border">{booking.time || "TBD"}</td>
                <td className="py-2 px-4 border">
                  {/* Display booking status */}
                  {booking.verified ? (
                    <span className="text-green-500 font-semibold">Verified</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Not Verified</span>
                  )}
                </td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => handleEdit(booking)} // Set currentBooking properly
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(booking.booking_id)} // Pass booking_id
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal/Form */}
      {isEditing && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-semibold mb-4">Edit Booking</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="venue_name" className="block mb-2">
                  Venue
                </label>
                <input
                  id="venue_name"
                  type="text"
                  value={updatedVenueName}
                  onChange={(e) => setUpdatedVenueName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="date" className="block mb-2">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={updatedDate}
                  onChange={(e) => setUpdatedDate(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="time" className="block mb-2">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  value={updatedTime}
                  onChange={(e) => setUpdatedTime(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
