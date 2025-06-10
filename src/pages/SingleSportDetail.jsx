import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleSport, sportsVenueActions } from "../store/slice/sportsvenue";
import { fetchWishlist, addToWishlist, removeFromWishlist, wishlistActions } from "../store/slice/wishlist";
import Spinner from "../components/Spinner";
import Reviews from "./Reviews";
import { toast } from "react-toastify";

const SingleSportDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { wishlist = [], loading: wishlistLoading, addStatus, removeStatus } = useSelector(state => state.wishlist);
  const { singleSport, loading: sportLoading, singleStatus } = useSelector(state => state.sportsVenue);
  const user = useSelector(state => state.user.profile);

  // Local state to disable wishlist button only during processing of this item
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    dispatch(sportsVenueActions.clearSingleSport());
    dispatch(fetchSingleSport(id));
    if (user?.id) {
      dispatch(fetchWishlist());
    }
    return () => {
      dispatch(sportsVenueActions.clearSingleSport());
    };
  }, [id, dispatch, user?.id]);

const isWishlisted = useMemo(() => {
  return Array.isArray(wishlist) && wishlist.some(
    (item) => item.sportVenueId?._id?.toString() === id.toString()
  );
}, [wishlist, id]);
  const handleWishlistToggle = () => {
    if (!user) {
      toast.warn("Please log in to modify wishlist");
      return;
    }

    setProcessing(true);

    if (isWishlisted) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(id));
    }
  };

  // Listen for add/remove success/failure and react accordingly
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

  if (sportLoading || singleStatus === "loading") return <Spinner />;
  if (!singleSport || singleStatus === "failed")
    return <p className="text-red-500 text-center">Sport not found.</p>;

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

            {user ? (
              <button
                onClick={handleWishlistToggle}
                disabled={processing}
                className={`${
                  isWishlisted ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
                } text-white py-2 px-6 rounded-lg transition-all duration-300`}
              >
                {processing
                  ? "Processing..."
                  : isWishlisted
                  ? "❌ Remove from Wishlist"
                  : "❤️ Add to Wishlist"}
              </button>
            ) : (
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
