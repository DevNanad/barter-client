import { useParams } from "react-router-dom"
import { useProfile } from "../../hooks/queries/useTrader"
import TraderNotFound from "./TraderNotFound"
import { Avatar, AvatarFallback, AvatarImage } from "../../../@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../@/components/ui/tabs"
import { FaCartShopping, FaClock } from "react-icons/fa6"
import { useEffect } from "react"
import { useAuthStore } from "../../hooks/state"


export default function Profile() {
    const {username} = useParams()
    const traderQuery = useProfile(username)
    const {user_id} = useAuthStore((state) => state)

    useEffect(() => {
      traderQuery.refetch();
    }, [username]);

    if(traderQuery?.isLoading === false){
      if(traderQuery?.data === undefined){
        return (
          <TraderNotFound/>
        )
      }
    }
  return (
    <div className="dark:text-white px-5">
      <div className="about grid grid-cols-9 pt-10 mx-5 mb-10">
        <Avatar className='flex items-center justify-center col-span-4 sm:mr-10 md:mr-0'>
          <AvatarImage className="w-40 h-40 rounded-full" src={traderQuery?.data?.trader?.profile} />
          <AvatarFallback className="bg-dos w-40 h-40 text-4xl text-white uppercase">{traderQuery?.data?.trader?.fullname.slice(0,2)}</AvatarFallback>
        </Avatar>
        <div className="info flex flex-col col-span-5 gap-3 ">
          <div className="flex gap-2 items-center">
            <h1 className="text-xl font-light mr-5">{traderQuery?.data?.trader?.username}</h1>
            {traderQuery?.data?.trader?.id === user_id
              ? <div className="btn dark:bg-gray-700 text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer">Edit profile</div>
              : ''
            }
          </div>
          <h1 className="text-sm">Rating: {traderQuery?.data?.trader?.rating ?? "0" }</h1>
          <h1 className="font-semibold capitalize">{traderQuery?.data?.trader?.fullname}</h1>
        </div>
      </div>
      <Tabs defaultValue="items" className="w-full border-t-[1px] dark:border-[#262626] ">
        <TabsList className="flex justify-center gap-10">
          <TabsTrigger className="font-bold flex items-center justify-center gap-2 py-3 tracking-wider data-[state=active]:border-white data-[state=active]:border-t-[1px]" value="items">
            <FaCartShopping/>
            <h3>ITEMS</h3>
          </TabsTrigger>
          <TabsTrigger className="font-bold flex items-center justify-center gap-2 py-3 tracking-wider data-[state=active]:border-white data-[state=active]:border-t-[1px]" value="history">
            <FaClock/>
            <h3>HISTORY</h3>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="items">Your Items is here.</TabsContent>
        <TabsContent value="history">Here is your trading history</TabsContent>
      </Tabs>

    </div>
  )
}
