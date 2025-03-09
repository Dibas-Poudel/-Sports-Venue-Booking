import React from 'react';
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const navigate=useNavigate()
  return (
    <div>
      {/* Hero Section */}
      <section className="h-screen bg-cover bg-center relative"style={{ backgroundImage: "url('/images/hero.jpg')" }}>
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Sports & Gaming Venue</h1>
          <p className="text-xl mb-6">Book your favorite sports facilities and gaming stations with ease</p>
          <button onClick={()=>navigate("/games")} className="bg-blue-500 text-white py-2 px-6 rounded-full text-lg transition-transform transform hover:scale-105">
            Book Now
          </button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl">
            Our mission is to provide an inclusive, safe, and enjoyable environment for everyone to play and relax, whether you're looking to engage in a competitive game or just unwind with friends.
          </p>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-gray-100" id="facilities">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Facilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <img src="/images/basket.jpg" alt="Basketball Court" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Basketball Courts</h3>
              <p>Book a court for a friendly match or practice your skills!</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <img src="images/tennis.jpg" alt="Tennis Court" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Tennis Courts</h3>
              <p>Enjoy a game of tennis with your friends or family!</p>
            </div>
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <img src="images/playstatation.jpg" alt="PlayStation Gaming" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-2xl font-semibold mb-4">PlayStation Gaming Station</h3>
              <p>Experience gaming like never before with our PlayStation setup!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
