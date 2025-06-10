import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchSingleSport, sportsVenueActions } from "../store/slice/sportsvenue.js";
import { fetchWishlist, addToWishlist, removeFromWishlist, wishlistActions } from "../store/slice/wishlist.js";

const SingleSportDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Safer user access
  const user = useSelector((state) => state.auth?.user || null);
  const { wishlist, loading: wishlistLoading, addStatus, removeStatus } = useSelector(
    (state) => state.wishlist
  );

  const { singleSport, loading: singleSportLoading, error: sportError } = useSelector(
    (state) => state.sportsVenue
  );

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(sportsVenueActions.clearSingleSport());
    dispatch(fetchSingleSport(id));
    if (user?.id) dispatch(fetchWishlist());

    return () => {
      dispatch(sportsVenueActions.clearSingleSport());
      dispatch(wishlistActions.clearWishlist());
    };
  }, [id, dispatch, user?.id]);

  // Handle sport loading error
  useEffect(() => {
    if (sportError) {
      toast.error("Failed to load sport details");
    }
  }, [sportError]);

  // Memoized check if venue is in wishlist
  const isWishlisted = useMemo(() => {
    if (!wishlist || wishlistLoading) return false;
    return wishlist.some(
      (item) => item.sportVenueId?._id?.toString() === id?.toString()
    );
  }, [wishlist, id, wishlistLoading]);

  const handleWishlistToggle = () => {
    if (!user) {
      toast.warn("Please log in to modify wishlist");
      return;
    }
    if (wishlistLoading || processing) return;

    setProcessing(true);

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  // Stop processing when add or remove succeeds/fails
  useEffect(() => {
    if (
      addStatus === "succeeded" ||
      addStatus === "failed" ||
      removeStatus === "succeeded" ||
      removeStatus === "failed"
    ) {
      setProcessing(false);
    }
  }, [addStatus, removeStatus]);

  // Toast notifications for wishlist actions
  useEffect(() => {
    if (addStatus === "succeeded") {
      toast.success("Added to wishlist");
      dispatch(wishlistActions.resetAddStatus());
    } else if (addStatus === "failed") {
      toast.error("Failed to add to wishlist");
      dispatch(wishlistActions.resetAddStatus());
    }

    if (removeStatus === "succeeded") {
      toast.info("Removed from wishlist");
      dispatch(wishlistActions.resetRemoveStatus());
    } else if (removeStatus === "failed") {
      toast.error("Failed to remove from wishlist");
      dispatch(wishlistActions.resetRemoveStatus());
    }
  }, [addStatus, removeStatus, dispatch]);

  if (sportError) {
    return <Navigate to="/sports" replace />;
  }

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
              to={`/book/${singleSport._id}`}
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