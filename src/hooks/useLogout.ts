import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL
import { useAuthStore } from "./state"


export default function useLogout() {
    const user_id = localStorage.getItem("user_id")
    const logout = async () => {
        useAuthStore.setState({token: null})
        try {
            if(user_id){
                await axios.post(`${apiUrl}/user/logout`,{user_id}, {
                    withCredentials: true
                })
            }
            localStorage.removeItem('user_id')
        } catch (error) {
            console.error(error);
        }
    }
  return logout
}