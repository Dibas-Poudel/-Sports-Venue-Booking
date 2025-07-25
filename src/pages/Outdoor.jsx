import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOutdoorSports } from "../store/slice/sportsvenue";
import { resetAllStatuses } from "../store/slice/admin.js";
import Spinner from "../components/Spinner";

const OutdoorGames = () => {
  const dispatch = useDispatch();

  const {
    outdoorSports,
    error,
    outdoorStatus,
  } = useSelector((state) => state.sportsVenue);

  const { status } = useSelector((state) => state.admin);

  useEffect(() => {
    if (
      status.add === "succeeded" ||
      status.update === "succeeded" ||
      status.delete === "succeeded"
    ) {
      dispatch(fetchOutdoorSports());
      dispatch(resetAllStatuses()); // ✅ Reset admin statuses
    } else if (outdoorStatus === "idle") {
      dispatch(fetchOutdoorSports());
    }
  }, [dispatch, status, outdoorStatus]);

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Outdoor Sports</h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          Enjoy our wide range of outdoor sports and activities.
        </p>

        {outdoorStatus === "loading" ? (
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
              <Link
                to={`/sports/${sport._id}`}
                key={sport.id}
                className="block relative group overflow-hidden rounded-lg shadow-lg bg-gray-800 hover:bg-gray-700 transition duration-300"
              >
                <img
                  src={sport.imageUrl || "/images/hero.jpg"}
                  alt={sport.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{sport.name}</h3>
                  <p className="text-gray-300 text-sm mb-1 line-clamp-2">
                    {sport.description}
                  </p>
                  <p className="text-white font-semibold">
                    Price: Rs {sport.price}
                  </p>
                  <div className="mt-3">
                    <span className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition duration-300">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OutdoorGames;
