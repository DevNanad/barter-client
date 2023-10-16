import { useParams } from "react-router-dom"
import { useProfile } from "../../hooks/queries/useTrader"

export default function Profile() {
    const {username} = useParams()
    const traderQuery = useProfile(username)


    if(traderQuery?.isLoading === false){
      if(traderQuery?.data === undefined){
        return (
          <div className="">
            <h1>User not found</h1>
          </div>
        )
      }
    }
  return (
    <div className="dark:text-white">Profile {traderQuery?.data?.trader?.username}</div>
  )
}
