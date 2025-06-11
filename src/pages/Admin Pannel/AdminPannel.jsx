import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminData,
  addGame,
  updateGame,
  deleteGame,
  deleteBooking,
  verifyBooking,
  adminActions,
} from "../../store/slice/admin";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { games, bookings, selectedGame, newGame, status } = useSelector(
    (state) => state.admin
  );

  // Fetch initial admin data if empty and idle
  useEffect(() => {
    if (
      games.length === 0 &&
      bookings.length === 0 &&
      status.fetch === "idle"
    ) {
      dispatch(fetchAdminData());
    }
  }, [dispatch, games.length, bookings.length, status.fetch]);

  // Reset status after success or failure to clear UI state
  useEffect(() => {
    const timers = Object.entries(status)
      .filter(([, value]) => value === "succeeded" || value === "failed")
      .map(([key]) =>
        setTimeout(() => dispatch(adminActions.resetStatus(key)), 1000)
      );

    return () => timers.forEach(clearTimeout);
  }, [status, dispatch]);

  // Check if any action is loading to disable inputs/buttons
  const isProcessing = [
    status.add,
    status.update,
    status.delete,
    status.bookingDelete,
    status.verify,
  ].some((s) => s === "loading");

  // Handlers
  const handleAddGame = () => {
    dispatch(
      addGame({
        ...newGame,
        price: parseFloat(newGame.price) || 0,
      })
    );
  };

  const handleUpdateGame = () => {
    if (!selectedGame) return;
    dispatch(
      updateGame({
        gameId: selectedGame.id,
        gameData: {
          ...selectedGame,
          price: parseFloat(selectedGame.price) || 0,
        },
      })
    );
  };

  const handleDeleteGame = (gameId, gameType) => {
    dispatch(deleteGame({ gameId, gameType }));
  };

  const handleVerifyBooking = (bookingId, currentStatus) => {
    dispatch(verifyBooking({ bookingId, verified: !currentStatus }));
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      dispatch(deleteBooking(bookingId));
    }
  };

  const handleRefreshData = () => {
    dispatch(fetchAdminData());
  };

  return (
    <div className="admin-panel p-6 bg-gray-700 min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleRefreshData}
          disabled={status.fetch === "loading"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-70"
        >
          {status.fetch === "loading" ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Add Game Form */}
      <section className="add-game-form mb-8 bg-gray-500 p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Add New Game</h2>

        <input
          type="text"
          placeholder="Game Name"
          value={newGame.name || ""}
          onChange={(e) =>
            dispatch(adminActions.updateNewGame({ name: e.target.value }))
          }
          className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
          disabled={isProcessing}
        />
        <select
          value={newGame.type || ""}
          onChange={(e) =>
            dispatch(adminActions.updateNewGame({ type: e.target.value }))
          }
          className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
          disabled={isProcessing}
        >
          <option value="">Select Type</option>
          <option value="INDOOR">INDOOR</option>
          <option value="OUTDOOR">OUTDOOR</option>
          <option value="PLAYSTATION">PLAYSTATION</option>
        </select>
        <textarea
          placeholder="Game Description"
          value={newGame.description || ""}
          onChange={(e) =>
            dispatch(adminActions.updateNewGame({ description: e.target.value }))
          }
          className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
          disabled={isProcessing}
        />
        <input
          type="number"
          placeholder="Game Price"
          value={newGame.price || ""}
          onChange={(e) =>
            dispatch(adminActions.updateNewGame({ price: e.target.value }))
          }
          className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
          disabled={isProcessing}
          min="0"
          step="0.01"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newGame.imageUrl || ""}
          onChange={(e) =>
            dispatch(adminActions.updateNewGame({ imageUrl: e.target.value }))
          }
          className="mb-4 border border-gray-300 p-2 w-full rounded-md text-black"
          disabled={isProcessing}
        />
        <button
          onClick={handleAddGame}
          disabled={isProcessing || !newGame.name || !newGame.type}
          className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
            isProcessing || !newGame.name || !newGame.type
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          {status.add === "loading" ? "Adding..." : "Add Game"}
        </button>
      </section>

      {/* Manage Games */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Manage Games</h2>
        {games.length === 0 ? (
          <p>No games available.</p>
        ) : (
          games.map((game) => (
            <div
              key={game.id}
              className="bg-gray-800 p-4 mb-4 rounded-md shadow-sm"
            >
              <h3 className="font-semibold text-lg">{game.name || "Unnamed"}</h3>
              <p>
                <strong>Type:</strong> {game.type || "N/A"}
              </p>
              <p>
                <strong>Description:</strong> {game.description || "No description"}
              </p>
              <p>
                <strong>Price:</strong> Rs.{game.price ?? "N/A"}
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => dispatch(adminActions.setSelectedGame(game))}
                  disabled={isProcessing}
                  className={`bg-yellow-500 text-white px-4 py-2 rounded-md ${
                    isProcessing ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-600"
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGame(game.id, game.type)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Edit Game Form */}
      {selectedGame && (
        <section className="edit-game-form mb-8 bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Edit Game</h2>

          <input
            type="text"
            value={selectedGame.name || ""}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({ ...selectedGame, name: e.target.value })
              )
            }
            className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
          />
          <select
            value={selectedGame.type || ""}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({ ...selectedGame, type: e.target.value })
              )
            }
            className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
          >
            <option value="">Select Type</option>
            <option value="INDOOR">INDOOR</option>
            <option value="OUTDOOR">OUTDOOR</option>
            <option value="PLAYSTATION">PLAYSTATION</option>
          </select>
          <textarea
            value={selectedGame.description || ""}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({ ...selectedGame, description: e.target.value })
              )
            }
            className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
          />
          <input
            type="number"
            value={selectedGame.price ?? ""}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({ ...selectedGame, price: e.target.value })
              )
            }
            className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
            min="0"
            step="0.01"
          />
          <input
            type="text"
            value={selectedGame.imageUrl || ""}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({ ...selectedGame, imageUrl: e.target.value })
              )
            }
            className="mb-4 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
          />
          <button
            onClick={handleUpdateGame}
            disabled={isProcessing}
            className={`bg-green-600 text-white px-4 py-2 rounded-md ${
              isProcessing ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
            }`}
          >
            {status.update === "loading" ? "Updating..." : "Update Game"}
          </button>
        </section>
      )}

      {/* Bookings Management */}
      <section className="bookings-management bg-gray-600 p-4 rounded-md shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings available.</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-gray-700 p-4 mb-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="mb-2 md:mb-0">
                <p>
                  <strong>Name:</strong> {booking.name}
                </p>
                <p>
                  <strong>Venue:</strong> {booking.venue_name}
                </p>
                <p>
                  <strong>Date:</strong> {booking.date}
                </p>
                <p>
                  <strong>Time:</strong> {booking.time}
                </p>
                <p>
                  <strong>Total Price:</strong> Rs.{booking.total_price ?? "N/A"}
                </p>
                <p>
                  <strong>Verified:</strong>{" "}
                  {booking.verified ? (
                    <span className="text-green-400 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-400 font-semibold">No</span>
                  )}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleVerifyBooking(booking.id, booking.verified)}
                  disabled={status.verify === "loading"}
                  className={`px-3 py-1 rounded ${
                    booking.verified
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } disabled:opacity-70`}
                >
                  {status.verify === "loading"
                    ? "Processing..."
                    : booking.verified
                    ? "Unverify"
                    : "Verify"}
                </button>
                <button
                  onClick={() => handleDeleteBooking(booking.id)}
                  disabled={status.bookingDelete === "loading"}
                  className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-70 hover:bg-red-700"
                >
                  {status.bookingDelete === "loading" ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default AdminPanel;
