import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

export const signupSend = async (username: string, email: string) => {

    try {
      const res = await axios.post(`${apiUrl}/user/signup-send`, 
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
export const signupVerify = async (fullname: string, username: string, email: string, password: string, code: string) => {

    try {
      const res = await axios.post(`${apiUrl}/user/signup-verify`, 
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
export const login = async (usernameORemail: string, password: string) => {
    try {
      const res = await axios.post(`${apiUrl}/user/login`, 
      JSON.stringify({ usernameORemail, password}),
      {
        headers: { "Content-Type": "application/json"},
        withCredentials: true
      })
      return res
    } catch (err) {
      throw err;
    }
  
}
export const forgot = async (email: string) => {
    try {
      const res = await axios.post(`${apiUrl}/user/forgot-password`, 
      JSON.stringify({ email }),
      {
        headers: { "Content-Type": "application/json"},
        withCredentials: true
      })
      return res
    } catch (err) {
      throw err;
    }
  
}
export const reset = async (id: string, token: string, password: string) => {
    try {
      const res = await axios.post(`${apiUrl}/user/reset-password/${id}/${token}`, 
      JSON.stringify({ password }),
      {
        headers: { "Content-Type": "application/json"},
        withCredentials: true
      })
      return res
    } catch (err) {
      throw err;
    }
  
}