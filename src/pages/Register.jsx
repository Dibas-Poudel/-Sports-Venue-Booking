import { useState } from "react";
import supabase from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
<<<<<<< HEAD
  const navigate = useNavigate(); // for redirecting to login after registration
=======
  const navigate = useNavigate();
>>>>>>> 1b93fe4 (3/12)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Reset previous message

    // Simple validation
=======
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

>>>>>>> 1b93fe4 (3/12)
    if (!formData.email || !formData.password) {
      setMessage("Please fill in both fields.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
<<<<<<< HEAD
      setMessage(error.message); // Show error message
    } else {
      setMessage("Registration successful! Please check your email for confirmation.");
      // Redirect to login page after successful registration
      setTimeout(() => navigate("/login"), 3000); 
=======
      setMessage(error.message);
    } else {
      const userId = data.user?.id;

      if (userId) {
        const { error: insertError } = await supabase.from("user").insert({
          id: userId,
          email: formData.email,
          role: "user",
        });

        if (insertError) {
          setMessage("Registered but failed inserting user data: " + insertError.message);
        } else {
          setMessage("Registration successful!");
          setTimeout(() => navigate("/login"), 3000);
        }
      }
>>>>>>> 1b93fe4 (3/12)
    }

    setLoading(false);
  };

<<<<<<< HEAD
=======
  // ✅ JSX must be here, outside the function!
>>>>>>> 1b93fe4 (3/12)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {message && (
          <p
            className={`text-sm mb-4 ${
              message.includes("successful") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
