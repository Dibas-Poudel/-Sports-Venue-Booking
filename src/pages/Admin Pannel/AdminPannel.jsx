import { useState, useEffect } from 'react';
import supabase from '../../services/supabaseClient';

const AdminPanel = () => {
  const [games, setGames] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newGame, setNewGame] = useState({ name: '', description: '', price: '', image_url: '',type:"" });
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    fetchGames();
    fetchBookings();
  }, []);

  const fetchGames = async () => {
    const { data, error } = await supabase.from('sports_venues').select('*');
    if (error) {
      console.error('Error fetching games:', error.message);
    } else {
      console.log(data); // Check the structure of the response
      setGames(data);  // Ensure it's an array
    }
  };
  

  const fetchBookings = async () => {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) {
      console.error('Error fetching bookings:', error.message);
    } else {
      setBookings(data);
    }
  };

  const handleAddGame = async () => {
    const { data, error } = await supabase.from('sports_venues').insert([{
      name: newGame.name,
      type: newGame.type,
      description: newGame.description,
      price: parseFloat(newGame.price),
      image_url: newGame.image_url,
    }]);
    if (error) {
      console.error('Error adding game:', error.message);
    } else {
      console.log('Game added:', data);  // Check if data is correctly returned
      setGames((prevGames) => [...prevGames, ...data]);
      setNewGame({ type: '', description: '', price: '', image_url: '' });
    }
  };
  

  // Update an existing game
  const handleUpdateGame = async (gameId) => {
    const { data, error } = await supabase
      .from('sports_venue')
      .update({
        name:selectedGame.name,
        type: selectedGame.type,
        description: selectedGame.description,
        price: parseFloat(selectedGame.price),
        image_url: selectedGame.image_url,
      })
      .eq('id', gameId);
    if (error) {
      console.error('Error updating game:', error.message);
    } else {
      setGames((prevGames) => prevGames.map((game) => (game.id === gameId ? data[0] : game)));
      setSelectedGame(null); // Reset selected game
    }
  };

  // Delete a game
  const handleDeleteGame = async (gameId) => {
    const { data, error } = await supabase.from('sports_venuw').delete().eq('id', gameId);
    if (error) {
      console.error('Error deleting game:', error.message);
    } else {
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    }
  };

  // Verify a booking
  const handleVerifyBooking = async (bookingId) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ verified: true })
      .eq('id', bookingId);
    if (error) {
      console.error('Error verifying booking:', error.message);
    } else {
      setBookings((prevBookings) => prevBookings.map((booking) => (booking.id === bookingId ? data[0] : booking)));
    }
  };

  return (
    <div className="admin-panel">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

      {/* Add Game Form */}
      <div className="add-game-form mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Game</h2>
        <input
          type="text"
          placeholder="Game Name"
          value={newGame.name}
          onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
          className="input-field mb-2"
        />
        <input
          type="text"
          placeholder="Game Type"
          value={newGame.type}
          onChange={(e) => setNewGame({ ...newGame, type: e.target.value })}
          className="input-field mb-2"
        />
        <textarea
          placeholder="Game Description"
          value={newGame.description}
          onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
          className="input-field mb-2"
        />
        <input
          type="number"
          placeholder="Game Price"
          value={newGame.price}
          onChange={(e) => setNewGame({ ...newGame, price: e.target.value })}
          className="input-field mb-2"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newGame.image_url}
          onChange={(e) => setNewGame({ ...newGame, image_url: e.target.value })}
          className="input-field mb-4"
        />
        <button
          onClick={handleAddGame}
          className="bg-blue-500 text-white p-2 rounded-md"
        >
          Add Game
        </button>
      </div>

      {/* Display Games */}
      <h2 className="text-2xl font-semibold mb-4">Manage Games</h2>
      <div className="game-list mb-8">
        {games.map((game) => (
          <div key={game.id} className="game-item border p-4 mb-4 rounded-md">
            <h3 className="font-semibold">{game.type}</h3>
            <p>{game.description}</p>
            <p>Price: ${game.price}</p>
            <div className="game-actions mt-4 flex space-x-4">
              <button
                onClick={() => setSelectedGame(game)}
                className="bg-yellow-500 text-white p-2 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteGame(game.id)}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Selected Game */}
      {selectedGame && (
        <div className="edit-game-form mb-8">
          <h2 className="text-2xl font-semibold mb-4">Edit Game</h2>
          <input
            type="text"
            value={selectedGame.type}
            onChange={(e) => setSelectedGame({ ...selectedGame, type: e.target.value })}
            className="input-field mb-2"
          />
          <textarea
            value={selectedGame.description}
            onChange={(e) => setSelectedGame({ ...selectedGame, description: e.target.value })}
            className="input-field mb-2"
          />
          <input
            type="number"
            value={selectedGame.price}
            onChange={(e) => setSelectedGame({ ...selectedGame, price: e.target.value })}
            className="input-field mb-2"
          />
          <input
            type="text"
            value={selectedGame.image_url}
            onChange={(e) => setSelectedGame({ ...selectedGame, image_url: e.target.value })}
            className="input-field mb-4"
          />
          <button
            onClick={() => handleUpdateGame(selectedGame.id)}
            className="bg-green-500 text-white p-2 rounded-md"
          >
            Update Game
          </button>
        </div>
      )}

      {/* Manage Bookings */}
      <h2 className="text-2xl font-semibold mb-4">Manage Bookings</h2>
      <div className="booking-list">
        {bookings.map((booking) => (
          <div key={booking.id} className="booking-item border p-4 mb-4 rounded-md">
            <p>
              <strong>User ID:</strong> {booking.user_id}
            </p>
            <p>
              <strong>Game ID:</strong> {booking.game_id}
            </p>
            <p>
              <strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleString()}
            </p>
            <p>
              <strong>Verified:</strong> {booking.verified ? 'Yes' : 'No'}
            </p>
            {!booking.verified && (
              <button
                onClick={() => handleVerifyBooking(booking.id)}
                className="bg-blue-500 text-white p-2 rounded-md mt-4"
              >
                Verify Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
