import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminData, addGame, updateGame, deleteGame, deleteBooking,
  verifyBooking, updateNewGame, setSelectedGame, resetStatus
} from "../../store/slice/admin";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { games, bookings, selectedGame, newGame, status } = useSelector(state => state.admin);

useEffect(() => {
  if (status.fetch === "idle" && games.length === 0 && bookings.length === 0) {
    dispatch(fetchAdminData());
  }
}, [dispatch, status.fetch, games.length, bookings.length]);

  useEffect(() => {
    const timers = Object.entries(status)
      .filter(([, value]) => value === "succeeded" || value === "failed")
      .map(([key]) => setTimeout(() => dispatch(resetStatus(key)), 1500));
    return () => timers.forEach(clearTimeout);
  }, [status, dispatch]);

  const isProcessing = Object.values(status).includes("loading");
  const canAddGame = newGame.name?.trim() && newGame.type?.trim() && newGame.imageUrl?.trim() && !isProcessing;

 const handleAddGame = (e) => {
    e.preventDefault();
    if (!canAddGame) return;
    dispatch(addGame({ ...newGame, price: parseFloat(newGame.price) || 0 }));
  };

const handleUpdateGame = (e) => {
  e.preventDefault();
  if (!selectedGame || !selectedGame._id) return; 
  dispatch(updateGame({
    gameId: selectedGame._id,
    gameData: { ...selectedGame, price: parseFloat(selectedGame.price) || 0 }
  }));
};

  const handleDeleteGame = (gameId) => {
    dispatch(deleteGame(gameId));
  };

  const handleVerifyBooking = (bookingId, verified) => {
    dispatch(verifyBooking({ bookingId, verified: !verified }));
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      dispatch(deleteBooking(bookingId));
    }
  };


  return (
    <div className="admin-panel p-6 bg-gray-700 min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={() => dispatch(fetchAdminData())}
          disabled={status.fetch === "loading"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-70"
        >
          {status.fetch === "loading" ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
{/* Add Game */}
<section className="add-game-form mb-8 bg-gray-500 p-4 rounded-lg shadow-sm">
  <h2 className="text-2xl font-semibold mb-4">Add New Game</h2>

  <input
    type="text"
    placeholder="Game Name"
    value={newGame.name || ""}
    onChange={(e) => dispatch(updateNewGame({ name: e.target.value }))}
    className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
    disabled={isProcessing}
  />
  <select
    value={newGame.type || ""}
    onChange={(e) => dispatch(updateNewGame({ type: e.target.value }))}
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
    onChange={(e) => dispatch(updateNewGame({ description: e.target.value }))}
    className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
    disabled={isProcessing}
  />
  <input
    type="number"
    placeholder="Game Price"
    value={newGame.price !== undefined ? newGame.price : ""}
    onChange={(e) => dispatch(updateNewGame({ price: e.target.value }))}
    className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
    disabled={isProcessing}
    min="0"
    step="0.01"
  />
  <input
    type="text"
    placeholder="Image URL"
    value={newGame.imageUrl || ""}
    onChange={(e) => dispatch(updateNewGame({ imageUrl: e.target.value }))}
    className="mb-4 border border-gray-300 p-2 w-full rounded-md text-black"
    disabled={isProcessing}
  />
  <button
    onClick={handleAddGame}
    disabled={!canAddGame}
    className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
      !canAddGame ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
    }`}
  >
    {status.add === "loading" ? "Adding..." : "Add Game"}
  </button>
</section>

        {/* Edit Game */}
        {selectedGame && (
          <section className="edit-game-form mb-8 bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Edit Game</h2>

            <input
              type="text"
              value={selectedGame.name || ""}
              onChange={(e) =>
                dispatch(setSelectedGame({ ...selectedGame, name: e.target.value }))
              }
              className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black"
              disabled={isProcessing}
            />
            <button
              onClick={handleUpdateGame} 
              disabled={isProcessing}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {status.update === "loading" ? "Updating..." : "Update Game"}
            </button>
          </section>
        )}
      {/* Manage Games */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Manage Games</h2>
        {games?.length > 0 ? (
          games.map((game) => (
            <div key={game._id} className="bg-gray-800 p-4 mb-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg">{game.name || "Unnamed"}</h3>
              <p><strong>Type:</strong> {game.type || "N/A"}</p>
              <p><strong>Description:</strong> {game.description || "No description"}</p>
              <p><strong>Price:</strong> Rs.{game.price ?? "N/A"}</p>
              <div className="mt-4 flex space-x-4">
                <button onClick={() => dispatch(setSelectedGame(game))}>Edit</button>
                <button onClick={() => handleDeleteGame(game._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No games available.</p>
        )}
      </section>

      {/* Bookings Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
        {bookings?.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-gray-800 p-4 mb-4 rounded-md shadow-sm">
              <p><strong>User:</strong> {booking.userId?.name || "Unknown"}</p>
              <p><strong>Venue:</strong> {booking.venue_name}</p>
              <p><strong>Status:</strong> {booking.verified ? "Verified" : "Not Verified"}</p>
              <div className="flex space-x-2">
                <button onClick={() => handleVerifyBooking(booking._id, booking.verified)}>
                  {booking.verified ? "Unverify" : "Verify"}
                </button>
                <button onClick={() => handleDeleteBooking(booking._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No bookings available.</p>
        )}
      </section>
    </div>
  );
};

export default AdminPanel;