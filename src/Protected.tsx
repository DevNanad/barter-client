import { Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/state';

interface propss {
    element: React.ReactNode;
}

const Protected = ({ element }: propss) => {
    const {token} = useAuthStore((state) => state)

    if (!token) {
        // Redirect to the login page or another route if the user is not authenticated.
        return <Navigate to="/login" />;
    }

    // Render the protected route if the user is authenticated.
    return element;
};
export default Protected