import { BiSearch } from "react-icons/bi"
import { ToastContainer } from "react-toastify"
import categories from "../../assets/categories.json"
import { useItem, useItems } from "../../hooks/queries/useItem";
import { useMemo, useState } from "react";
import Carousel from "../../components/Carousel";
import {IoLocationSharp} from 'react-icons/io5'
import { FaAngleLeft } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "../../../@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function Market() {
  const [categoryQuery, setCategoryQuery] = useState<string | null>(null)
  const [isItemSliderOpen, setIsItemSliderOpen] = useState<boolean>(false)
  const itemsQuery = useItems()

  const {mutate:getItem, data: gettedItemData} = useItem()

  const byCategory = useMemo(() => {
    if (categoryQuery) {
      return itemsQuery?.data.filter((item:any) => item.category === categoryQuery);
    }
    // If no category is selected, return all items
    return itemsQuery?.data;
  }, [categoryQuery, itemsQuery]);
  
  function getCategory(category: string | null){
    setIsItemSliderOpen(false)
    if(category === "All"){
      setCategoryQuery(null)
    }else{
      setCategoryQuery(category)
    }
  }

  function handleItemDetails(itemId: string){
    getItem(itemId)
    setIsItemSliderOpen(true)
    
  }

  return (
    <div className="min-h-screen overflow-y-auto w-full">
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
      <nav className="grid grid-cols-9 z-20 bg-[#E7AD99] dark:bg-[#495867] sticky top-0  place-content-center w-full place-items-center py-3 border-b-2 border-violet-300 dark:border-[#262626]">
        <div className="search-bar flex items-center w-full h-full col-start-3 col-end-7">
            <input type="search" placeholder="Search in BandB" className=" bg-gray-200/70 dark:bg-zinc-700 px-3 py-3 h-full rounded-l-md  focus:border-indigo-400 outline-none font-regular text-gray-900 dark:text-gray-100 w-full" />
            <div className="search-icon flex items-center justify-center pl-3 pr-2 rounded-r-md h-full bg-orange-300 dark:bg-orange-900">
              <BiSearch className="text-white w-7 h-7" />
            </div>
        </div>
      </nav>
      <h2 className="text-white py-10 text-center text-xl uppercase tracking-widest font-extrabold">Market</h2>
      <div className="body px-5 max-h-40 w-full grid grid-cols-12 grid-flow-row">
        <div className="category-nav bg-[#C18C5D] col-span-3 lg:col-span-2 flex flex-col items-start text-white  gap-1 rounded-lg">
          <h3 className="text-center w-full border-violet-400 dark:border-[#262626] uppercase font-bold border-b-[1px] py-4">Categories</h3>
          <hr className="bg bg-gray-500" />
          {categories.map((category) => (
            <button onClick={() => getCategory(category.category)} key={category.id} className="category py-2 px-5 font-semibold w-full text-left  dark:hover:bg-zinc-700 hover:bg-[#ECC8AF] text-sm rounded-sm hover:text-violet-500">
              {category.category}
            </button>
          ))}
        </div>
        <div className={`items-category relative  grid  gap-3 px-5 pb-5 col-span-9 lg:col-span-10 rounded-xl  ${isItemSliderOpen ? '' : 'overflow-hidden'} ${byCategory?.length === 0 ? 'grid-cols-1' : 'grid-cols-3 lg:grid-cols-4'}`}>
              <div className={`organizations ml-5 bg-[#C18C5D] rounded-md w-full min-h-full absolute top-0 left-0 z-10 ${ isItemSliderOpen ? 'translate-x-0' : 'translate-x-full'} transition-all duration-500`}>
                <div className="close flex">
                  <button onClick={() => setIsItemSliderOpen(false)} className="p-5 rounded-xl">
                    <FaAngleLeft className="w-6 h-6 text-gray-400 dark:text-gray-300"/>
                  </button>
                </div>
                <div className="item px-3 pb-4">
                  <div className=" rounded-lg overflow-hidden bg-white ">
                    {gettedItemData?.image.length > 1
                      ? <Carousel slides={gettedItemData?.image} height='h-[30rem]' object="object-contain"/>
                      : <img src={gettedItemData?.image} alt={gettedItemData?.name} className="h-[30rem] min-w-full object-contain" />
                    }
                  </div>
                  <h3 className="text-xl text-white py-3 font-pop font-semibold capitalize">{gettedItemData?.name}</h3>
                  <h6 className="text text-white opacity-80 font-pop font-semibold capitalize">₱{gettedItemData?.price}</h6>
                  <h6 className="text-sm text-white opacity-80  capitalize">Listed in {gettedItemData?.location}</h6>
                  <div className="details text-white">
                    <h2 className="text-center" >Details</h2>
                    <h5 className="condition opacity-90">Condition: {gettedItemData?.condition}</h5>
                    <p className="details indent-10 p-5">{gettedItemData?.details}</p>
                    <hr className=" opacity-30" />
                    <div className="seller">
                      <h5 className="condition opacity-90 py-3">Trader information</h5>

                      <Avatar className='flex items-center w-full h-full gap-3'>
                        <AvatarImage className="w-8 h-8 object-cover rounded-full" src={gettedItemData?.user.profile} />
                        <AvatarFallback className="bg-dos w-8 h-8 text-white uppercase">{gettedItemData?.user.fullname.slice(0,2)}</AvatarFallback>
                        <h3 className="capitalize">{gettedItemData?.user.fullname}</h3>
                      </Avatar>
                    </div>
                    <Link to={`/trader/${gettedItemData?.user.username}`} className="py-3 mt-6 font-extrabold uppercase text-white text-center bg-indigo-700 w-full block rounded-lg">Contact Trader</Link>
                  </div>
                </div>
            </div>
            {byCategory?.length === 0
              ? <div className="no-items place-self-center dark:text-gray-400 uppercase font-semibold text-sm">Items not found</div>
              : byCategory?.map((item:any) => (
                <div key={item?.id} className="item text-gray-100 bg-[#C18C5D] rounded-md overflow-hidden flex flex-col shadow-lg h-fit pb-3">
                  <Carousel slides={item.image} height="h-40" object="object-cover"/>
                  <div className="flex-1 px-3 flex flex-col">
                    <div className=" pt-3 text-white font-extrabold capitalize">₱{item.price}</div>
                    <h2 className="font-bold opacity-80 truncate">{item.name}</h2>
                    <div className="text-xs opacity-50 flex font-light capitalize truncate">
                      <IoLocationSharp className="w-4 h-4" />
                      <h4>{item.location}</h4>
                    </div>
                    <button onClick={() => handleItemDetails(item.id)} className="p-2 bg-[#ECC8AF] text-white shadow-md font-extrabold rounded-md mt-2">Details</button>
                  </div>
                </div>
              ))
            }
        </div>
      </div>
    </div>
  )
}
