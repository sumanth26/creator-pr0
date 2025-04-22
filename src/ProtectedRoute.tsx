import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./HOC/AuthContextProvider";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Show a loading state while checking auth

  return user ? <Outlet /> : <Navigate to="/creator-login" replace />;
};

export default ProtectedRoute;
