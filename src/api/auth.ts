import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

export const registerSend = async (username: string, email: string) => {

    try {
      const res = await axios.post(`${apiUrl}/api/v1/user/register-send`, 
      JSON.stringify({ username, email }),
      {
        headers: { "Content-Type": "application/json"},
        withCredentials: true
      })
      return res
    } catch (err) {
      throw err;
    }
  
}
export const registerVerify = async (fullname: string, username: string, email: string, password: string, code: string) => {

    try {
      const res = await axios.post(`${apiUrl}/api/v1/user/register-verify`, 
      JSON.stringify({ fullname, username, email, password, code}),
      {
        headers: { "Content-Type": "application/json"},
        withCredentials: true
      })
      return res
    } catch (err) {
      throw err;
    }
  
  }