import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchSingleSport,
  sportsVenueActions,
} from "../redux/slices/sportsVenueSlice";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  wishlistActions,
} from "../redux/slices/wishlistSlice";

const SingleSportDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { wishlist, loading: wishlistLoading, addStatus, removeStatus } = useSelector(
    (state) => state.wishlist
  );

  const { singleSport, loading: singleSportLoading } = useSelector(
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
    if (wishlistLoading || processing) return; // prevent multiple clicks

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

  // Toast notifications for add
  useEffect(() => {
    if (addStatus === "succeeded") {
      toast.success("Added to wishlist");
      dispatch(wishlistActions.resetAddStatus());
    } else if (addStatus === "failed") {
      toast.error("Failed to add to wishlist");
      dispatch(wishlistActions.resetAddStatus());
    }
  }, [addStatus, dispatch]);

  // Toast notifications for remove
  useEffect(() => {
    if (removeStatus === "succeeded") {
      toast.info("Removed from wishlist");
      dispatch(wishlistActions.resetRemoveStatus());
    } else if (removeStatus === "failed") {
      toast.error("Failed to remove from wishlist");
      dispatch(wishlistActions.resetRemoveStatus());
    }
  }, [removeStatus, dispatch]);

  return (
    <div>
      {/* Example UI showing singleSport details */}
      {singleSportLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>{singleSport?.name}</h1>
          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            disabled={processing || wishlistLoading}
          >
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
          {/* Other details */}
        </>
      )}
    </div>
  );
};

export default SingleSportDetail;
