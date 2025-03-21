import React, { useEffect, useState } from 'react';
import supabase from '../services/supabaseClient';

const Reviews = ({ venueId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);

  // Fetch Reviews
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false });

    if (!error) setReviews(data);
  };

  useEffect(() => {
    if (venueId) fetchReviews();
  }, [venueId]);

  // Submit Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('You must be logged in to add a review');

    if (editingReviewId) {
      // Update review
      const { error } = await supabase
        .from('reviews')
        .update({ rating, comment })
        .eq('id', editingReviewId);

      if (!error) {
        setEditingReviewId(null);
        setRating(1);
        setComment('');
        fetchReviews();
      }
    } else {
      // Create new review
      const { error } = await supabase.from('reviews').insert([
        {
          venue_id: venueId,
          user_id: user.id,
          email: user.email,
          rating,
          comment,
        },
      ]);

      if (!error) {
        setRating(1);
        setComment('');
        fetchReviews();
      }
    }
  };

  // Delete Review
  const handleDeleteReview = async (reviewId) => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (!error) fetchReviews();
  };

  // Edit Review
  const handleEditReview = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReviewId(review.id);
  };

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold mb-4">Reviews</h3>

      {/* Add/Edit Review Form */}
      <form onSubmit={handleSubmitReview} className="mb-6 bg-gray-800 p-4 rounded-lg">
        <label className="block mb-2">
          Rating:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
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
          />
        </label>

        <button
          type="submit"
          className="mt-3 bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold"
        >
          {editingReviewId ? 'Update Review' : 'Add Review'}
        </button>
      </form>

      {/* Display Reviews */}
      {reviews.length === 0 ? (
        <p className="text-gray-400">No reviews yet.</p>
      ) : (
        reviews.map((rev) => (
          <div key={rev.id} className="bg-gray-800 p-4 rounded-lg mb-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">{rev.email}</p>
                <p className="text-yellow-400 font-semibold">Rating: {rev.rating}/5</p>
                <p>{rev.comment}</p>
              </div>
              {user?.id === rev.user_id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditReview(rev)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;
