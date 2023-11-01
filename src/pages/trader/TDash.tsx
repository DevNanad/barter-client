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
import { ChangeEvent, ReactNode, useState } from 'react'
import Modal from '../../components/Modal'
import { ZodType, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { uploadCloudinary } from '../../api/upload'
import { ToastContainer } from 'react-toastify'
import Radio, { RadioGroup } from "../../components/Radio"
import { Sparkle, Gem, Crown } from "lucide-react"
import StripeContainer from '../../components/StripeContainer'

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
      <div className="grid h-full bg-[#E7AD99] dark:bg-[#495867] grid-cols-12">
        
          <div className="sidebar flex flex-col justify-start sticky top-0 max-h-screen md:col-span-1 lg:col-span-2 border-r-2 border-violet-300 dark:border-[#27272a] lg:px-4 pb-5">
            <div className="logo py-5 flex justify-center">
              <Link to="/trader">
                <FaHandHoldingHand className="w-9 lg:h-14 h-9 lg:w-14 drop-shadow-2xl text-uno"/>  
              </Link>
            </div>
            <div className="links text-uno dark:text-[#fafafa] pt-10 grow flex flex-col gap-2">
              <NavLink to='/trader' className="icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-[#ECC8AF] dark:hover:bg-zinc-900 px-3 py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-3" end>
                <LuShoppingCart className="w-8 h-8"/>
                <h2 className='hidden lg:block text-lg font-semibold'>Market</h2>
              </NavLink>
              <button onClick={handleAddItem} className="icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-[#ECC8AF] dark:hover:bg-zinc-900 px-3 py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-3">
                <LuPlusSquare className="w-8 h-8"/>
                <h2 className='hidden lg:block text-lg font-semibold'>Add Item</h2>
              </button>
              <NavLink  to={`/trader/${traderQuery?.data?.trader?.username}`} className={`icons-link cursor-pointer hover:text-dos ease-in-out hover:bg-[#ECC8AF] dark:hover:bg-zinc-900 px-3 py-2 rounded-md flex items-center justify-center lg:justify-start lg:gap-2`}>
                <Avatar className='flex items-center justify-center'>
                  <AvatarImage className="w-8 h-8 object-cover rounded-full" src={traderQuery?.data?.trader?.profile} />
                  <AvatarFallback className="bg-dos w-8 h-8 text-white uppercase">{traderQuery?.data?.trader?.fullname.slice(0,2)}</AvatarFallback>
                </Avatar>
                <h2 className='hidden lg:block text-lg font-semibold'>Profile</h2>
              </NavLink>
            </div>

            <div className="menu justify-self-end w-full py-5 text-uno dark:text-[#fafafa]">
              <Popover>
                <PopoverTrigger className='w-full'>
                  <div className='flex cursor-pointer items-center justify-center lg:justify-start lg:gap-3 hover:text-dos ease-in-out hover:bg-violet-200 dark:hover:bg-zinc-900 rounded-md px-3 py-2 w-full'>
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
          <div className="main min-h-screen col-span-11 lg:col-span-10">
            <Outlet/>
          </div>

          {/* ADD ITEM MODAL */}
          <Modal open={isOpenAddItem} onClose={() => setIsOpenAddItem(false)} >
            <div className="cont p-5 bg-white font-body w-full">
              <h1 className='font-bold text-center pb-5 font-pop'>ADD ITEM</h1>
              <form onSubmit={handleSubmit(handleAdd)} className='flex flex-col'>
                <div className="flex items-center gap-5">
                  <label>Item Name</label>
                  <input type="text" className='py-2 px-5 focus:outline-none bg-gray-200 border-2 rounded-md ' {...register("name")} placeholder='Item name' />
                  {errors.name && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.name.message}
                    </span>
                  )}
                  <label>Price</label>
                  <input type="text" className='py-2 px-5 focus:outline-none bg-gray-200 border-2 rounded-md ' {...register("price")} placeholder='Price' />
                  {errors.price && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.price.message}
                    </span>
                  )}
                </div>
                <div className="details-conditions flex flex-col">
                  <label>Details</label>
                  <textarea className='p-3 resize-none bg-gray-200 focus:outline-none rounded-md' placeholder='More details...' rows={2} {...register("details")}/>
                  {errors.details && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.details.message}
                    </span>
                  )}
                  <div className="cat-con flex gap-5 py-3">
                    <div className="cat flex-1">
                      <label>Category</label>
                      <select {...register("category")} className=" sm:w-full rounded-lg focus:border-indigo-400 outline-none bg-gray-200  py-2 px-4 ">
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
                      <label>Condition</label>
                      <select {...register("condition")} className=" sm:w-full bg-gray-200 rounded-lg focus:outline-none  py-2 px-4 ">
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
                  <label>Location / Address</label>
                  <input {...register("location")} type="text" className='py-2 px-5 focus:outline-none bg-gray-200 border-2 rounded-md ' placeholder='Location' />
                  {errors.location && (
                    <span className="text-red-400 text-center text-sm">
                      {errors.location.message}
                    </span>
                  )}
                </div>
                <div className="images py-4">
                  <h2 className=' text-center font-semibold'>Image</h2>
                  <input type="file" multiple onChange={handleImageChange} accept='image/*' className='block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100' />

                  <div className="images-preview sm:max-w-[40rem] p-4 h-32 overflow-y-auto">
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
            </div>
          </Modal>
          {/* ADD ITEM MODAL */}
          {/* PRICING MODAL */}
          <Modal open={isOpenPricing} onClose={() => setIsOpenPricing(false)}>
            <div className="bg-white p-5">
              <h2 className="text-2xl font-bold text-center tracking-tight">Choose Your Plan</h2>
              <hr className="my-3" />
              <RadioGroup value={plan} onChange={(e:ChangeEvent<HTMLInputElement>) => setPlan(e.target.value)}>
                <div className="flex flex-col md:grid grid-cols-3 gap-4 justify-center">
                  <Radio value="basic">
                    <Plan
                      icon={<Sparkle />}
                      title="Basic"
                      features={["5 Coins"]}
                      price={5}
                    />
                  </Radio>
                  <Radio value="standard">
                    <Plan
                      icon={<Gem />}
                      title="Standard"
                      features={["21 Coins"]}
                      price={20}
                    />
                  </Radio>
                  <Radio value="premium">
                    <Plan
                      icon={<Crown />}
                      title="Premium"
                      features={["105 coins"]}
                      price={100}
                    />
                  </Radio>
                </div>
              </RadioGroup>
              <hr className="my-3" />

              <div className="card pt-5">
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
      </div>
      </>
    )
    
}

interface PlanProps {
  icon: ReactNode;
  title: string;
  features: string[];
  price: number;
}

function Plan({ icon, title, features, price }: PlanProps) {
  return (
    <div className="flex gap-4 items-center">
      {icon}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm">{features.join(" · ")}</p>
      </div>
      <span className="ml-auto font-medium">${price}</span>
    </div>
  );
}