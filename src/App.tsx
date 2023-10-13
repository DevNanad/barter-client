import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import {Outlet, useNavigate} from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from "./hooks/state";
import useRefreshToken from "./hooks/useRefreshToken";

function App() {
  const navigate = useNavigate();
  const { isNight, token } = useAuthStore((state) => state)
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();


  useEffect(() => {
    let isMounted = true;
  
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !token ? verifyRefreshToken() : setIsLoading(false)
  
  
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      useAuthStore.setState({ isNight: true });
    } else {
      document.documentElement.classList.remove('dark');
      useAuthStore.setState({ isNight: false });
    }
  
    return () => {
      isMounted = false;
    };
  }, [isNight]);
  

  useEffect(() => {
    if(token){ 
        const parsed = JSON.parse(token);
        if (parsed.user_type === 'trader') {
          navigate('/trader', {replace: true});
        } else if (parsed.user_type === 'advertiser') {
          navigate('/advertiser', {replace: true});
        }else {
          console.log("Here App component");
        }
    }
    
  }, [isLoading, token])
  return (
    <HelmetProvider>
      <div className="bg-[#BEADFA] min-h-screen">
        <Outlet/>
      </div>
    </HelmetProvider>
  )
}

export default App
