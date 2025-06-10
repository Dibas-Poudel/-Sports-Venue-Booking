import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleSport, sportsVenueActions } from "../store/slice/sportsvenue";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  wishlistActions,
} from "../store/slice/wishlist";
import Spinner from "../components/Spinner";
import Reviews from "./Reviews";
import { toast } from "react-toastify";

const SingleSportDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    wishlist = [],
    fetchStatus: wishlistFetchStatus, // Renamed for clarity: 'idle', 'loading', 'succeeded', 'failed'
    addStatus,
    removeStatus,
  } = useSelector((state) => state.wishlist);
  const { singleSport, singleStatus } = useSelector(
    (state) => state.sportsVenue
  );
  const user = useSelector((state) => state.user.profile);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(sportsVenueActions.clearSingleSport());
    dispatch(fetchSingleSport(id));

    // Only fetch wishlist if a user is logged in
    if (user?.id) {
      dispatch(fetchWishlist());
    }

    return () => {
      dispatch(sportsVenueActions.clearSingleSport());
    };
  }, [id, dispatch, user?.id]); // Re-run if ID or user changes

  // Determine if the wishlist data is ready to be used for comparison
  const wishlistDataLoaded = useMemo(() => {
    // If no user, wishlist is "ready" as there's nothing to fetch
    if (!user) {
      return true;
    }
    // If user exists, wishlist is ready if the fetch has completed (succeeded or failed)
    return wishlistFetchStatus === "succeeded" || wishlistFetchStatus === "failed";
  }, [user, wishlistFetchStatus]);


  // Determine if the current sport is in the wishlist
  const isWishlisted = useMemo(() => {
    // We can only reliably determine this if the wishlist data has loaded
    if (!wishlistDataLoaded || !Array.isArray(wishlist)) {
      return false;
    }
    return wishlist.some(
      (item) => item.sportVenueId?._id?.toString() === id?.toString()
    );
  }, [wishlist, id, wishlistDataLoaded]); // Recalculate when wishlist changes, id changes, or data load status changes

  const handleWishlistToggle = () => {
    if (!user) {
      toast.warn("Please log in to modify wishlist");
      return;
    }

    if (!wishlistDataLoaded) {
      toast.error("Wishlist data is still loading. Please wait.");
      return;
    }

    setProcessing(true);

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  useEffect(() => {
    if (addStatus === "succeeded") {
      toast.success("Added to wishlist");
      dispatch(wishlistActions.resetAddStatus());
      setProcessing(false);
    } else if (addStatus === "failed") {
      toast.error("Failed to add to wishlist");
      dispatch(wishlistActions.resetAddStatus());
      setProcessing(false);
    }
  }, [addStatus, dispatch]);

  useEffect(() => {
    if (removeStatus === "succeeded") {
      toast.info("Removed from wishlist");
      dispatch(wishlistActions.resetRemoveStatus());
      setProcessing(false);
    } else if (removeStatus === "failed") {
      toast.error("Failed to remove from wishlist");
      dispatch(wishlistActions.resetRemoveStatus());
      setProcessing(false);
    }
  }, [removeStatus, dispatch]);

  // Combined Loading State: Show spinner if either sport or user's wishlist (if logged in) is loading
  if (
    singleStatus === "loading" ||
    (user?.id && wishlistFetchStatus === "loading")
  ) {
    return <Spinner />;
  }

  // Error/Not Found State for the Sport Detail itself
  if (!singleSport || singleStatus === "failed") {
    return <p className="text-red-500 text-center">Sport not found.</p>;
  }

  // --- Render the content once all necessary data is loaded ---
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
          <p className="text-lg font-semibold mb-6">
            Price: Rs {singleSport.price}
          </p>

          <div className="flex gap-4">
            <Link
              to={`/book/${singleSport._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all duration-300 inline-block"
            >
              Book now
            </Link>

            {user ? (
              <button
                onClick={handleWishlistToggle}
                // Disable if processing or if wishlist data hasn't fully loaded yet
                disabled={processing || !wishlistDataLoaded}
                className={`${
                  isWishlisted
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-600 hover:bg-gray-700"
                } text-white py-2 px-6 rounded-lg transition-all duration-300`}
              >
                {processing
                  ? "Processing..."
                  : isWishlisted
                  ? "❌ Remove from Wishlist"
                  : "❤️ Add to Wishlist"}
              </button>
            ) : (
              <p className="text-gray-400 font-semibold mt-4">
                Please log in to add to wishlist
              </p>
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