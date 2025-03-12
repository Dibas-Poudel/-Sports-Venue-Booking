import { useEffect, useState } from "react";
import fetchUserProfile from "../../services/fetchUserProfile"; // Adjust the import path

const UserProfile = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const data = await fetchUserProfile(userId);
        setProfile(data); // Set the user profile data in state
      } catch (err) {
        setError(err.message); // Set error message if there's an error
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getProfile();
    }
  }, [userId]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h1>{profile?.name}</h1>
      <p>{profile?.email}</p>
      <p>Role: {profile?.role}</p>
    </div>
  );
};

export default UserProfile;
