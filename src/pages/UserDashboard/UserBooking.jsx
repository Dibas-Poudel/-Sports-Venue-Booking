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

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_id, venue_name, date, time, user_id, verified")
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

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user]);

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

      fetchBookings();
    } catch (err) {
      setError("Error deleting booking: " + err.message);
      console.error("Delete error:", err.message);
    }
  };

  const handleEdit = (booking) => {
    setIsEditing(true);
    setCurrentBooking(booking);
    setUpdatedVenueName(booking.venue_name);
    setUpdatedDate(booking.date);
    setUpdatedTime(booking.time);
  };

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
      const { error } = await supabase
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
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mt-6 max-w-full overflow-x-hidden">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto w-full">
        <table className="min-w-[700px] w-full text-sm sm:text-base border-collapse">
          <thead>
            <tr className="bg-gray-100 text-xs sm:text-sm">
              <th className="py-2 px-3 sm:px-4 border whitespace-nowrap">Venue</th>
              <th className="py-2 px-3 sm:px-4 border whitespace-nowrap">Date</th>
              <th className="py-2 px-3 sm:px-4 border whitespace-nowrap">Time</th>
              <th className="py-2 px-3 sm:px-4 border whitespace-nowrap">Status</th>
              <th className="py-2 px-3 sm:px-4 border whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.booking_id} className="text-xs sm:text-sm">
                <td className="py-2 px-3 sm:px-4 border whitespace-nowrap">{booking.venue_name}</td>
                <td className="py-2 px-3 sm:px-4 border whitespace-nowrap">{booking.date}</td>
                <td className="py-2 px-3 sm:px-4 border whitespace-nowrap">{booking.time || "TBD"}</td>
                <td className="py-2 px-3 sm:px-4 border whitespace-nowrap">
                  {booking.verified ? (
                    <span className="text-green-500 font-semibold">Verified</span>
                  ) : (
                    <span className="text-red-500 font-semibold">Not Verified</span>
                  )}
                </td>
                <td className="py-2 px-3 sm:px-4 border space-x-1 sm:space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(booking)}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(booking.booking_id)}
                    className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      )}

      {/* Edit Modal/Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60 px-4">
          <div className="bg-white w-full max-w-sm sm:max-w-md p-4 sm:p-6 rounded-lg shadow-lg">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Edit Booking</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="venue_name" className="block mb-1 text-sm">
                  Venue
                </label>
                <input
                  id="venue_name"
                  type="text"
                  value={updatedVenueName}
                  onChange={(e) => setUpdatedVenueName(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="date" className="block mb-1 text-sm">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={updatedDate}
                  onChange={(e) => setUpdatedDate(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="time" className="block mb-1 text-sm">
                  Time
                </label>
                <input
                  id="time"
                  type="time"
                  value={updatedTime}
                  onChange={(e) => setUpdatedTime(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
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
