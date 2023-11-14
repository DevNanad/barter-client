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
import { HiMail } from "react-icons/hi"
import { Helmet } from "react-helmet-async"


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
    <div className="text-gray-900 pb-20 md:pb-0 dark:text-white px-5 min-h-screen overflow-y-auto">
      <Helmet>
        <title>BandB | Profile</title>
      </Helmet>
      <div className="about md:grid md:grid-cols-9 gap-10 pt-10 mx-5 mb-10">
        <Avatar className='flex w-full h-full items-center justify-center md:justify-end col-span-2'>
          <AvatarImage className="w-28 md:w-40 h-28 md:h-40 object-cover rounded-full" src={traderQuery?.data?.trader?.profile} />
          <AvatarFallback className="bg-dos w-28 md:w-40 h-28 md:h-40 text-4xl text-white uppercase">{traderQuery?.data?.trader?.fullname.slice(0,2)}</AvatarFallback>
        </Avatar>
        <div className="info flex flex-col col-span-5 gap-3 ">
          <div className="flex gap-2 justify-center py-3 md:py-0 md:items-center">
            <h1 className="text-base md:text-xl font-light mr-5">{traderQuery?.data?.trader?.username}</h1>
            {traderQuery?.data?.trader?.id === user_id
              ? <Link to='/trader/settings' className="btn bg-gray-300 dark:bg-gray-700 text-xs md:text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer">Edit profile</Link>
              : ''
            }
          </div>
          <h1 className="font-semibold text-center md:text-left capitalize">{traderQuery?.data?.trader?.fullname}</h1>
          <p className=" font-medium capitalize text-sm text-center md:pt-10">{traderQuery?.data?.trader?.bio}</p>
        </div>
      </div>
      <Tabs defaultValue="items" className="w-full border-t-[1px] border-gray-400 dark:border-[#262626] ">
        <TabsList className="flex justify-center gap-10">
          <TabsTrigger className="font-bold flex rounded-none text-gray-400 items-center justify-center gap-2 py-3 tracking-wider data-[state=active]:text-dos data-[state=active]:border-dos dark:data-[state=active]:border-white dark:data-[state=active]:text-white data-[state=active]:border-t-[1px]" value="items">
            <FaCartShopping className="w-5 h-5" />
            <h3 className="">ITEMS</h3>
          </TabsTrigger>
          <TabsTrigger className="font-bold flex rounded-none text-gray-400 items-center justify-center gap-2 py-3 tracking-wider data-[state=active]:text-dos data-[state=active]:border-dos dark:data-[state=active]:border-white dark:data-[state=active]:text-white data-[state=active]:border-t-[1px]" value="contact">
            <HiMail className="w-5 h-5" />
            <h3 className="">CONTACT</h3>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="items" className={`grid sm:grid-cols-2 z-0 md:grid-cols-3 relative lg:grid-cols-5 gap-5 ${isItemSliderOpen ? '' : 'overflow-hidden'}`}>
          <div className={`organizations  bg-white dark:bg-[#212225] text-white  rounded-md w-full min-h-full absolute top-0 left-0 z-10 ${ isItemSliderOpen ? 'translate-x-0' : 'translate-x-full'} transition-all duration-500`}>
                  <div className="close flex">
                    <button onClick={() => setIsItemSliderOpen(false)} className="p-5 rounded-xl">
                      <FaAngleLeft className="w-6 h-6 text-gray-400 dark:text-gray-300"/>
                    </button>
                  </div>
                  {filteredItem?.map((item:any) => (
                    <div key={item.id} className="item px-3 pb-4">
                      <div className=" rounded-lg overflow-hidden w-full bg-black">
                        {item?.image.length > 1
                          ? <Carousel slides={item?.image} height='h-[30rem]' object="object-contain"/>
                          : <img src={item?.image} alt={item?.name} className="h-[30rem] min-w-full object-contain" />
                        }
                      </div>
                      <h3 className="text-xl text-gray-700 dark:text-gray-300 py-3 font-pop font-semibold capitalize">{item?.name}</h3>
                      <h6 className="text text-gray-700 dark:text-gray-300 opacity-80 font-pop font-semibold capitalize">₱{item?.price}</h6>
                      <h6 className="text-sm text-gray-700 dark:text-gray-300 opacity-80  capitalize">Listed in {item?.location}</h6>
                      <div className="details text-gray-700 dark:text-gray-100">
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
              <div key={item?.id} className="item text-gray-600 dark:text-gray-400  bg-white dark:bg-[#212225] rounded-md overflow-hidden flex flex-col shadow-lg h-fit pb-3">
                  <Carousel slides={item.image} height="h-40" object="object-cover"/>
                  <div className="flex-1 px-3 flex flex-col">
                    <div className=" pt-3 text-gray-600 dark:text-gray-400  font-extrabold capitalize">₱{item.price}</div>
                    <h2 className="font-bold opacity-80 truncate">{item.name}</h2>
                    <div className="text-xs opacity-50 flex font-light capitalize truncate">
                      <IoLocationSharp className="w-4 h-4" />
                      <h4>{item.location}</h4>
                    </div>
                    {traderQuery?.data?.trader.id === user_id
                      ? ''
                      : <button onClick={() => handleItemDetails(item.id)} className="p-2 bg-dos text-white font-extrabold rounded-md mt-2">Details</button>
                    }
                    
                  </div>
                </div>
            ))}
        </TabsContent>
        <TabsContent value="contact">
          <div className="contacme pb-10 md:pb-0">
            <h1 className="text-xl font-semibold md:ml-10">Contact Information</h1>
            <div className="info md:ml-20 mt-10 flex gap-2 font-semibold">
              <h3 className="opacity-70">Mobile Number:</h3>
              <h4>{traderQuery?.data?.trader?.mobile_number ?? "09123456789"}</h4>
            </div>
            <div className="info md:ml-20 mt-5 flex gap-2 font-semibold">
              <h3 className="opacity-70">Email Address:</h3>
              <h4>{traderQuery?.data?.trader?.email ?? "trader@email.com"}</h4>
            </div>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  )
}
