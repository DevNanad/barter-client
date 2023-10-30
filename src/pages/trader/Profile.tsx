import { Link, useParams } from "react-router-dom"
import { useProfile } from "../../hooks/queries/useTrader"
import TraderNotFound from "./TraderNotFound"
import { Avatar, AvatarFallback, AvatarImage } from "../../../@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../@/components/ui/tabs"
import { FaAngleLeft, FaCartShopping } from "react-icons/fa6"
import { useEffect, useState } from "react"
import { useAuthStore } from "../../hooks/state"
import Carousel from "../../components/Carousel"
import { IoLocationSharp } from "react-icons/io5"


export default function Profile() {
    const {username} = useParams()
    const traderQuery = useProfile(username)
    const {user_id} = useAuthStore((state) => state)
    const [isItemSliderOpen, setIsItemSliderOpen] = useState<boolean>(false)
    const [filteredItem, setFilteredItem] = useState<any>(null)

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
  function handleItemDetails(id: any) {
    const data = traderQuery?.data?.trader.Products.filter((item:any) => item.id === id)
    setFilteredItem(data)
    setIsItemSliderOpen(true)
  }

  return (
    <div className="dark:text-white px-5 min-h-screen overflow-y-auto">
      <div className="about grid grid-cols-9 pt-10 mx-5 mb-10">
        <Avatar className='flex items-center justify-center col-span-4 sm:mr-10 md:mr-0'>
          <AvatarImage className="w-40 h-40 rounded-full" src={traderQuery?.data?.trader?.profile} />
          <AvatarFallback className="bg-dos w-40 h-40 text-4xl text-white uppercase">{traderQuery?.data?.trader?.fullname.slice(0,2)}</AvatarFallback>
        </Avatar>
        <div className="info flex flex-col col-span-5 gap-3 ">
          <div className="flex gap-2 items-center">
            <h1 className="text-xl font-light mr-5">{traderQuery?.data?.trader?.username}</h1>
            {traderQuery?.data?.trader?.id === user_id
              ? <Link to='/trader/settings' className="btn dark:bg-gray-700 text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer">Edit profile</Link>
              : ''
            }
          </div>
          <h1 className="font-semibold capitalize">{traderQuery?.data?.trader?.fullname}</h1>
        </div>
      </div>
      <Tabs defaultValue="items" className="w-full border-t-[1px] dark:border-[#262626] ">
        <TabsList className="flex justify-center gap-10">
          <TabsTrigger className="font-bold flex items-center justify-center gap-2 py-3 tracking-wider data-[state=active]:border-white data-[state=active]:border-t-[1px]" value="items">
            <FaCartShopping/>
            <h3>ITEMS</h3>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="items" className={`grid grid-cols-3 relative lg:grid-cols-5 gap-5 ${isItemSliderOpen ? '' : 'overflow-hidden'}`}>
          <div className={`organizations  bg-gray-200 rounded-md dark:bg-zinc-800 w-full min-h-full absolute top-0 left-0 z-10 ${ isItemSliderOpen ? 'translate-x-0' : 'translate-x-full'} transition-all duration-500`}>
                  <div className="close flex">
                    <button onClick={() => setIsItemSliderOpen(false)} className="p-5 rounded-xl">
                      <FaAngleLeft className="w-6 h-6 text-gray-400 dark:text-gray-300"/>
                    </button>
                  </div>
                  {filteredItem?.map((item:any) => (
                    <div key={item.id} className="item px-3 pb-4">
                      <div className=" rounded-lg overflow-hidden bg-black">
                        {item?.image.length > 1
                          ? <Carousel slides={item?.image} height='h-[30rem]' object="object-contain"/>
                          : <img src={item?.image} alt={item?.name} className="h-[30rem] min-w-full object-contain" />
                        }
                      </div>
                      <h3 className="text-xl dark:text-gray-300 py-3 font-pop font-semibold capitalize">{item?.name}</h3>
                      <h6 className="text dark:text-gray-300 opacity-80 font-pop font-semibold capitalize">₱{item?.price}</h6>
                      <h6 className="text-sm dark:text-gray-300 opacity-80  capitalize">Listed in {item?.location}</h6>
                      <div className="details dark:text-gray-100">
                        <h2 className="text-center" >Details</h2>
                        <h5 className="condition opacity-90">Condition: {item?.condition}</h5>
                        <p className="details indent-10 p-5">{item?.details}</p>
                      </div>
                    </div>
                  ))}
            </div>
          {traderQuery?.data?.trader.Products?.length === 0
            ? <div className="">No Item</div>
            : traderQuery?.data?.trader.Products.map((item: any) => (
              <div key={item?.id} className="item text-gray-100 bg-[#202124] rounded-md overflow-hidden flex flex-col shadow-lg h-fit pb-3">
                  <Carousel slides={item.image} height="h-40" object="object-cover"/>
                  <div className="flex-1 px-3 flex flex-col">
                    <div className=" pt-3 text-white font-extrabold capitalize">₱{item.price}</div>
                    <h2 className="font-bold opacity-80 truncate">{item.name}</h2>
                    <div className="text-xs opacity-50 flex font-light capitalize truncate">
                      <IoLocationSharp className="w-4 h-4" />
                      <h4>{item.location}</h4>
                    </div>
                    {traderQuery?.data?.trader.id === user_id
                      ? ''
                      : <button onClick={() => handleItemDetails(item.id)} className="p-2 bg-indigo-900 font-extrabold rounded-md mt-2">Details</button>
                    }
                    
                  </div>
                </div>
            ))}
        </TabsContent>
      </Tabs>

    </div>
  )
}
