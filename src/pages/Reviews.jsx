import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchReviews, addReview, updateReview, deleteReview, reviewActions } from '../store/slice/review';

const Reviews = ({ venueId, user }) => {
  const dispatch = useDispatch();
  const { items: reviews, loading, currentReview, addStatus, updateStatus, deleteStatus } = useSelector((state) => state.reviews);
  
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (venueId) {
      dispatch(fetchReviews(venueId));
    }
  }, [venueId, dispatch]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      toast.warn('You must be logged in to leave a review.');
      return;
    }

    if (currentReview) {
      dispatch(updateReview({ reviewId: currentReview._id, venueId, rating, comment }));
    } else {
      dispatch(addReview({ venueId, rating, comment }));
    }
  };

  const handleEditReview = (review) => {
    dispatch(reviewActions.setCurrentReview(review));
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview({ reviewId, venueId }));
    }
  };

  if (loading && reviews.length === 0) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-4">Reviews</h3>

      <form onSubmit={handleSubmitReview} className="mb-6 bg-gray-800 p-4 rounded-lg">
        <label className="block mb-2">
          Rating:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full mt-1 p-2 rounded bg-gray-700 text-white" required>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} {r === 1 ? 'star' : 'stars'}</option>
            ))}
          </select>
        </label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full mt-1 p-2 rounded bg-gray-700 text-white" rows={3} required />
        <button type="submit" className="mt-3 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold">{currentReview ? 'Update Review' : 'Add Review'}</button>
      </form>

      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-400">{review.email}</p>
          <p>{review.comment}</p>
          {user?.id === review.userId && (
            <>
            <button onClick={() => handleEditReview(review)}>Edit</button>
            <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Reviews;