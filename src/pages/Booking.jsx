import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";

const BookingPage = () => {
  const { game } = useParams(); // game = venue ID
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [venueName, setVenueName] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setError("Error fetching user details.");
        return;
      }

      setUser(data?.user);
    };

    fetchUser();
  }, []);

  // Fetch venue name using venue ID (game)
  useEffect(() => {
    const fetchVenueName = async () => {
      const { data, error } = await supabase
        .from("sports_venues")
        .select("name")
        .eq("id", game)
        .single();

      if (error) {
        console.error("Error fetching venue name:", error.message);
      } else {
        setVenueName(data?.name);
      }
    };

    if (game) fetchVenueName();
  }, [game]);

  // Check if venue is available for selected date and time
  const checkAvailability = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("venue_name", venueName)
      .eq("date", date)
      .eq("time", time);

    if (error) {
      console.error("Error checking availability:", error.message);
      setError("Error checking availability.");
      return;
    }

    setIsAvailable(data.length === 0);
  };

  useEffect(() => {
    if (date && time && venueName) {
      checkAvailability();
    }
  }, [date, time, venueName]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !date || !time) {
      setError("Please fill in all fields.");
      return;
    }
    if (!isAvailable) {
      setError("This venue is already booked for the selected time.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: insertError } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user.id,
          venue_name: venueName,
          date,
          time,
          name,
        },
      ]);

    if (insertError) {
      setError("Error creating booking: " + insertError.message);
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-12">
      {!venueName ? (
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-400">Loading venue details...</h2>
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        {!isAvailable && (
          <p className="text-red-500 text-center mb-4">
            The selected venue is already booked for this time.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !isAvailable}
          className={`w-full py-3 rounded-lg font-semibold text-white ${
            loading || !isAvailable
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
