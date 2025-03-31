import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const ProtectedAdminRoute = ({ children }) => {
  const { profile, role, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) {
      navigate("/login");
    } else if (role !== "admin") {
      navigate("/");
    }
  }, [profile, role, navigate]);

  if (loading) return <Spinner />;
  return profile && role === "admin" ? children : null;
};

export default ProtectedAdminRoute;