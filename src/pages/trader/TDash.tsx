import { useTrader } from '../../hooks/queries/useTrader'
import { Link, Outlet } from 'react-router-dom'
import {LuMenu, LuMessagesSquare, LuShoppingCart} from 'react-icons/lu'
import { FaHandHoldingHand } from 'react-icons/fa6'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../@/components/ui/popover"
import useLogout from '../../hooks/useLogout'
import { useTheme } from '../../../@/components/theme-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../../../@/components/ui/avatar"
import { Moon, Sun } from 'lucide-react'
import { useAuthStore } from '../../hooks/state'


export default function TDash() {
    const {user_id} = useAuthStore((state) => state)
    const traderQuery = useTrader(user_id)
    const { setTheme } = useTheme()

    const logout = useLogout()
    async function handleLogout(){
      await logout()
    }

    return (
      <div className="grid h-full grid-cols-12">
          <div className="sidebar flex flex-col justify-start sticky top-0 max-h-screen md:col-span-1 lg:col-span-2 border-r-2 border-violet-300 dark:border-[#27272a] lg:px-4 pb-5">
            <div className="logo py-5 flex justify-center">
              <Link to="/trader">
                <FaHandHoldingHand className="w-9 lg:h-14 h-9 lg:w-14 drop-shadow-2xl text-uno"/>  
              </Link>
            </div>
            <div className="links text-uno dark:text-[#fafafa] pt-10 grow flex flex-col gap-2">
              <Link to='/trader' className="icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-violet-200 dark:hover:bg-zinc-900 px-3 py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-3">
                <LuShoppingCart className="w-8 h-8"/>
                <h2 className='hidden lg:block text-lg font-semibold'>Market</h2>
              </Link>
              <Link to="/trader/messages" className="icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-violet-200 dark:hover:bg-zinc-900 px-3 py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-3">
                <LuMessagesSquare className="w-8 h-8"/>
                <h2 className='hidden lg:block text-lg font-semibold'>Messages</h2>
              </Link>
              <Link  to={`/trader/${traderQuery?.data?.trader?.username}`} className={`icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-violet-200 dark:hover:bg-zinc-900 px-3 py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-2 active:bg-zinc-900 `}>
                <Avatar className='flex items-center justify-center'>
                  <AvatarImage className="w-8 h-8 rounded-full" src={traderQuery?.data?.trader?.profile} />
                  <AvatarFallback className="bg-dos w-8 h-8 text-white uppercase">{traderQuery?.data?.trader?.fullname.slice(0,2)}</AvatarFallback>
                </Avatar>
                <h2 className='hidden lg:block text-lg font-semibold'>Profile</h2>
              </Link>
            </div>

            <div className="menu justify-self-end w-full py-5 text-uno dark:text-[#fafafa]">
              <Popover>
                <PopoverTrigger className='w-full'>
                  <div className='flex cursor-pointer items-center justify-center lg:justify-start lg:gap-3 hover:text-dos ease-in-out hover:bg-violet-200 dark:hover:bg-zinc-900 rounded-md px-3 py-2 w-full'>
                    <LuMenu className="w-8 h-8"/>
                    <h2 className='hidden lg:block text-lg font-semibold'>More</h2>
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <ul className="px-2 py-3 divide-y divide-violet-500 dark:divide-zinc-700 dark:bg-[#27272a] flex flex-col rounded-md text-white bg-dos border-2 border-violet-400 dark:border-zinc-700 shadow-lg">
                    <div className="py-2 flex mb-3 cursor-pointer shadow-sm items-center justify-around bg-yellow-100 dark:bg-zinc-600 rounded-lg">
                      <h2 className="font-semibold text-dos dark:text-violet-400">Coins:</h2>
                      <div className="coinnn flex gap-1 items-center justify-center">
                        <p className="fon font-semibold text-md text-gray-900 dark:text-white">{traderQuery?.data?.trader?.coin}</p>
                        
                      </div>
                    </div>
                    
                    <button className="font-semibold py-2 px-10 hover:bg-violet-600 dark:hover:bg-zinc-600 hover:opacity-40 dark:hover:opacity-100 rounded-md">Coupon</button>
                    
                    <Link to="/trader/settings" className="font-semibold py-2 px-10 hover:bg-violet-600 text-center dark:hover:bg-zinc-600 hover:opacity-40 dark:hover:opacity-100 rounded-md">Settings</Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <div className="font-semibold cursor-pointer flex gap-4 items-center justify-between py-2 px-10 hover:bg-violet-600 dark:hover:bg-zinc-600 hover:opacity-40 dark:hover:opacity-100 rounded-md">
                            <h1>Appearance</h1>
                            <div className="mode relative">

                              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                              <Moon className="absolute top-0 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </div>
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='' align="end">
                          <DropdownMenuItem className='py-2 px-5 font-semibold hover:bg-gray-300 rounded-md' onClick={() => setTheme("light")}>
                            Light
                          </DropdownMenuItem>
                          <DropdownMenuItem className='py-2 px-5 font-semibold hover:bg-gray-300 rounded-md' onClick={() => setTheme("dark")}>
                            Dark
                          </DropdownMenuItem>
                          <DropdownMenuItem className='py-2 px-5 font-semibold hover:bg-gray-300 rounded-md' onClick={() => setTheme("system")}>
                            System
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    
              
                    <button className="font-semibold py-2 px-10 hover:bg-violet-600 dark:hover:bg-zinc-600 hover:opacity-40 dark:hover:opacity-100 rounded-md" onClick={handleLogout}>Logout</button>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="main min-h-screen col-span-9 lg:col-span-10">
            <Outlet/>
          </div>
      </div>
    )
    
}
