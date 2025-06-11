import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAdminData,
  addGame,
  updateGame,
  deleteGame,
  verifyBooking,
  deleteBooking,
  setSelectedGame,
  resetStatus,
  updateNewGame,
} from "../../store/slice/admin.js"; 
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const {
    games,
    bookings,
    status,
    error,
    selectedGame,
    newGame,
  } = useSelector((state) => state.admin);

  // Local state to control Add/Edit form visibility
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminData());
  }, [dispatch]);

  // Handle input change for Add/Edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateNewGame({ [name]: value }));
  };

  // Open Add Game form
  const openAddForm = () => {
    dispatch(setSelectedGame(null));
    dispatch(updateNewGame({ name: "", type: "", description: "", price: "", imageUrl: "" }));
    setShowForm(true);
  };

  // Open Edit Game form with pre-filled data
  const openEditForm = (game) => {
    dispatch(setSelectedGame(game));
    dispatch(updateNewGame({
      name: game.name,
      type: game.type,
      description: game.description,
      price: game.price,
      imageUrl: game.imageUrl,
    }));
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    dispatch(setSelectedGame(null));
    dispatch(resetStatus("add"));
    dispatch(resetStatus("update"));
  };

  // Submit Add or Edit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !newGame.name.trim() ||
      !newGame.type.trim() ||
      !newGame.description.trim() ||
      !newGame.price ||
      !newGame.imageUrl.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    if (selectedGame) {
      // Update existing game
      dispatch(updateGame({ gameId: selectedGame._id, gameData: newGame })).then((res) => {
        if (res.type.endsWith("fulfilled")) {
          closeForm();
        }
      });
    } else {
      // Add new game
      dispatch(addGame(newGame)).then((res) => {
        if (res.type.endsWith("fulfilled")) {
          closeForm();
        }
      });
    }
  };

  // Delete game
  const handleDeleteGame = (gameId) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      dispatch(deleteGame(gameId));
    }
  };

  // Verify or reject booking
  const handleVerifyBooking = (bookingId, verified) => {
    dispatch(verifyBooking({ bookingId, verified }));
  };

  // Delete booking
  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      dispatch(deleteBooking(bookingId));
    }
  };

  return (
    <div className="admin-dashboard container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Loading and Error States */}
      {(status.fetch === "loading") && <p>Loading data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Games Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Games</h2>
          <button
            onClick={openAddForm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Game
          </button>
        </div>

        {games.length === 0 && <p>No games found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <div key={game._id} className="border p-4 rounded shadow">
              <img
                src={game.imageUrl}
                alt={game.name}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-xl font-bold">{game.name}</h3>
              <p className="text-gray-700">{game.type}</p>
              <p className="mt-2">{game.description}</p>
              <p className="mt-1 font-semibold">Price: ${game.price}</p>

              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => openEditForm(game)}
                  className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGame(game._id)}
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add/Edit Game Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-lg w-full max-w-lg"
          >
            <h2 className="text-2xl font-bold mb-4">
              {selectedGame ? "Edit Game" : "Add New Game"}
            </h2>

            <div className="mb-3">
              <label className="block font-semibold mb-1" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={newGame.name}
                onChange={handleInputChange}
                className="border w-full px-3 py-2 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1" htmlFor="type">
                Type
              </label>
              <input
                type="text"
                name="type"
                id="type"
                value={newGame.type}
                onChange={handleInputChange}
                className="border w-full px-3 py-2 rounded"
              />
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={newGame.description}
                onChange={handleInputChange}
                className="border w-full px-3 py-2 rounded"
                rows={3}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1" htmlFor="price">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={newGame.price}
                onChange={handleInputChange}
                className="border w-full px-3 py-2 rounded"
                min="0"
              />
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1" htmlFor="imageUrl">
                Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                value={newGame.imageUrl}
                onChange={handleInputChange}
                className="border w-full px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded text-white ${
                  selectedGame ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={status.add === "loading" || status.update === "loading"}
              >
                {selectedGame
                  ? status.update === "loading"
                    ? "Updating..."
                    : "Update Game"
                  : status.add === "loading"
                  ? "Adding..."
                  : "Add Game"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bookings Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
        {bookings.length === 0 && <p>No bookings found.</p>}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Venue</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Time</th>
                <th className="border p-2">Verified</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="text-center">
                  <td className="border p-2">{booking.name}</td>
                  <td className="border p-2">{booking.venue_name}</td>
                  <td className="border p-2">{new Date(booking.date).toLocaleDateString()}</td>
                  <td className="border p-2">{booking.time}</td>
                  <td className="border p-2">
                    {booking.verified ? (
                      <span className="text-green-600 font-semibold">Verified</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Not Verified</span>
                    )}
                  </td>
                  <td className="border p-2 space-x-2">
                    {!booking.verified && (
                      <button
                        onClick={() => handleVerifyBooking(booking._id, true)}
                        className="bg-green-600 px-2 py-1 rounded text-white hover:bg-green-700"
                      >
                        Verify
                      </button>
                    )}
                    {booking.verified && (
                      <button
                        onClick={() => handleVerifyBooking(booking._id, false)}
                        className="bg-yellow-500 px-2 py-1 rounded text-white hover:bg-yellow-600"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="bg-red-600 px-2 py-1 rounded text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
