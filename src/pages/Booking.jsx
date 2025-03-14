import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";

const BookingPage = () => {
  const { game } = useParams(); // Get the game/venue name from the URL params
  const navigate = useNavigate(); // Navigation hook to redirect after booking
  const [name, setName] = useState(""); // User's name for booking
  const [date, setDate] = useState(""); // Date for the booking
  const [time, setTime] = useState(""); // Start time for the booking
  const [loading, setLoading] = useState(false); // Loading state during the booking process
  const [error, setError] = useState(""); // Error message state
  const [user, setUser] = useState(null); // User information from Supabase

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setLoading(false);
        return;
      }

      setUser(data?.user); // Set the user info from Supabase
      setLoading(false);
    };

    fetchUser(); // Fetch user info when the component mounts
  }, []);

  // Helper function to calculate the end time (60 minutes after the start time)
  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number); // Split and convert to numbers
    const endDate = new Date(0, 0, 0, hours, minutes + 60); // Add 60 minutes
    return endDate.toISOString().substring(11, 16); // Return the end time in HH:mm format
  };

  // Handle form submission
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

    setLoading(true);
    setError(""); // Reset any previous error

    const startTime = time;
    const endTime = calculateEndTime(startTime); // Calculate the end time (60 minutes later)

    // Check if the selected time slot is available
    const { data, error: availabilityError } = await supabase
      .from("bookings")
      .select("*")
      .eq("venue_name", game) // Check for the selected venue
      .eq("date", date) // Check for the selected date
      .filter("time", "lt", endTime) // Check if the existing booking's time is before the calculated end time
      .filter("time", "gt", startTime); // Check if the existing booking's time is after the selected start time

    if (availabilityError) {
      setError("Error checking availability: " + availabilityError.message);
      setLoading(false);
      return;
    }

    if (data.length > 0) {
      setError("Selected time slot is already booked.");
      setLoading(false);
      return;
    }

    // Insert the new booking if the slot is available
    const { insertData, insertError } = await supabase
      .from("bookings")
      .insert([
        {
          user_id: user.id,
          venue_name: game,
          date,
          time: startTime, // Store the start time
          name,
        },
      ]);

    if (insertError) {
      setError("Error creating booking: " + insertError.message);
    } else {
      navigate("/dashboard"); // Redirect to dashboard if booking is successful
    }

    setLoading(false);
  };

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

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full"
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
