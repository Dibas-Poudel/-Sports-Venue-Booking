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

  const [updatedBooking, setUpdatedBooking] = useState({
    venue_name: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user?.id)
          .order("date", { ascending: true });

        if (error) throw error;
        setBookings(data);
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchBookings();
  }, [user]);

  const handleDelete = async (bookingId) => {
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("booking_id", bookingId);

    if (error) {
      alert(`Failed to delete booking: ${error.message}`);
    } else {
      setBookings((prev) =>
        prev.filter((booking) => booking.booking_id !== bookingId)
      );
    }
  };

  const handleEdit = (booking) => {
    setIsEditing(true);
    setCurrentBooking(booking);
    setUpdatedBooking({
      venue_name: booking.venue_name,
      date: booking.date,
      time: booking.time,
    });
  };

  const handleUpdate = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .update({
        venue_name: updatedBooking.venue_name,
        date: updatedBooking.date,
        time: updatedBooking.time,
      })
      .eq("booking_id", currentBooking.booking_id)
      .select();

    if (error) {
      alert(`Failed to update booking: ${error.message}`);
    } else {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.booking_id === currentBooking.booking_id ? data[0] : booking
        )
      );
      setIsEditing(false);
      setCurrentBooking(null);
    }
  };

  if (loading) return <div className="text-white">Loading bookings...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className="bg-gray-700 p-4 mb-4 rounded-lg shadow-md"
          >
            <p><strong>Venue:</strong> {booking.venue_name}</p>
            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Total Price:</strong> Rs. {booking.total_price}</p>
            <p><strong>Status:</strong> {booking.verified ? "✅ Verified" : "⌛ Pending"}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEdit(booking)}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(booking.booking_id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {isEditing && (
        <div className="bg-gray-700 p-6 rounded-lg mt-6">
          <h3 className="text-2xl font-semibold mb-4">Edit Booking</h3>
          <input
            type="text"
            value={updatedBooking.venue_name}
            onChange={(e) =>
              setUpdatedBooking({ ...updatedBooking, venue_name: e.target.value })
            }
            className="mb-2 p-2 w-full text-black rounded-md"
            placeholder="Venue Name"
          />
          <input
            type="date"
            value={updatedBooking.date}
            onChange={(e) =>
              setUpdatedBooking({ ...updatedBooking, date: e.target.value })
            }
            className="mb-2 p-2 w-full text-black rounded-md"
          />
          <input
            type="text"
            value={updatedBooking.time}
            onChange={(e) =>
              setUpdatedBooking({ ...updatedBooking, time: e.target.value })
            }
            className="mb-4 p-2 w-full text-black rounded-md"
            placeholder="Time"
          />
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md"
            >
              Update Booking
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentBooking(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookings;
