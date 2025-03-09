import React from 'react';
import { Link } from 'react-router-dom';

const outdoorSports = [
  {
    name: "Football",
    description: "Book a football field and play your favorite game with friends.",
    image: "/images/football.jpg", 
    link: "/book/football",
  },
  {
    name: "Basketball",
    description: "Reserve a basketball court for some hoop action.",
    image: "/images/basket.jpg", 
    link: "/book/basketball",
  },
  {
    name: "Tennis",
    description: "Get a tennis court for your singles or doubles match.",
    image: "/images/tennis.jpg", 
    link: "/book/tennis",
  },
  {
    name: "Cricket",
    description: "Play cricket with friends on a professional field.",
    image: "/images/crikcet.jpg", 
    link: "/book/cricket",
  },
];

const OutdoorGames = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Outdoor Sports</h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          Choose from a variety of outdoor sports to enjoy with your friends or team.
        </p>

        {/* Grid of Sports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {outdoorSports.map((sport, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer bg-gray-800"
            >
              <img
                src={sport.image}
                alt={sport.name}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition duration-300">
                <h3 className="text-2xl font-bold mb-4">{sport.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{sport.description}</p>
                <Link
                  to={sport.link}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-300"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutdoorGames;
