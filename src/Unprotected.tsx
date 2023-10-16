import { Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/state';

interface propss {
    element: React.ReactNode;
}

const Unprotected = ({ element }: propss) => {
    const {token} = useAuthStore((state) => state)



    if(token){ 
        const parsed = JSON.parse(token);
        if (parsed.user_type === 'trader') {
            return <Navigate to="/trader" />;
        } else if (parsed.user_type === 'advertiser') {
            return <Navigate to="/advertiser" />;
        }else {
          console.log("Here at Unprotected");
        }
    }

    return element;
};
export default Unprotected