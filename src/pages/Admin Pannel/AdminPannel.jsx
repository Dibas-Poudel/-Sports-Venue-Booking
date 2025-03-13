import { useState, useEffect } from 'react';
import supabase from '../../services/supabaseClient';

const AdminPanel = () => {
  const [games, setGames] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newGame, setNewGame] = useState({ name: '', description: '', price: '', image_url: '', type: '' });
  const [selectedGame, setSelectedGame] = useState(null);
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const gamesResult = await supabase.from('sports_venues').select('*');
      if (gamesResult.error) {
        console.error('Error fetching games:', gamesResult.error.message);
      } else {
        setGames(gamesResult.data);
      }

      const bookingsResult = await supabase.from('bookings').select('*');
      if (bookingsResult.error) {
        console.error('Error fetching bookings:', bookingsResult.error.message);
      } else {
        setBookings(bookingsResult.data);
      }

      setLoadingGames(false);
      setLoadingBookings(false);
    };

    fetchData();
  }, []);

  const handleAddGame = async () => {
    const { data, error } = await supabase
      .from('sports_venues')
      .insert([{
        name: newGame.name,
        type: newGame.type,
        description: newGame.description,
        price: parseFloat(newGame.price),
        image_url: newGame.image_url,
      }])
      .select();

    if (error) {
      alert(`Error Adding game: ${error.message}`);
    } else {
      setGames((prevGames) => [...prevGames, ...data]);
      setNewGame({ name: '', type: '', description: '', price: '', image_url: '' });
    }
  };

  const handleUpdateGame = async (gameId) => {
    const { data, error } = await supabase
      .from('sports_venues')
      .update({
        name: selectedGame.name,
        type: selectedGame.type,
        description: selectedGame.description,
        price: parseFloat(selectedGame.price),
        image_url: selectedGame.image_url,
      })
      .eq('id', gameId)
      .select();

    if (error) {
      alert(`Error updating game: ${error.message}`);
    } else {
      setGames((prevGames) =>
        prevGames.map((game) => (game.id === gameId ? data[0] : game))
      );
      setSelectedGame(null);
    }
  };

  const handleDeleteGame = async (gameId) => {
    const { error } = await supabase.from('sports_venues').delete().eq('id', gameId);
    if (error) {
      alert(`Error deleting game: ${error.message}`);
    } else {
      setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
    }
  };

  const handleVerifyBooking = async (bookingId) => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ verified: true })
      .eq('booking_id', bookingId)
      .select();

    if (error) {
      alert(`Error verifying booking: ${error.message}`);
    } else {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.booking_id === bookingId ? data[0] : booking
        )
      );
    }
  };

  if (loadingGames || loadingBookings) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="admin-panel p-6 bg-gray-700 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Add Game Form */}
      <div className="add-game-form mb-8 bg-gray-500 p-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Add New Game</h2>
        <input type="text" placeholder="Game Name" value={newGame.name} onChange={(e) => setNewGame({ ...newGame, name: e.target.value })} className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black" />
        <select value={newGame.type} onChange={(e) => setNewGame({ ...newGame, type: e.target.value })} className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black">
          <option value="">Select Type</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
          <option value="PlayStation">PlayStation</option>
        </select>
        <textarea placeholder="Game Description" value={newGame.description} onChange={(e) => setNewGame({ ...newGame, description: e.target.value })} className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black" />
        <input type="number" placeholder="Game Price" value={newGame.price} onChange={(e) => setNewGame({ ...newGame, price: e.target.value })} className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black" />
        <input type="text" placeholder="Image URL" value={newGame.image_url} onChange={(e) => setNewGame({ ...newGame, image_url: e.target.value })} className="mb-4 border border-gray-300 p-2 w-full rounded-md text-black" />
        <button onClick={handleAddGame} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Add Game</button>
      </div>

      {/* Display Games */}
      <h2 className="text-2xl font-semibold mb-4">Manage Games</h2>
      <div className="game-list mb-8">
        {Array.isArray(games) && games.map((game) => (
          <div key={game.id} className="bg-gray-800 p-4 mb-4 rounded-md shadow-sm">
            <h3 className="font-semibold text-lg">{game.name}</h3>
            <p><strong>Type:</strong> {game.type}</p>
            <p><strong>Description:</strong> {game.description}</p>
            <p><strong>Price:</strong> Rs.{game.price}</p>
            <div className="mt-4 flex space-x-4">
              <button onClick={() => setSelectedGame(game)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md">Edit</button>
              <button onClick={() => handleDeleteGame(game.id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Selected Game */}
      {selectedGame && (
        <div className="edit-game-form mb-8 bg-gray-800 p-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Edit Game</h2>
          <input type="text" value={selectedGame.name} onChange={(e) => setSelectedGame({ ...selectedGame, name: e.target.value })} className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black" />
          <select value={selectedGame.type} onChange={(e) => setSelectedGame({ ...selectedGame, type: e.target.value })} className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black">
            <option value="">Select Type</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
            <option value="PlayStation">PlayStation</option>
          </select>
          <textarea value={selectedGame.description} onChange={(e) => setSelectedGame({ ...selectedGame, description: e.target.value })} className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black" />
          <input type="number" value={selectedGame.price} onChange={(e) => setSelectedGame({ ...selectedGame, price: e.target.value })} className="mb-2 border border-gray-300 p-2 w-full rounded-md text-black" />
          <input type="text" value={selectedGame.image_url} onChange={(e) => setSelectedGame({ ...selectedGame, image_url: e.target.value })} className="mb-4 border border-gray-300 p-2 w-full rounded-md text-black" />
          <button onClick={() => handleUpdateGame(selectedGame.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">Update Game</button>
        </div>
      )}

      {/* Manage Bookings */}
      <h2 className="text-2xl font-semibold mb-4">Manage Bookings</h2>
      <div className="booking-list">
        {Array.isArray(bookings) && bookings.map((booking) => (
          <div key={booking.booking_id} className="bg-gray-800 p-4 mb-4 rounded-md shadow-sm">
            <p><strong>User ID:</strong> {booking.user_id}</p>
            <p><strong>Name:</strong> {booking.name}</p>
            <p><strong>Venue:</strong> {booking.venue_name}</p>
            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {booking.time}</p>
            <p><strong>Status:</strong> {booking.verified ? 'Verified' : 'Pending'}</p>
            {!booking.verified && (
              <button onClick={() => handleVerifyBooking(booking.booking_id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mt-2">Verify Booking</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
