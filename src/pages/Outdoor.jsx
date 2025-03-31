import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOutdoorSports } from "../store/slice/sportsvenue";
import Spinner from "../components/Spinner";

const OutdoorGames = () => {
  const dispatch = useDispatch();
  const { 
    outdoorSports, 
    loading, 
    error,
    outdoorStatus 
  } = useSelector((state) => state.sportsVenue);

  useEffect(() => {
    if (outdoorStatus === 'idle') {
      dispatch(fetchOutdoorSports());
    }
  }, [dispatch, outdoorStatus]);

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Outdoor Sports</h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          Choose from a variety of outdoor sports to enjoy with your friends or team.
        </p>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center text-red-500 text-lg">
            Error loading sports: {error}
          </div>
        ) : outdoorSports.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            No outdoor sports available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {outdoorSports.map((sport) => (
             <div
             key={sport.id}
             className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer bg-gray-800"
           >
             <img
               src={sport.image_url || "/images/football.jpg"}
               alt={sport.name}
               className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
             />

             {/* Content for mobile */}
             <div className="p-4 lg:hidden">
               <h3 className="text-xl font-bold mb-1">{sport.name}</h3>
               <p className="text-gray-300 text-sm mb-1">
                 {sport.description}
               </p>
               <p className="text-white font-semibold mb-3">
                 Price: Rs {sport.price}
               </p>
               <Link
                 to={`/sports/${sport.id}`}
                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-300"
               >
                 View
               </Link>
             </div>

             {/* Hover effect content for desktop */}
             <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition duration-300">
               <h3 className="text-2xl font-bold mb-2">{sport.name}</h3>
               <p className="text-gray-300 text-sm mb-2">
                 {sport.description}
               </p>
               <p className="text-white font-semibold mb-4">
                 Price: Rs {sport.price}
               </p>
               <Link
                 to={`/sports/${sport.id}`}
                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-300"
               >
                 View
               </Link>
             </div>
           </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OutdoorGames;