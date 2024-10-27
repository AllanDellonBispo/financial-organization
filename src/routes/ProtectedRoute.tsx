// src/routes/ProtectedRoute.tsx
import { useLoggedUser } from "../contexts/LoggedUser";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { status } = useLoggedUser();

  if (!status) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
