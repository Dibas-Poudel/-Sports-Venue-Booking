import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { 
  fetchBookings, 
  updateBooking, 
  deleteBooking,
  bookingActions
} from "../../store/slice/booking";

const UserBookings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.profile);
  const { 
    bookings, 
    loading, 
    error, 
    currentBooking,
    status
  } = useSelector((state) => state.booking);

  useEffect(() => {
    if (user?.id && status.fetch === 'idle') {
      dispatch(fetchBookings(user.id));
    }
  }, [user, dispatch, status.fetch]);

  const handleDelete = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      dispatch(deleteBooking(bookingId));
    }
  };

  const handleEdit = (booking) => {
    dispatch(bookingActions.setCurrentBooking(booking));
  };

  const handleUpdate = () => {
    if (currentBooking) {
      dispatch(updateBooking({
        bookingId: currentBooking.booking_id,
        venueName: currentBooking.venue_name,
        date: currentBooking.date,
        time: currentBooking.time
      }));
    }
  };

  // Reset status after operations
  useEffect(() => {
    if (status.update === 'succeeded' || status.update === 'failed') {
      setTimeout(() => dispatch(bookingActions.resetStatus('update')), 1000);
    }
    if (status.delete === 'succeeded' || status.delete === 'failed') {
      setTimeout(() => dispatch(bookingActions.resetStatus('delete')), 1000);
    }
  }, [status.update, status.delete, dispatch]);

  if (loading && status.fetch === 'loading') return <Spinner />;
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
            <p><strong>Status:</strong> {booking.verified ? "✅ Verified" : "⌛ Pending"}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEdit(booking)}
                className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md"
                disabled={status.update === 'loading' || status.delete === 'loading'}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(booking.booking_id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                disabled={status.update === 'loading' || status.delete === 'loading'}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {currentBooking && (
        <div className="bg-gray-700 p-6 rounded-lg mt-6">
          <h3 className="text-2xl font-semibold mb-4">Edit Booking</h3>
          <input
            type="text"
            value={currentBooking.venue_name}
            onChange={(e) => 
              dispatch(bookingActions.setUpdatedBooking({ venue_name: e.target.value }))
            }
            className="mb-2 p-2 w-full text-black rounded-md"
            placeholder="Venue Name"
          />
          <input
            type="date"
            value={currentBooking.date}
            onChange={(e) => 
              dispatch(bookingActions.setUpdatedBooking({ date: e.target.value }))
            }
            className="mb-2 p-2 w-full text-black rounded-md"
          />
          <input
            type="text"
            value={currentBooking.time}
            onChange={(e) => 
              dispatch(bookingActions.setUpdatedBooking({ time: e.target.value }))
            }
            className="mb-4 p-2 w-full text-black rounded-md"
            placeholder="Time"
          />
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              className={`bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md ${
                status.update === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={status.update === 'loading'}
            >
              {status.update === 'loading' ? 'Updating...' : 'Update Booking'}
            </button>
            <button
              onClick={() => dispatch(bookingActions.clearCurrentBooking())}
              className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md"
              disabled={status.update === 'loading'}
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