import { Navigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

/**
 * ProtectedRoute component to guard routes based on user role
 */
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-stone-200 rounded-full mb-4"></div>
        <div className="h-4 w-24 bg-stone-200 rounded"></div>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  
  if (role === "ADMIN" && user.role !== "admin") return <Navigate to="/" />;
  if (role === "EDITOR" && user.role !== "editor" && user.role !== "admin") return <Navigate to="/" />;
  if (role === "EMPLOYEE" && !user.role) return <Navigate to="/" />;
  
  return children;
}
