import { useAddCoin } from '../../hooks/queries/useTrader'
import { Link, Outlet } from 'react-router-dom'
import { LuPlusSquare} from 'react-icons/lu'
import { FaHandHoldingHand } from 'react-icons/fa6'
import useLogout from '../../hooks/useLogout'
import {useState } from 'react'
import Modal from '../../components/Modal'
import { ZodType, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ToastContainer } from 'react-toastify'

type AddCoinFormData = {
  username: string;
  coin: string;
}

export default function Admin() {
    const {mutate:addCoin, isLoading: isCoinAdding} = useAddCoin()
    const [isOpenAddCoin, setIsOpenAddCoin] = useState(false)


    const logout = useLogout()
    async function handleLogout(){
      await logout()
    }

    const schema: ZodType<AddCoinFormData> = z.object({
      username: z.string().min(1, {message: "Account Username is required"}).max(100),
      coin: z.string().regex(/^\d+$/, {message: "Coin must be a number"}).min(1).max(9),
    })

    const {register, handleSubmit, formState:{errors}} = useForm<AddCoinFormData>({resolver: zodResolver(schema)})
  


    async function handleAdd(data: AddCoinFormData) {
      try {
        addCoin({
          username: data.username,
          coin: data.coin
        })
      } catch (error) {
        console.log(error);
        
      }
    }

    return (
      <>
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
      <div className="grid h-full relative bg-[#e9ebf8] dark:bg-[#1a1a1d] grid-cols-12">
        
          <div className="sidebar fixed bottom-0 flex-row gap-2 sm:gap-8 md:gap-0 items-center w-full  bg-white dark:bg-[#1a1a1d] z-10 md:z-0 h-16 md:h-full flex md:flex-col md:justify-start md:sticky md:top-0 max-h-screen md:col-span-1 lg:col-span-2 border-r-2 border-violet-300 dark:border-[#27272a] lg:px-4 md:pb-5">
            <div className="logo py-5 hidden md:flex justify-center">
              <Link to="/trader">
                <FaHandHoldingHand className="w-9 lg:h-14 h-9 text-dos lg:w-14 drop-shadow-2xl"/>  
              </Link>
            </div>
            <div className="links w-full text-gray-700 dark:text-[#fafafa] sm:gap-8 md:pt-10 md:grow flex items-center md:items-start flex-row md:flex-col gap-2 md:gap-2">
              <button onClick={() => setIsOpenAddCoin(true)} className="icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-gray-300 dark:hover:bg-zinc-300 w-full md:px-3 md:py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-3">
                <LuPlusSquare className="w-8 h-8"/>
                <h2 className='hidden lg:block text-lg font-semibold'>Add Coin</h2>
              </button>
            </div>

            <div className="menu md:justify-self-end md:w-full md:py-5 text-gray-700 dark:text-[rgb(250,250,250)]">
              <div className="font-semibold py-2 px-2 text-center hover:bg-violet-600 dark:hover:bg-zinc-600 hover:opacity-40 dark:hover:opacity-100 rounded-md" onClick={handleLogout}>Logout</div>
            </div>
          </div>
          <div className="main min-h-screen col-span-12 md:col-span-11 lg:col-span-10">
            <Outlet/>
          </div>

          {/* ADD COIN MODAL */}
          <Modal open={isOpenAddCoin} onClose={() => setIsOpenAddCoin(false)} >
            <div className="cont p-5 max-h-screen text-gray-700 dark:text-gray-100 bg-white dark:bg-[#212225]  overflow-y-auto font-body md:w-full">
              <h1 className='font-bold text-center pb-5 font-pop'>ADD COIN</h1>
              <form onSubmit={handleSubmit(handleAdd)} className='flex flex-col'>
                <div className="flex  items-start flex-col">
                  <label className='text-sm'>Account username</label>
                  <input type="text" className='py-2 px-5 text-sm focus:outline-none bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md ' {...register("username")} placeholder='Account username' />
                  {errors.username && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.username.message}
                    </span>
                  )}
                  <label className='text-sm'>Coin</label>
                  <input minLength={1} maxLength={9} type="text" className='py-2 text-sm px-5 focus:outline-none bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md ' {...register("coin")} placeholder='Coin' />
                  {errors.coin && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.coin.message}
                    </span>
                  )}
                </div>
                

                {isCoinAdding
                  ? <button disabled className='font-bold py-2 mt-2 text-white rounded-lg bg-yellow-500'>Adding</button>
                  : <button type="submit" className='font-bold py-2 mt-2 text-white rounded-lg bg-yellow-500'>Add</button>
                  
                }
              </form>
                <button onClick={() => setIsOpenAddCoin(false)} className='font-bold py-2 text-white rounded-lg w-full bg-gray-500 mt-2'>Cancel</button>
            </div>
          </Modal>
          {/* ADD COIN MODAL */}
      </div>
      </>
    )
    
}