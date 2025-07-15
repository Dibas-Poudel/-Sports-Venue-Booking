import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchReviews, addReview, updateReview, deleteReview, reviewActions } from '../store/slice/review';

const Reviews = ({ venueId, user }) => {
  const dispatch = useDispatch();
  const { items: reviews = [], loading, currentReview } = useSelector((state) => state.reviews);

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  // Fetch reviews when venue ID changes
  useEffect(() => {
    if (venueId) {
      dispatch(fetchReviews(venueId));
    }
  }, [venueId, dispatch]);

  // Reset form fields when currentReview is cleared
  useEffect(() => {
    if (currentReview === null) {
      setRating(1);
      setComment('');
    } else {
      setRating(currentReview.rating);
      setComment(currentReview.comment);
    }
  }, [currentReview]);

  // Handle Review Submission
  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!user) {
      toast.warn('You must be logged in to leave a review.');
      return;
    }

    if (currentReview?._id) {
      dispatch(updateReview({ reviewId: currentReview._id, venueId, rating, comment, user }));
    } else {
      dispatch(addReview({ venueId, rating, comment, user }));
    }

    dispatch(reviewActions.clearCurrentReview());
  };

  // Handle Editing a Review
  const handleEditReview = (review) => {
    dispatch(reviewActions.setCurrentReview(review));
  };

  // Handle Deleting a Review
  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview({ reviewId, venueId, user }));
    }
  };

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
            required
            disabled={loading}
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} {r === 1 ? 'star' : 'stars'}</option>
            ))}
          </select>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
          rows={3}
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`mt-3 py-2 px-4 rounded-lg font-semibold ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {currentReview?._id ? 'Update Review' : 'Add Review'}
        </button>
      </form>

      {/* Loading State */}
      {loading && <p className="text-center py-4">Loading reviews...</p>}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-400">{review.email || 'Anonymous'}</p>
            <p>{review.comment}</p>
            {user?.id === review.userId?._id && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleEditReview(review)}
                  className="text-blue-500 hover:text-blue-400 text-sm"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-red-500 hover:text-red-400 text-sm"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
      )}
    </div>
  );
};

export default Reviews;
