import { FaHandHoldingHand } from "react-icons/fa6"
import { IoBagAdd } from "react-icons/io5"
import { BiSearch } from "react-icons/bi"
import useLogout from "../../hooks/useLogout"
import { Avatar, AvatarFallback, AvatarImage } from "../../../@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../@/components/ui/popover"
import { useTrader } from "../../hooks/queries/useTrader"
import { ToastContainer } from "react-toastify"
import { useAuthStore } from "../../hooks/state"
import { Link } from "react-router-dom"
import Coin from "../../assets/coin.svg?react"
import categories from "../../assets/categories.json"

export default function Trader() {

  const {user_id} = useAuthStore((state) => state)
  const traderQuery = useTrader(user_id)

  const logout = useLogout()
  async function handleLogout(){
    await logout()
  }

  function getCategory(category: string){
    console.log(category);
    
  }

  return (
    <div className="min-h-screen">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <nav className="grid grid-cols-9 fixed top-0 w-full place-items-center py-3 bg-white dark:bg-[#09090b] dark:border-b-2 dark:border-[#262626]">
        <h1 className="col-span-2">
          <Link to="/trader">
            <FaHandHoldingHand className="h-11 w-11 drop-shadow-2xl text-dos dark:text-uno"/>  
          </Link>
        </h1>
        <div className="search-bar flex items-center w-full h-full  col-span-5">
            <input type="search" placeholder="Search in BandB" className=" bg-gray-200 dark:bg-zinc-700 px-3 h-full rounded-l-md  focus:border-indigo-400 outline-none font-regular text-gray-900 dark:text-gray-100 w-full" />
            <div className="search-icon flex items-center justify-center pl-3 pr-2 rounded-r-md h-full bg-orange-300 dark:bg-orange-900">
              <BiSearch className="text-white w-7 h-7" />
            </div>
        </div>
        <div className="right items-center flex justify-evenly col-span-2 w-full">
          <button className="add-item">
            <IoBagAdd className="text-violet-500 w-7 h-7"/>
          </button>

          <Popover>
            <PopoverTrigger>
              <Avatar>
                <AvatarImage className="w-10 h-10 rounded-full border-2 border-dos dark:border-gray-700" src={traderQuery?.data?.trader?.profile} />
                <AvatarFallback className="bg-dos border-2 border-blue-200 dark:border-gray-700 text-white uppercase">{traderQuery?.data?.trader?.fullname.slice(0,2)}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent>
              <ul className="px-5 py-3 flex flex-col rounded-md bg-white border-2 dark:divide-zinc-700 dark:bg-[#27272a] dark:border-zinc-700 dark:text-white border-blue-100 shadow-2xl">
                <div className="coin py-3 flex mb-3 shadow-sm items-center justify-around bg-yellow-100 dark:bg-zinc-600 rounded-lg">
                  <h2 className="font-semibold dark:text-violet-400">Coins:</h2>
                  <div className="coinnn flex gap-1 items-center justify-center">
                    <p className="fon font-semibold text-md text-gray-900 dark:text-gray-100">{traderQuery?.data?.trader?.coin}</p>
                    <Coin className="w drop-shadow-2xl text-yellow-400 w-4 h-4"/>
                  </div>
                </div>
                <Link to={`/trader/t/profile/${traderQuery?.data?.trader?.username}`} className="font-semibold py-2 px-10 hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-md">Profile</Link>
                <hr />
                <button className="font-semibold py-2 px-10 hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-md">Coupon</button>
                <hr />
                <button className="font-semibold py-2 px-10 hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-md" onClick={handleLogout}>Logout</button>
              </ul>
            </PopoverContent>
          </Popover>
          
        </div>
      </nav>
      <div className="body px-5 pt-28 min-h-screen grid grid-cols-12 grid-flow-row">
        <div className="category-nav col-span-3 lg:col-span-2 py-5 flex flex-col items-start bg-uno dark:text-gray-200  gap-1 rounded-l-lg dark:dark:bg-zinc-600">
          <h3 className="text-center w-full font-bold">Categories</h3>
          <hr className="bg bg-gray-500" />
          {categories.map((category) => (
            <button onClick={() => getCategory(category.category)} key={category.id} className="category py-2 px-5 font-semibold w-full text-left border-2 dark:border-transparent dark:hover:bg-zinc-700 hover:text-violet-500">
              {category.category}
            </button>
          ))}
        </div>
        <div className="items-category- p-5 col-span-9 lg:col-span-10 rounded-tr-lg bg-white dark:dark:bg-zinc-700">
            <div className="">ITEMS</div>
        </div>
      </div>
    </div>
  )
}
