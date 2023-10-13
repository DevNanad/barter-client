import axios from "../api/axios"
import { useAuthStore } from "./state"

export default function useRefreshToken() {

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true,
    })
    //console.log(response.data);
    useAuthStore.setState({token: JSON.stringify(response.data)})
    useAuthStore.setState({user_id: JSON.stringify(response.data.user_id)});
    return response.data.accessToken
  }
  return refresh
}