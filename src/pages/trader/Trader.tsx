import { FaHandHoldingHand } from "react-icons/fa6"
import { IoBagAdd } from "react-icons/io5"
import { BiSearch } from "react-icons/bi"
import { TbBrandCoinbase } from "react-icons/tb"
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

export default function Trader() {

  const {user_id} = useAuthStore((state) => state)
  const traderQuery = useTrader(user_id)

  const logout = useLogout()
  async function handleLogout(){
    await logout()
  }

  return (
    <div>
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
      <nav className="grid grid-cols-9 sticky place-items-center py-3 bg-white">
        <h1 className="col-span-2">
          <FaHandHoldingHand className="h-11 w-11 drop-shadow-2xl text-dos"/>
        </h1>
        <div className="search-bar flex items-center w-full h-full  col-span-5">
            <input type="search" placeholder="Search in BandB" className=" bg-gray-200 px-3 h-full rounded-l-md  focus:border-indigo-400 outline-none font-regular text-gray-900 w-full" />
            <div className="search-icon flex items-center justify-center pl-3 pr-2 rounded-r-md h-full bg-orange-300">
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
                <AvatarImage className="w-10 h-10 rounded-full border-2 border-dos" src={traderQuery?.data?.trader?.profile} />
                <AvatarFallback className="bg-dos border-2 border-blue-200 text-white uppercase">{traderQuery?.data?.trader?.fullname.slice(0,2)}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent>
              <ul className="px-5 py-3 flex flex-col rounded-md bg-white border-2 border-blue-100 shadow-2xl">
                <div className="coin py-3 flex mb-3 shadow-sm items-center justify-around bg-yellow-100 rounded-lg">
                  <h2 className="font-semibold">Coins:</h2>
                  <div className="coinnn flex gap-1 items-center justify-center">
                    <p className="fon font-semibold text-md text-gray-900">{traderQuery?.data?.trader?.coin}</p>
                    <Coin className="w drop-shadow-2xl text-yellow-400 w-4 h-4"/>
                  </div>
                </div>
                <Link to='/trader/profile' className="font-semibold py-2 px-10 hover:bg-gray-100 rounded-md">Profile</Link>
                <hr />
                <button className="font-semibold py-2 px-10 hover:bg-gray-100 rounded-md" onClick={handleLogout}>Logout</button>
              </ul>
            </PopoverContent>
          </Popover>
          
        </div>
      </nav>
    </div>
  )
}
