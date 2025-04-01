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
import RevenueAnalytics from "./Chart";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { games, bookings, selectedGame, newGame, status } =
    useSelector((state) => state.admin);

  useEffect(() => {
    if (
      games.length === 0 &&
      bookings.length === 0 &&
      status.fetch === "idle"
    ) {
      dispatch(fetchAdminData());
    }
  }, [dispatch, games.length, bookings.length, status.fetch]);

  // Status reset effect
  useEffect(() => {
    const timers = [];

    Object.keys(status).forEach((action) => {
      if (status[action] === "succeeded" || status[action] === "failed") {
        const timer = setTimeout(() => {
          dispatch(adminActions.resetStatus(action));
        }, 1000);
        timers.push(timer);
      }
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [status, dispatch]);

  const handleAddGame = () => {
    dispatch(
      addGame({
        ...newGame,
        price: parseFloat(newGame.price),
      })
    );
  };

  const handleUpdateGame = () => {
    if (selectedGame) {
      dispatch(
        updateGame({
          gameId: selectedGame.id,
          gameData: {
            ...selectedGame,
            price: parseFloat(selectedGame.price),
          },
        })
      );
    }
  };

  const handleDeleteGame = (gameId, gameType) => {
    dispatch(deleteGame(gameId, gameType));
  };

  const handleVerifyBooking = (bookingId, currentStatus) => {
    dispatch(
      verifyBooking({
        bookingId,
        verified: !currentStatus,
      })
    );
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      dispatch(deleteBooking(bookingId));
    }
  };

  const handleRefreshData = () => {
    dispatch(fetchAdminData());
  };

  const isProcessing =
    status.add === "loading" ||
    status.update === "loading" ||
    status.delete === "loading" ||
    status.bookingDelete === "loading" ||
    status.verify === "loading";

  return (
    <div className="admin-panel p-6 bg-gray-700 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleRefreshData}
          disabled={status.fetch === "loading"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {status.fetch === "loading" ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      {/* Add Game Form */}
      <div className="add-game-form mb-8 bg-gray-500 p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Add New Game</h2>
        <input
          type="text"
          placeholder="Game Name"
          value={newGame.name}
          onChange={(e) =>
            dispatch(adminActions.updateNewGame({ name: e.target.value }))
          }
          className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
          disabled={isProcessing}
        />
        <select
          value={newGame.type}
          onChange={(e) =>
            dispatch(adminActions.updateNewGame({ type: e.target.value }))
          }
          className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
          disabled={isProcessing}
        >
          <option value="">Select Type</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
          <option value="PlayStation">PlayStation</option>
        </select>
        <textarea
          placeholder="Game Description"
          value={newGame.description}
          onChange={(e) =>
            dispatch(
              adminActions.updateNewGame({ description: e.target.value })
            )
          }
          className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
          disabled={isProcessing}
        />
        <input
          type="number"
          placeholder="Game Price"
          value={newGame.price}
          onChange={(e) =>
            dispatch(adminActions.updateNewGame({ price: e.target.value }))
          }
          className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
          disabled={isProcessing}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newGame.image_url}
          onChange={(e) =>
            dispatch(adminActions.updateNewGame({ image_url: e.target.value }))
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
      </div>

      {/* Display Games */}
      <h2 className="text-2xl font-semibold mb-4">Manage Games</h2>
      <div className="game-list mb-8">
        {games.map((game) => (
          <div
            key={game.id}
            className="bg-gray-800 p-4 mb-4 rounded-md shadow-sm"
          >
            <h3 className="font-semibold text-lg">{game.name}</h3>
            <p>
              <strong>Type:</strong> {game.type}
            </p>
            <p>
              <strong>Description:</strong> {game.description}
            </p>
            <p>
              <strong>Price:</strong> Rs.{game.price}
            </p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => dispatch(adminActions.setSelectedGame(game))}
                disabled={isProcessing}
                className={`bg-yellow-500 text-white px-4 py-2 rounded-md ${
                  isProcessing
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-yellow-600"
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
        ))}
      </div>

      {/* Edit Selected Game */}
      {selectedGame && (
        <div className="edit-game-form mb-8 bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Edit Game</h2>
          <input
            type="text"
            value={selectedGame.name}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({
                  ...selectedGame,
                  name: e.target.value,
                })
              )
            }
            className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
          />
          <select
            value={selectedGame.type}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({
                  ...selectedGame,
                  type: e.target.value,
                })
              )
            }
            className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
          >
            <option value="">Select Type</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="PlayStation">PlayStation</option>
          </select>
          <textarea
            value={selectedGame.description}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({
                  ...selectedGame,
                  description: e.target.value,
                })
              )
            }
            className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
          />
          <input
            type="number"
            value={selectedGame.price}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({
                  ...selectedGame,
                  price: e.target.value,
                })
              )
            }
            className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
          />
          <input
            type="text"
            value={selectedGame.image_url}
            onChange={(e) =>
              dispatch(
                adminActions.setSelectedGame({
                  ...selectedGame,
                  image_url: e.target.value,
                })
              )
            }
            className="mb-4 border border-gray-300 p-2 w-full rounded-md text-black"
            disabled={isProcessing}
          />
          <div className="flex space-x-4">
            <button
              onClick={handleUpdateGame}
              disabled={isProcessing}
              className={`bg-green-600 text-white px-4 py-2 rounded-md ${
                isProcessing
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
            >
              {status.update === "loading" ? "Updating..." : "Update Game"}
            </button>
            <button
              onClick={() => dispatch(adminActions.clearSelectedGame())}
              disabled={isProcessing}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Manage Bookings */}
      <h2 className="text-2xl font-semibold mb-4">Manage Bookings</h2>
      <div className="booking-list">
        {bookings.map((booking) => (
          <div
            key={booking.booking_id}
            className="bg-gray-800 p-4 mb-4 rounded-md shadow-sm"
          >
            <p>
              <strong>User ID:</strong> {booking.user_id}
            </p>
            <p>
              <strong>Name:</strong> {booking.name}
            </p>
            <p>
              <strong>Venue:</strong> {booking.venue_name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(booking.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {booking.time}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {booking.verified ? "Verified" : "Pending"}
            </p>
            <div className="mt-2">
              <button
                onClick={() =>
                  handleVerifyBooking(booking.booking_id, booking.verified)
                }
                disabled={isProcessing}
                className={`${
                  booking.verified
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-2 rounded-md ${
                  isProcessing ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {status.verify === "loading"
                  ? "Processing..."
                  : booking.verified
                  ? "Unverify Booking"
                  : "Verify Booking"}
              </button>
              <button
                onClick={() => handleDeleteBooking(booking.booking_id)}
                disabled={isProcessing}
                className={`bg-red-600 text-white px-4 py-2 rounded-md ml-2 ${
                  isProcessing
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-red-700"
                }`}
              >
                {status.bookingDelete === "loading" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics */}
      <RevenueAnalytics />
    </div>
  );
};

export default AdminPanel;
