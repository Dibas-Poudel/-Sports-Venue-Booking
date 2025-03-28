import { useState } from "react";
import supabase from "../services/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in both fields.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      const userId = data.user?.id;

      if (userId) {
        const { error: insertError } = await supabase.from("user").insert({
          id: userId,
          email: formData.email,
          role: "user",
        });

        if (insertError) {
          toast.warning("Registered but failed to insert user data: " + insertError.message);
        } else {
          toast.success("Registration successful!");
          setTimeout(() => navigate("/login"), 3000);
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

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
          <Link to="/login" className="text-blue-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
