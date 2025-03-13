import React from "react";
import { Link } from "react-router-dom";

// Game Data
const games = [
  {
    title: "Outdoor Games",
    image: "images/basket.jpg",
    description: "Book football, basketball, tennis courts, and more.",
    route: "/games/outdoor", 
  },
  {
    title: "Indoor Games",
    image: "images/tennis.jpg",
    description: "Enjoy chess, table tennis, snooker, and other indoor games.",
    route: "/games/indoor",
  },
  {
    title: "PlayStation Gaming Station",
    image: "images/playstatation.jpg",
    description: "Reserve a PlayStation station and play your favorite games.",
    route: "/games/playstation", 
  },
];

const Games = () => {
  return (
    <section className="py-16 h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-6">Explore Our Games</h2>
        <p className="text-lg text-gray-300 mb-12">
          Choose from a variety of outdoor, indoor, and PlayStation gaming experiences.
        </p>

        {/* Game Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <Link key={index} to={game.route}>
              <div className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-60 object-cover transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-6 opacity-0 group-hover:opacity-100 transition duration-300">
                  <h3 className="text-xl font-bold">{game.title}</h3>
                  <p className="text-gray-300 text-sm mt-2">{game.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Games;
