import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserBookings from "./UserBooking";

const Dashboard = () => {
  const user = useSelector((state) => state.user.profile); 
  const navigate = useNavigate();

  if (!user) {
    return <p className="text-center text-lg">Please log in to view your dashboard.</p>;
  }

  const handleBookNow = () => {
    navigate(`/games`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
      <p className="text-lg">Hello, {user?.email}</p>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Book a Venue</h2>
          <p className="text-sm text-gray-600">Start booking your favorite sports venue now.</p>
          <button
            onClick={handleBookNow}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Book Now
          </button>
        </div>
      </div>

      <UserBookings />
    </div>
  );
};

export default Dashboard;
