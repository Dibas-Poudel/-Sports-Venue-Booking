import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";

const ProtectedAdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null); // null means still loading
  const [loading, setLoading] = useState(true); // Track the loading state

  useEffect(() => {
    const checkUserRole = async () => {
      const user = supabase.auth.user(); // Get the logged-in user

      console.log("Current user:", user); // Log the user object

      if (!user) {
        // If user is not logged in, navigate to login
        console.log("User is not logged in");
        navigate("/login", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("user")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching role:", error.message);
        setIsAdmin(false); // In case of error, treat as non-admin
      } else {
        console.log("Fetched user role:", data?.role); // Log the fetched role
        if (data?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false); // Not admin, so redirect to login
          navigate("/login", { replace: true });
        }
      }

      setLoading(false); // Set loading to false once check is done
    };

    checkUserRole();
  }, [navigate]);

  // Show loading message while checking the user role
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not an admin, do not render children and navigate to login
  if (!isAdmin) {
    return null;
  }

  // If the user is an admin, render the children
  return children;
};

export default ProtectedAdminRoute;
