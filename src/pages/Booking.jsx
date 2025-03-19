import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";

const BookingPage = () => {
  const { game } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true); 

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

  // Function to check if the venue is available for the selected date and time
  const checkAvailability = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("venue_name", game)
      .eq("date", date)
      .eq("time", time);

    if (error) {
      console.error("Error checking availability:", error.message);
      setError("Error checking availability.");
      return;
    }

    if (data.length > 0) {
      setIsAvailable(false); 
    } else {
      setIsAvailable(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !date || !time) {
      setError("Please fill in all fields.");
      return;
    }

    if (!user) {
      setError("You need to be logged in to book a venue.");
      return;
    }

    if (!isAvailable) {
      setError("This venue is already booked for the selected time.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user.id,
          venue_name: game,
          date,
          time,
          name,
        },
      ]);

    if (error) {
      setError("Error creating booking: " + error.message);
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (date && time) {
      checkAvailability();
    }
  }, [date, time]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Booking for {game.replace("-", " ")}</h1>
      <p className="text-lg text-gray-300 mt-4">Complete your booking for {game}.</p>

      <form onSubmit={handleSubmit} className="mt-8 p-6 bg-gray-800 rounded-lg">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-4">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
            required
            disabled={loading}
          />
        </label>

        <label className="block mb-4">
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
            required
            disabled={loading}
          />
        </label>

        <label className="block mb-4">
          Time:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 mt-1 rounded bg-gray-700 text-white"
            required
            disabled={loading}
          />
        </label>

        {/* Show availability status */}
        {!isAvailable && (
          <p className="text-red-500 mb-4">The selected venue is already booked for this time.</p>
        )}

        <button
          type="submit"
          disabled={loading || !isAvailable}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
