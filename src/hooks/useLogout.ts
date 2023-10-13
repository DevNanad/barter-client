import { useQueryClient } from "@tanstack/react-query"
import axios from "../api/axios"
import { useAuthStore } from "./state"


export default function useLogout() {
    const {user_id} = useAuthStore((state) => state)
    const queryClient = useQueryClient()
    const logout = async () => {
        useAuthStore.setState({token: null})
        try {
            if(user_id){
                const response = await axios.post('/logout',{user_id}, {
                    withCredentials: true
                })
                await queryClient.invalidateQueries({
                    queryKey: ['voter'],
                    exact: true
                })
            }
            useAuthStore.setState({user_id: ''})
        } catch (error) {
            console.error(error);
        }
    }
  return logout
}