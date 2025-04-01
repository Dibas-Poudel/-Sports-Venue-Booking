import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { 
  fetchReviews,
  addReview,
  updateReview,
  deleteReview,
  reviewActions 
} from '../store/slice/review';

const Reviews = ({ venueId, user }) => {
  const dispatch = useDispatch();
  const { 
    items: reviews, 
    loading, 
    currentReview,
    addStatus,
    updateStatus,
    deleteStatus
  } = useSelector((state) => state.reviews);
  
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  // Initialize form if editing
  useEffect(() => {
    if (currentReview) {
      setRating(currentReview.rating);
      setComment(currentReview.comment);
    } else {
      setRating(1);
      setComment('');
    }
  }, [currentReview]);

  useEffect(() => {
    if (venueId) {
      dispatch(fetchReviews(venueId));
    }
  }, [venueId, dispatch]);

  // Reset status when operation completes
  useEffect(() => {
    if (addStatus === 'succeeded' || addStatus === 'failed') {
      const timer = setTimeout(() => dispatch(reviewActions.resetAddStatus()), 1000);
      return () => clearTimeout(timer);
    }
    if (updateStatus === 'succeeded' || updateStatus === 'failed') {
      const timer = setTimeout(() => dispatch(reviewActions.resetUpdateStatus()), 1000);
      return () => clearTimeout(timer);
    }
    if (deleteStatus === 'succeeded' || deleteStatus === 'failed') {
      const timer = setTimeout(() => dispatch(reviewActions.resetDeleteStatus()), 1000);
      return () => clearTimeout(timer);
    }
  }, [addStatus, updateStatus, deleteStatus, dispatch]);

  // Handle form submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.warn('You must be logged in to leave a review.');
      return;
    }

    if (currentReview) {
      // Update existing review
      dispatch(
        updateReview({
          reviewId: currentReview.id,
          venueId,
          rating,
          comment,
        })
      );
    } else {
      // Add new review
      dispatch(
        addReview({
          venueId,
          userId: user.id,
          email: user.email,
          rating,
          comment,
        })
      );
    }
  };

  // Handle edit action
  const handleEditReview = (review) => {
    dispatch(reviewActions.setCurrentReview(review));
  };

  // Handle delete action
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview({ reviewId, venueId }));
    }
  };

  const isProcessing = addStatus === 'loading' || 
                      updateStatus === 'loading' || 
                      deleteStatus === 'loading';

  if (loading && reviews.length === 0) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-4">Reviews</h3>

      {/* Review Form */}
      <form onSubmit={handleSubmitReview} className="mb-6 bg-gray-800 p-4 rounded-lg">
        <label className="block mb-2">
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
            disabled={isProcessing}
            required
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} {r === 1 ? 'star' : 'stars'}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
            rows={3}
            required
            disabled={isProcessing}
          />
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            className={`mt-3 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold ${
              isProcessing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : currentReview ? 'Update Review' : 'Add Review'}
          </button>

          {currentReview && (
            <button
              type="button"
              onClick={() => dispatch(reviewActions.clearCurrentReview())}
              className="mt-3 bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded-lg font-semibold"
              disabled={isProcessing}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">{review.email}</p>
                  <div className="flex items-center my-1">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-sm text-gray-400">
                      ({review.rating}/5)
                    </span>
                  </div>
                  <p className="mt-1 text-gray-200">{review.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                {user?.id === review.user_id && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditReview(review)}
                      className="text-blue-500 hover:text-blue-400 text-sm"
                      disabled={isProcessing}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-500 hover:text-red-400 text-sm"
                      disabled={isProcessing}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;