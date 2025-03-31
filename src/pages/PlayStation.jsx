import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaystationSports } from "../store/slice/sportsvenue";
import Spinner from "../components/Spinner";

const PlayStationGames = () => {
  const dispatch = useDispatch();
  const {
    playstationSports,
    loading,
    error,
    playstationStatus,
  } = useSelector((state) => state.sportsVenue);

  const { status } = useSelector((state) => state.admin); 
  
  useEffect(() => {
    if (playstationStatus === 'idle' || status.fetch === 'succeeded' || status.add === 'succeeded' || status.update === 'succeeded' || status.delete === 'succeeded') {
      dispatch(fetchPlaystationSports());
    }
  }, [dispatch, playstationStatus, status]);

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">PlayStation Games</h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          Explore our collection of exciting PlayStation games.
        </p>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center text-red-500 text-lg">
            Error loading games: {error}
          </div>
        ) : playstationSports.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            No PlayStation games available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {playstationSports.map((sport) => (
              <div
                key={sport.id}
                className="relative group overflow-hidden rounded-lg shadow-lg bg-gray-800"
              >
                <img
                  src={sport.image_url || "/images/playstatation.jpg"}
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
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition duration-300"
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
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition duration-300"
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

export default PlayStationGames;