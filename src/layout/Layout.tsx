import { useEffect, useState } from 'react'
import { useAuthStore } from '../hooks/state';
import useRefreshToken from '../hooks/useRefreshToken';
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Lottie from 'lottie-react';
import loader from "../assets/loader.json"
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "../../@/components/theme-provider"


export default function Layout() {
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
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <HelmetProvider>
          <div className="bg-[#e9ebf8] dark:bg-[#1a1a1d] min-h-screen">
            {isLoading 
              ? <div className="div w-full h-screen absolute flex justify-center items-center">
                  <Lottie animationData={loader} className="w-40 h-40 md:w-52 md:h-52 drop-shadow-2xl" loop={true} />
                </div>
              : <Outlet />
            }
          </div>
        </HelmetProvider>
    </ThemeProvider>
  )
}
