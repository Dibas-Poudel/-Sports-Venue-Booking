import React from 'react';
import { Link } from 'react-router-dom';

const playstationGames = [
  {
    name: "FIFA 22",
    description: "Play FIFA 22 and enjoy football action.",
    image: "/images/fifa.jpg", 
    link: "/book/fifa22",
  },
  {
    name: "Call of Duty: Warzone",
    description: "Team up and fight in Call of Duty: Warzone.",
    image: "/images/cod.webp", 
    link: "/book/cod-warzone",
  },
  {
    name: "NBA 2K21",
    description: "Play NBA 2K21 and experience the thrill of basketball.",
    image: "/images/nba.webp",  
    link: "/book/nba2k21",
  },
 
];

const PlayStationGames = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">PlayStation Games</h2>
        <p className="text-lg text-gray-300 text-center mb-12">
          Reserve a PlayStation station and play your favorite games.
        </p>

        {/* Grid of Games */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {playstationGames.map((game, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer bg-gray-800"
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition duration-300">
                <h3 className="text-2xl font-bold mb-4">{game.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{game.description}</p>
                <Link
                  to={game.link}
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

export default PlayStationGames;
