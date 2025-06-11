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
  resetStatus,
} from "../../store/slice/admin";

const AdminPanel = () => {
  const dispatch = useDispatch();
  const {
    games,
    bookings,
    selectedGame,
    newGame,
    status,
  } = useSelector((state) => state.admin);

  useEffect(() => {
    if (
      games.length === 0 &&
      bookings.length === 0 &&
      status.fetch === "idle"
    ) {
      dispatch(fetchAdminData());
    }
  }, [dispatch, games.length, bookings.length, status.fetch]);

  // Clear status messages after success/failure
  useEffect(() => {
    const timers = [];
    Object.keys(status).forEach((key) => {
      if (status[key] === "succeeded" || status[key] === "failed") {
        const timer = setTimeout(() => dispatch(resetStatus(key)), 3000);
        timers.push(timer);
      }
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, [status, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (selectedGame) {
      dispatch(
        adminActions.setSelectedGame({
          ...selectedGame,
          [name]: value,
        })
      );
    } else {
      dispatch(
        adminActions.updateNewGame({
          [name]: value,
        })
      );
    }
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (selectedGame) {
      // Update
      dispatch(updateGame({ gameId: selectedGame._id, gameData: selectedGame }));
    } else {
      // Add new
      dispatch(addGame(newGame));
    }
  };

  const handleEditClick = (game) => {
    dispatch(adminActions.setSelectedGame(game));
  };

  const handleDeleteGame = (gameId) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      dispatch(deleteGame(gameId));
    }
  };

  const handleVerifyBooking = (bookingId, verified) => {
    dispatch(verifyBooking({ bookingId, verified }));
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      dispatch(deleteBooking(bookingId));
    }
  };

  const handleCancelEdit = () => {
    dispatch(adminActions.clearSelectedGame());
  };

  return (
    <div className="admin-panel p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Add/Edit Game Form */}
      <form
        onSubmit={handleAddOrUpdate}
        className="mb-8 border p-4 rounded-md bg-white shadow"
      >
        <h2 className="text-xl font-semibold mb-4">
          {selectedGame ? "Edit Game" : "Add New Game"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={selectedGame ? selectedGame.name : newGame.name}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Type"
            name="type"
            value={selectedGame ? selectedGame.type : newGame.type}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={selectedGame ? selectedGame.price : newGame.price}
            onChange={handleInputChange}
            required
            min="0"
            className="input"
          />
          <input
            type="url"
            placeholder="Image URL"
            name="image_url"
            value={selectedGame ? selectedGame.image_url : newGame.image_url}
            onChange={handleInputChange}
            className="input"
          />
        </div>

        <textarea
          placeholder="Description"
          name="description"
          value={selectedGame ? selectedGame.description : newGame.description}
          onChange={handleInputChange}
          required
          className="input mt-4"
        ></textarea>

        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              status.add === "loading" ||
              status.update === "loading"
            }
          >
            {selectedGame ? "Update Game" : "Add Game"}
          </button>

          {selectedGame && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Games List */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game._id}
              className="border rounded-md p-4 bg-white shadow flex flex-col justify-between"
            >
              <img
                src={game.image_url}
                alt={game.name}
                className="h-40 w-full object-cover rounded"
              />
              <h3 className="text-xl font-bold mt-2">{game.name}</h3>
              <p className="text-gray-600">{game.type}</p>
              <p className="mt-2">{game.description}</p>
              <p className="mt-2 font-semibold">${game.price}</p>
              <div className="mt-4 flex justify-between">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleEditClick(game)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDeleteGame(game._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bookings List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
        {bookings.length === 0 && (
          <p className="text-gray-500">No bookings available.</p>
        )}
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-md p-4 bg-white shadow flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="flex flex-col md:flex-row md:items-center md:gap-6">
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
                  <strong>Status:</strong>{" "}
                  {booking.verified ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Not Verified</span>
                  )}
                </p>
                <p>
                  <strong>Total Price:</strong> ${booking.total_price}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex gap-3">
                {!booking.verified && (
                  <>
                    <button
                      onClick={() => handleVerifyBooking(booking._id, true)}
                      className="btn btn-success btn-sm"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => handleVerifyBooking(booking._id, false)}
                      className="btn btn-warning btn-sm"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteBooking(booking._id)}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
