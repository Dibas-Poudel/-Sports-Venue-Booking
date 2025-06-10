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
  wishlistActions,
} from '../../store/slice/wishlist';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.profile);

  // Safely destructure wishlist state with default values
  const {
    wishlist = [],
    loading = false,
    addStatus = 'idle',
    removeStatus = 'idle',
    fetchStatus = 'idle',
  } = useSelector((state) => state.wishlist);

  const [processingId, setProcessingId] = useState(null);

  // Fetch wishlist once when user is logged in and status is idle
  useEffect(() => {
    if (user?._id && fetchStatus === 'idle') {
      dispatch(fetchWishlist());
    }
  }, [user?._id, dispatch, fetchStatus]);

  // Handle wishlist toggle (add/remove)
  const handleWishlistToggle = (venueId) => {
    if (!user?._id) {
      toast.error('Please log in to modify wishlist');
      return;
    }

    setProcessingId(venueId);

    const isWishlisted = wishlist.some(
      (item) => item.venue_id?.toString() === venueId.toString()
    );

    if (isWishlisted) {
      dispatch(removeFromWishlist(venueId));
    } else {
      dispatch(addToWishlist(venueId));
    }
  };

  // Reset statuses and clear processingId after add/remove completes
  useEffect(() => {
    if (addStatus === 'succeeded' || addStatus === 'failed') {
      dispatch(wishlistActions.resetAddStatus());
      setProcessingId(null);
    }
    if (removeStatus === 'succeeded' || removeStatus === 'failed') {
      dispatch(wishlistActions.resetRemoveStatus());
      setProcessingId(null);
    }
  }, [addStatus, removeStatus, dispatch]);

  const handleBookNow = () => {
    navigate('/games');
  };

  if (loading && fetchStatus === 'loading') return <Spinner />;

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
                  <p className="text-sm text-gray-400">
                    {sports_venues?.description}
                  </p>
                  <p className="text-lg font-semibold mt-2">Rs {sports_venues?.price}</p>
                </div>

                <button
                  onClick={() => handleWishlistToggle(venue_id)}
                  disabled={processingId === venue_id}
                  className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg ${
                    processingId === venue_id ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {processingId === venue_id ? 'Processing...' : 'Remove from Wishlist'}
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
