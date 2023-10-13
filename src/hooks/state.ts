import { create } from "zustand"

type AuthState = {
    token: string | null;
    user_id: string;
    isNight: boolean;
}

  
export const useAuthStore = create<AuthState>(() => ({
    token: null,
    user_id: '',
    isNight: false,

    //Light Mode / Dark Mode
    switchMode: () => {
      const isNight = useAuthStore.getState().isNight;
      const theme = isNight ? 'light' : 'dark';
      localStorage.theme = theme;
      useAuthStore.setState({ isNight: !isNight });
    }

  }));