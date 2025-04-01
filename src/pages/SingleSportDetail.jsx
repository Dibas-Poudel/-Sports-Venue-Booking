import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleSport, sportsVenueActions } from "../store/slice/sportsvenue";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "../store/slice/wishlist";
import Spinner from "../components/Spinner";
import Reviews from "./Reviews";
import { toast } from "react-toastify";

const SingleSportDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { 
    singleSport, 
    loading,
    singleStatus 
  } = useSelector((state) => state.sportsVenue);
  const { items: wishlist, loading: wishlistLoading } = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user.profile);

  useEffect(() => {
    dispatch(sportsVenueActions.clearSingleSport()); 
    dispatch(fetchSingleSport(id));
  
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [id, dispatch, user]);
  

  const isWishlisted = wishlist.some(item => item.venue_id === id);

  const handleWishlistToggle = () => {
    if (!user) {
      toast.warn("Please log in to modify wishlist");
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist({ userId: user.id, venueId: id }));
    } else {
      dispatch(addToWishlist({ userId: user.id, venueId: id }));
    }
  };

  if (loading || singleStatus === 'loading') return <Spinner />;
  if (!singleSport || singleStatus === 'failed') return <p className="text-red-500 text-center">Sport not found.</p>;

  return (
    <div className="bg-gray-900 min-h-screen text-white py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <img
            src={singleSport.image_url || "/images/snooker.jpg"}
            alt={singleSport.name}
            className="w-full h-96 object-cover rounded-xl mb-6"
          />
          <h2 className="text-3xl font-bold mb-4">{singleSport.name}</h2>
          <p className="text-gray-300 mb-4">{singleSport.description}</p>
          <p className="text-lg font-semibold mb-6">Price: Rs {singleSport.price}</p>

          <div className="flex gap-4">
            <Link
              to={`/book/${singleSport.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all duration-300 inline-block"
            >
              Book now
            </Link>

            {user && (
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`${
                  isWishlisted
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white py-2 px-6 rounded-lg transition-all duration-300`}
              >
                {wishlistLoading ? "Processing..." : 
                  isWishlisted ? "❌ Remove from Wishlist" : "❤️ Add to Wishlist"}
              </button>
            )}
            {!user && (
              <p className="text-red-500 font-semibold mt-4">Please log in to add to wishlist</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          <Reviews venueId={id} user={user} />
        </div>
      </div>
    </div>
  );
};

export default SingleSportDetail;