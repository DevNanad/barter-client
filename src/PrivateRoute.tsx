import { Navigate } from 'react-router-dom';

interface propss {
    element: React.ReactNode;
    isAuthenticated: boolean;
}

const PrivateRoute = ({ element, isAuthenticated }: propss) => {
  if (!isAuthenticated) {
    // Redirect to the login page or another route if the user is not authenticated.
    return <Navigate to="/login" />;
  }

  // Render the protected route if the user is authenticated.
  return element;
};

export default PrivateRoute