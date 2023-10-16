import { useEffect, useState } from 'react'
import { useAuthStore } from '../hooks/state';
import useRefreshToken from '../hooks/useRefreshToken';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Lottie from 'lottie-react';
import loader from "../assets/loader.json"
import 'react-toastify/dist/ReactToastify.css';


export default function Layout() {
  const navigate = useNavigate();
  const { isNight, token } = useAuthStore((state) => state)
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const location = useLocation()
  const pathname = location.pathname

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
          navigate(pathname, {replace: true});
          
        } else if (parsed.user_type === 'advertiser') {
          navigate(pathname, {replace: true});
        }else {
          console.log("Here App component");
        }
    }
    
  }, [isLoading, token])
  return (
        <HelmetProvider>
          <div className="bg-[#BEADFA] min-h-screen">
            {isLoading 
              ? <div className="div w-full h-screen absolute flex justify-center items-center">
                  <Lottie animationData={loader} className="w-40 h-40 md:w-52 md:h-52 drop-shadow-2xl" loop={true} />
                </div>
              : <Outlet />
            }
          </div>
        </HelmetProvider>
  )
}
