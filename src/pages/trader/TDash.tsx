import { useAddItem, useClaimCoupon, useTrader } from '../../hooks/queries/useTrader'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {LuMenu, LuPlusSquare, LuShoppingCart} from 'react-icons/lu'
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
import Modal from '../../components/Modal'
import { ZodType, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadCloudinary } from '../../api/upload'
import { ToastContainer } from 'react-toastify'
import StripeContainer from '../../components/StripeContainer'
import { useState } from 'react'

type AddItemFormData = {
  name: string;
  price: string;
  details: string;
  category: string;
  condition: string;
  location: string;
}
type ClaimCouponFormData = {
  coupon: string;
}

export default function TDash() {
    const {user_id} = useAuthStore((state) => state)
    const traderQuery = useTrader(user_id)
    const {mutate:addItem} = useAddItem()
    const { setTheme } = useTheme()

    const [isItemAdding, setIsItemAdding] = useState(false)
    const [isOpenAddItem, setIsOpenAddItem] = useState(false)
    const [isOpenPricing, setIsOpenPricing] = useState(false)
    const [isOpenCoupon, setIsOpenCoupon] = useState(false)
    const [isOpenContact, setIsOpenContact] = useState(false)
    const [images, setImages] = useState([])
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const [plan, setPlan] = useState("")

    const logout = useLogout()
    async function handleLogout(){
      await logout()
    }

    const schema: ZodType<AddItemFormData> = z.object({
      name: z.string().min(1, {message: "Item name is required"}).max(255),
      price: z.string().regex(/^\d+$/, { message: "Price must be number" }).min(1, {message: "Price is required"}).max(20),
      details: z.string().min(1, {message: "Details is required"}).max(1000),
      category: z.string().min(1, {message: "Category is required"}).max(100),
      condition: z.string().min(1, {message: "Condition is required"}).max(100),
      location: z.string().min(1, {message: "Location is required"}).max(500),
    })
    const {register, handleSubmit, reset: addItemReset, formState:{errors}} = useForm<AddItemFormData>({resolver: zodResolver(schema)})
    
    const couponSchema: ZodType<ClaimCouponFormData> = z.object({
      coupon: z.string().min(1, {message: "Coupon code required"}).max(255),
    })
    const {register:couponRegister, handleSubmit: handleCouponSubmit, formState:{errors:couponErrors}} = useForm<ClaimCouponFormData>({resolver: zodResolver(couponSchema)})

    function handleAddItem(){
      if(traderQuery?.data?.trader.username){
        if(traderQuery?.data?.trader.coin > 0){
          //continue to add item
          setIsOpenAddItem(true);
        }else{
          //pop up pricing
          setIsOpenPricing(true)
        }
        
      }
      
    }

    function handleImageChange(e:any){
      if (e.target.files) {
        setImages(e.target.files)
        const files: FileList = e.target.files;
        const imageArray: string[] = [];
  
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
  
          reader.onload = (event) => {
            const imageData: string = event.target!.result as string;
            imageArray.push(imageData);
  
            if (imageArray.length === files.length) {
              setSelectedImages([...selectedImages, ...imageArray]);
            }
          };
  
          reader.readAsDataURL(files[i]);
        }
      }
    };

    async function handleAdd(data: AddItemFormData) {

      try {
        setIsItemAdding(true)
        let arr: { public_id: any; url: any; }[] = []
        for(let i = 0; i < images.length; i++) {
          const data = await uploadCloudinary(images[i])
          arr.push(data)
        }

        const arrayOfImages = arr.map(img => img.url)
        
        if(arrayOfImages){
          //upload item to database
          addItem({
            name: data.name,
            price: data.price,
            details: data.details,
            category: data.category,
            condition: data.condition,
            location: data.location,
            user_id,
            image: arrayOfImages
          }, {
            onSettled(data) {
                setIsItemAdding(false)
                if(data.message === 'success'){
                  setIsOpenAddItem(false)
                  addItemReset()
                } 
            }
          })
        }
      } catch (error) {
        setIsItemAdding(false)
        console.log(error);
        
      }
      
    }
    function handleCoupon(){
      console.log("click");
      setIsOpenCoupon(true)
      
    }

    const {mutate: claimCoupon, isLoading: isClaiming} = useClaimCoupon()

    function handlClaimCoupon(data: ClaimCouponFormData){
      claimCoupon({
        coupon_code: data.coupon,
        user_id: user_id
        }
      )
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
              <NavLink to='/trader' className="icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-gray-300 w-full dark:hover:bg-zinc-300 md:px-3 md:py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-3" end>
                <LuShoppingCart className="w-8 h-8"/>
                <h2 className='hidden lg:block text-lg font-semibold'>Market</h2>
              </NavLink>
              <button onClick={handleAddItem} className="icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-gray-300 dark:hover:bg-zinc-300 w-full md:px-3 md:py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-3">
                <LuPlusSquare className="w-8 h-8"/>
                <h2 className='hidden lg:block text-lg font-semibold'>Add Item</h2>
              </button>
              <NavLink  to={`/trader/${traderQuery?.data?.trader?.username}`} className={`icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-gray-300 dark:hover:bg-zinc-300 w-full md:px-3 md:py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-2`}>
                <Avatar className='flex items-center justify-center'>
                  <AvatarImage className="w-8 h-8 object-cover rounded-full" src={traderQuery?.data?.trader?.profile} />
                  <AvatarFallback className="bg-dos w-8 h-8 text-white uppercase">{traderQuery?.data?.trader?.fullname.slice(0,2)}</AvatarFallback>
                </Avatar>
                <h2 className='hidden lg:block text-lg font-semibold'>Profile</h2>
              </NavLink>
            </div>

            <div className="menu md:justify-self-end md:w-full md:py-5 text-gray-700 dark:text-[#fafafa]">
              <Popover>
                <PopoverTrigger className='w-full'>
                  <div className='flex cursor-pointer items-center justify-center lg:justify-start lg:gap-3 hover:text-dos ease-in-out hover:bg-violet-200 dark:hover:bg-zinc-900 rounded-md md:px-3 md:py-2 w-full'>
                    <LuMenu className="w-8 h-8"/>
                    <h2 className='hidden lg:block text-lg font-semibold'>More</h2>
                  </div>
                </PopoverTrigger>
                <PopoverContent className='bg-transparent border-0 shadow-none'>
                  <ul className="px-2 py-3 divide-y divide-violet-500 dark:divide-zinc-700 dark:bg-[#27272a] flex flex-col rounded-md text-white bg-dos border-2 border-violet-400 dark:border-zinc-700 shadow-lg">
                    <div onClick={() => setIsOpenPricing(true)} className="py-2 flex mb-3 cursor-pointer shadow-sm items-center justify-around bg-yellow-100 dark:bg-zinc-600 rounded-lg">
                      <h2 className="font-semibold text-dos dark:text-violet-400">Coins:</h2>
                      <div className="coinnn flex gap-1 items-center justify-center">
                        <p className="fon font-semibold text-md text-gray-900 dark:text-white">{traderQuery?.data?.trader?.coin}</p>
                        
                      </div>
                    </div>
                    
                    <button onClick={() => handleCoupon()} className="font-semibold py-2 px-10 hover:bg-violet-600 dark:hover:bg-zinc-600 hover:opacity-40 dark:hover:opacity-100 rounded-md">Coupon</button>

                    <button onClick={() => setIsOpenContact(true)} className="font-semibold py-2 px-10 hover:bg-violet-600 dark:hover:bg-zinc-600 hover:opacity-40 dark:hover:opacity-100 rounded-md">Contact</button>
                    
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
                        <DropdownMenuContent className='z z-20' align="end">
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
          <div className="main min-h-screen col-span-12 md:col-span-11 lg:col-span-10">
            <Outlet/>
          </div>

          {/* ADD ITEM MODAL */}
          <Modal open={isOpenAddItem} onClose={() => setIsOpenAddItem(false)} >
            <div className="cont p-5 max-h-screen text-gray-700 dark:text-gray-100 bg-white dark:bg-[#212225]  overflow-y-auto font-body md:w-full">
              <h1 className='font-bold text-center pb-5 font-pop'>ADD ITEM</h1>
              <form onSubmit={handleSubmit(handleAdd)} className='flex flex-col'>
                <div className="flex md:items-center items-start flex-col md:flex-row md:gap-5">
                  <label className='text-sm'>Item Name</label>
                  <input type="text" className='py-2 px-5 text-sm focus:outline-none bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md ' {...register("name")} placeholder='Item name' />
                  {errors.name && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.name.message}
                    </span>
                  )}
                  <label className='text-sm'>Price</label>
                  <input type="text" className='py-2 text-sm px-5 focus:outline-none bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md ' {...register("price")} placeholder='Price' />
                  {errors.price && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.price.message}
                    </span>
                  )}
                </div>
                <div className="details-conditions flex flex-col">
                  <label className="text-sm">Details</label>
                  <textarea className='px-3 py-1 h-20 text-sm resize-none focus:outline-none bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md' placeholder='More details...' rows={1} cols={1} {...register("details")}/>
                  {errors.details && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.details.message}
                    </span>
                  )}
                  <div className="cat-con md:flex gap-5 py-3">
                    <div className="cat flex-1">
                      <label className="text-sm">Category</label>
                      <select {...register("category")} className=" sm:w-full text-sm rounded-lg focus:border-indigo-400 bg-transparent border-2 border-gray-300 dark:border-gray-600 outline-none  py-2 px-4 ">
                            <option className="bg-transparent rounded dark:bg-[#313131] dark:text-gray-300" value="">Select item Category</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Electronic Devices">Electronic Devices</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Electronic Accessories">Electronic Accessories</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="TV & Home Appliances">TV & Home Appliances</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Health & Beauty">Health & Beauty</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Babies & Toys">Babies & Toys</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Home & Living">Home & Living</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Fasion">Fasion</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Sports & Lifestyle">Sports & Lifestyle</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Automotive & Motorcycles">Automotive & Motorcycles</option>
                      </select>
                      {errors.category && (
                        <span className="text-red-400 text-center text-sm">
                          {errors.category.message}
                        </span>
                      )}
                    </div>
                    
                    <div className="con flex-1">
                      <label className="text-sm">Condition</label>
                      <select {...register("condition")} className=" sm:w-full text-sm rounded-lg focus:outline-none bg-transparent border-2 border-gray-300 dark:border-gray-600  py-2 px-4 ">
                            <option className="bg-transparent rounded dark:bg-[#313131] dark:text-gray-300" value="">Select item Condition</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="New">New</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Used">Used</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Refurbished">Refurbished</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="For Parts">For Parts</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Antique/Vintage">Antique/Vintage</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Custom/Handmade">Custom/Handmade</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Certified">Certified</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Open Box">Open Box</option>
                            <option className="bg-transparent dark:bg-[#313131] dark:text-gray-300" value="Unboxed">Unboxed</option>
                      </select>
                      {errors.condition && (
                        <span className="text-red-400 text-center text-sm">
                          {errors.condition.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="location flex flex-col">
                  <label className="text-sm">Location / Address</label>
                  <input {...register("location")} type="text" className='py-2 px-5 focus:outline-none bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md ' placeholder='Location' />
                  {errors.location && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.location.message}
                    </span>
                  )}
                </div>
                <div className="images py-2">
                  <h2 className=' text-center font-semibold'>Image</h2>
                  <input type="file" multiple onChange={handleImageChange} accept='image/*' className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' />

                  <div className="images-preview md:max-w-[40rem] px-4 md:h-32 overflow-y-auto">
                  {selectedImages.map((imageData, index) => (
                    <img key={index} className='h-12 inline rounded-md' src={imageData} alt={`Selected ${index}`} />
                  ))}
                  </div>
                </div>

                {isItemAdding
                  ? <button disabled className='font-bold py-2 text-white rounded-lg bg-green-500'>Adding</button>
                  : <button type="submit" className='font-bold py-2 text-white rounded-lg bg-green-500'>Add</button>
                  
                }

                
              </form>
              <button onClick={() => setIsOpenAddItem(false)} className='font-bold py-2 text-white rounded-lg w-full bg-gray-500 mt-2'>Cancel</button>
            </div>
          </Modal>
          {/* ADD ITEM MODAL */}
          {/* PRICING MODAL */}
          <Modal open={isOpenPricing} onClose={() => setIsOpenPricing(false)}>
            <div className="bg-white px-5 py-3">
              <h2 className="text-2xl font-bold text-center tracking-tight">TopUp Coin</h2>
              <div className="note">
                <h5 className='opacity-70 text-center text-sm'>1 Coin is 5 pesos, please indicate username.</h5>
              </div>
              <div className="gcash flex gap-2 font-semibold items-center">
                <img src="https://1000logos.net/wp-content/uploads/2023/05/GCash-Logo.png" className='h-10' />
                <h3>09481320004</h3>
              </div>
              <hr />
              <div className="coin flex flex-col">
                <h2 className='text-center pt-2 font-bold'>Card</h2>
                <div className="note">
                  <h5 className='opacity-70 text-center text-sm'>Dollar base, minimum $0.50 or 6 Coins</h5>
                </div>
                <label>Enter number of coin</label>
                <input className='py-1 font-bold px-5 text-lg focus:outline-none bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-md ' value={plan} onChange={(e:any) => setPlan(e.target.value)} type="text" />

              </div>
              <div className="card py-1">
                <StripeContainer plan={plan}/>
              </div>
            </div>
          </Modal>
          {/* PRICING MODAL */}
          {/* COUPON MODAL */}
          <Modal open={isOpenCoupon} onClose={() => setIsOpenCoupon(false)}>
            <div className="coupon p-5 gap-5 bg-white ">
              <form onSubmit={handleCouponSubmit(handlClaimCoupon)} className='flex flex-col gap-5'>  
                <h3 className='font-bold text-center'>Enter a Coupon to redeem</h3>
                <input {...couponRegister("coupon")} type="text" className='py-3 p-5 bg-gray-200 rounded-lg' />
                {couponErrors.coupon && (
                    <span className="text-red-400 text-center text-sm">
                      {couponErrors.coupon.message}
                    </span>
                  )}
                {isClaiming
                  ? <button disabled className='py-2 text-center bg-blue-500 text-white uppercase  font-extrabold rounded-lg'>Redeeming...</button>
                  : <button type='submit' className='py-2 text-center bg-blue-500 text-white uppercase  font-extrabold rounded-lg'>Redeem</button>
                }
              </form>
            </div>
          </Modal>
          {/* COUPON MODAL */}
          {/* CONTACT MODAL */}
          <Modal open={isOpenContact} onClose={() => setIsOpenContact(false)}>
            <div className="contact p-5 gap-5 bg-white ">
              <h1 className='text-lg text-center font-bold pb-5'>Contact Us</h1>
              <h5 className='break-words'>If you have any concerns just contact us @ <span className='text-blue-400'>contactbarterb@gmail.com</span></h5>
            </div>
          </Modal>
          {/* CONTACT MODAL */}
      </div>
      </>
    )
    
}