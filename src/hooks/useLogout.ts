import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL
import { useAuthStore } from "./state"
import { useQueryClient } from "@tanstack/react-query"


export default function useLogout() {
    const user_id = localStorage.getItem("user_id")
    const queryClient = useQueryClient()
    const logout = async () => {
        useAuthStore.setState({token: null})
        try {
            if(user_id){
                await axios.post(`${apiUrl}/user/logout`,{user_id}, {
                    withCredentials: true
                })
                await queryClient.invalidateQueries({
                    queryKey: ['voter'],
                    exact: true
                })
            }
            localStorage.removeItem('user_id')
        } catch (error) {
            console.error(error);
        }
    }
  return logout
}