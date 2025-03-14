import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../services/supabaseClient';

const OutdoorGames = () => {
  const [outdoorSports, setOutdoorSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutdoorSports = async () => {
      try {
        const { data, error } = await supabase
          .from('sports_venues')
          .select('*')
          .eq('type', 'Outdoor');

        if (error) throw error;

        setOutdoorSports(data);
      } catch (error) {
        console.error('Error fetching outdoor sports:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOutdoorSports();
  }, []);

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Outdoor Sports</h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          Choose from a variety of outdoor sports to enjoy with your friends or team.
        </p>

        {loading ? (
          <div className="text-center text-gray-400 text-lg">Loading...</div>
        ) : outdoorSports.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">No outdoor sports available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {outdoorSports.map((sport) => (
              <div
                key={sport.id}
                className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer bg-gray-800"
              >
                <img
                  src={sport.image_url || '/images/football.jpg'}
                  alt={sport.name}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition duration-300">
                  <h3 className="text-2xl font-bold mb-2">{sport.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{sport.description}</p>

                  <p className="text-white font-semibold mb-4">Price: Rs {sport.price}</p>

                  <Link
                    to={`/book/${sport.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-300"
                  >
                    Book Now
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
