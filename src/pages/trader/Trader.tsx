import useLogout from "../../hooks/useLogout"

export default function Trader() {

  const logout = useLogout()
  async function handleLogout(){
    await logout()
  }

  return (
    <div>
      <h1>Trader</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
