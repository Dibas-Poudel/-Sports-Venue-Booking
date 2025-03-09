import React from "react";
import { useParams } from "react-router-dom";

const BookingPage = () => {
  const { game } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">Booking for {game.replace("-", " ")}</h1>
      <p className="text-lg text-gray-300 mt-4">Complete your booking for {game}.</p>
      
      {/* Booking form goes here */}
      <form className="mt-8 p-6 bg-gray-800 rounded-lg">
        <label className="block mb-4">
          Name:
          <input type="text" className="w-full p-2 mt-1 rounded bg-gray-700 text-white" />
        </label>
        <label className="block mb-4">
          Date:
          <input type="date" className="w-full p-2 mt-1 rounded bg-gray-700 text-white" />
        </label>
        <button onClick={(e)=>e.preventDefault()} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
