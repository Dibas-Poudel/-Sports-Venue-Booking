import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserBookings from './UserBooking';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../../store/slice/wishlist';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.profile);
  const { wishlist, loading } = useSelector((state) => state.wishlist);

  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishlist());
    }
  }, [user?._id, dispatch]);

  const handleWishlistToggle = (venueId) => {
    if (!user?._id) {
      toast.error('Please log in to modify wishlist');
      return;
    }

    setProcessingId(venueId);

    const isWishlisted = wishlist.some(item => item.sportVenueId === venueId);

    if (isWishlisted) {
      dispatch(removeFromWishlist(venueId)).finally(() => setProcessingId(null));
    } else {
      dispatch(addToWishlist(venueId)).finally(() => setProcessingId(null));
    }
  };

  const handleBookNow = () => {
    navigate('/games');
  };

  if (loading && wishlist.length === 0) return <Spinner />;

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
            wishlist.map(({ sportVenueId, sportVenueId: sportsVenue }) => (
              <div
                key={sportVenueId}
                className="bg-gray-800 p-4 rounded-xl shadow-md flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-semibold">{sportsVenue?.name}</h3>
                  <p className="text-sm text-gray-400">{sportsVenue?.description}</p>
                  <p className="text-lg font-semibold mt-2">Rs {sportsVenue?.price}</p>
                </div>

                <button
                  onClick={() => handleWishlistToggle(sportVenueId)}
                  disabled={processingId === sportVenueId}
                  className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg ${
                    processingId === sportVenueId ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {processingId === sportVenueId ? 'Processing...' : 'Remove from Wishlist'}
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
