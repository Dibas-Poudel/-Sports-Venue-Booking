import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  fetchVenueName, 
  checkAvailability, 
  createBooking, 
  bookingActions
} from "../store/slice/booking";

const BookingPage = () => {
  const { game } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    venueName, 
    isAvailable, 
    loading, 
    error,
    status 
  } = useSelector((state) => state.booking);
  const user = useSelector((state) => state.user.profile);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Fetch venue name
  useEffect(() => {
    if (game && status.fetchVenueName === 'idle') {
      dispatch(fetchVenueName(game));
    }
  }, [game, dispatch, status.fetchVenueName]);
useEffect(() => {
  if (game) {
    dispatch(fetchVenueName(game));
  }
}, [game, dispatch]);

  // Check availability when date/time changes
  useEffect(() => {
    if (date && time && venueName && status.checkAvailability === 'idle') {
      dispatch(checkAvailability({ venueName, date, time }));
    }
  }, [date, time, venueName, dispatch, status.checkAvailability]);

  // Reset status after operations
  useEffect(() => {
    if (status.create === 'succeeded') {
      setTimeout(() => dispatch(bookingActions.resetStatus('create')), 1000);
      navigate("/dashboard");
    }
  }, [status.create, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !date || !time) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!isAvailable) {
      toast.error("This venue is already booked for the selected time.");
      return;
    }
    if (!user) {
      toast.error("Please log in to make a booking.");
      return;
    }

    try {
      await dispatch(createBooking({
        userId: user.id,
        venueName,
        date,
        time,
        name
      })).unwrap();
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const isLoading = loading || status.fetchVenueName === 'loading';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-12">
      {isLoading ? (
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-400">Loading...</h2>
      ) : (
        <>
          <h2 className="text-4xl font-bold mb-4 text-center text-gray-100">
            Book Your Venue: {venueName}
          </h2>
          <p className="text-sm text-gray-300 text-center mb-6">
            Please fill out the form below to confirm your booking for {venueName}.
          </p>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-gray-800 rounded-xl shadow-xl space-y-6"
      >
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div>
          <label className="block text-gray-300 mb-2">Your Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            required
            disabled={status.create === 'loading'}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            required
            disabled={status.create === 'loading'}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Time:</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            required
            disabled={status.create === 'loading'}
          />
        </div>

        {date && time && !isAvailable && (
          <p className="text-red-500 text-center mb-4">
            The selected venue is already booked for this time.
          </p>
        )}

        <button
          type="submit"
          disabled={status.create === 'loading' || !isAvailable}
          className={`w-full py-3 rounded-lg font-semibold text-white ${
            status.create === 'loading' || !isAvailable
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {status.create === 'loading' ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;