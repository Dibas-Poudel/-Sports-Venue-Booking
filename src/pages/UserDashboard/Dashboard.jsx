import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserBookings from './UserBooking';
import Spinner from '../../components/Spinner';
import supabase from '../../services/supabaseClient';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const user = useSelector((state) => state.user.profile);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch wishlist items for the logged-in user
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, sports_venues(*)')
        .eq('user_id', user.id);

      if (!error) {
        setWishlist(data);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [user]);

  // Handle adding/removing items to/from the wishlist
  const handleWishlistToggle = async (venueId) => {
    if (!user) {
      return toast.error("Please log in to add to wishlist");
    }

    const existingItem = wishlist.find(item => item.venue_id === venueId);
    
    if (existingItem) {
      // Remove from wishlist
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('venue_id', venueId);
      
      if (!error) {
        setWishlist(wishlist.filter(item => item.venue_id !== venueId));
        toast.success("Removed from wishlist");
      }
    } else {
      // Add to wishlist
      const { error } = await supabase
        .from('wishlist')
        .upsert({ user_id: user.id, venue_id: venueId });

      if (!error) {
        setWishlist([...wishlist, { venue_id: venueId }]);
        toast.success("Added to wishlist");
      }
    }
  };

  const handleBookNow = () => {
    navigate(`/games`);
  };

  if (loading) return <Spinner />;
  if (!user) {
    return (
      <p className="text-center text-lg text-white bg-gray-800 p-4 rounded-lg mt-6">
        Please log in to view your dashboard.
      </p>
    );
  }

  return (
    <div className="p-6 mx-auto bg-gray-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
      <p className="text-lg text-gray-300">Hello, {user?.email}</p>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="bg-gray-800 p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Book a Venue</h2>
          <p className="text-sm text-gray-400">
            Start booking your favorite sports venue now.
          </p>
          <button
            onClick={handleBookNow}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Book Now
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Your Wishlist</h2>
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
          {wishlist.length === 0 ? (
            <p className="text-gray-400">Your wishlist is empty.</p>
          ) : (
            wishlist.map(({ venue_id, sports_venues }) => (
              <div
                key={venue_id}
                className="bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{sports_venues?.name}</h3>
                  <p className="text-sm text-gray-400">{sports_venues?.description}</p>
                  <p className="text-lg font-semibold mt-2">Rs {sports_venues?.price}</p>
                </div>

                <button
                  onClick={() => handleWishlistToggle(venue_id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  {wishlist.some(item => item.venue_id === venue_id)
                    ? 'Remove from Wishlist'
                    : 'Add to Wishlist'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-10">
        <UserBookings />
      </div>
    </div>
  );
};

export default Dashboard;
