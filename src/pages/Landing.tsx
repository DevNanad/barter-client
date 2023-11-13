import { ToastContainer } from "react-toastify"
import categories from "../assets/categories.json"
import {  useItems } from "../hooks/queries/useItem";
import { useMemo, useState } from "react";
import Carousel from "../components/Carousel";
import {IoLocationSharp} from 'react-icons/io5'
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export default function Landing() {
  const [categoryQuery, setCategoryQuery] = useState<string | null>(null)
  const [isItemSliderOpen, setIsItemSliderOpen] = useState<boolean>(false)
  const itemsQuery = useItems()
  const navigate = useNavigate();

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

  function handleItemDetails(){
    navigate('/signup')
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
      <Navbar>
        <Link to="/login" className='p-2'>Login</Link>
        <Link to="/signup" className='p-2'>Signup</Link>
      </Navbar>

      <h2 className="text-black dark:text-gray-100 py-10 text-center text-xl  tracking-widest font-extrabold">Market</h2>
      <div className="body px-5 max-h-40 w-full grid grid-cols-12 grid-flow-row">
        <div className="category-nav bg-white dark:bg-[#212225] shadow-lg col-span-3 lg:col-span-2 flex flex-col items-start text-[#00171f] dark:text-gray-200 gap-1 rounded-lg">
          <h3 className="text-center w-full border-violet-400 dark:border-[#262626] uppercase font-bold border-b-[1px] py-4">Categories</h3>
          <hr className="bg bg-gray-500" />
          {categories.map((category) => (
            <button onClick={() => getCategory(category.category)} key={category.id} className="category py-2 px-5 font-semibold w-full text-left  dark:hover:bg-zinc-700 hover:bg-gray-100 text-sm rounded-sm hover:text-violet-500">
              {category.category}
            </button>
          ))}
        </div>
        <div className={`items-category relative  grid  gap-3 px-5 pb-5 col-span-9 lg:col-span-10 rounded-xl  ${isItemSliderOpen ? '' : 'overflow-hidden'} ${byCategory?.length === 0 ? 'grid-cols-1' : 'grid-cols-3 lg:grid-cols-4'}`}>
            {byCategory?.length === 0
              ? <div className="no-items place-self-center dark:text-gray-400 uppercase font-semibold text-sm">Items not found</div>
              : byCategory?.map((item:any) => (
                <div key={item?.id} className="item text-gray-600 dark:text-gray-400 bg-white dark:bg-[#212225] rounded-md overflow-hidden flex flex-col shadow-lg h-fit pb-3">
                  <Carousel slides={item.image} height="h-40" object="object-cover"/>
                  <div className="flex-1 px-3 flex flex-col">
                    <div className=" pt-3 text-black dark:text-[#d2d2d3] font-extrabold capitalize">₱{item.price}</div>
                    <h2 className="font-bold opacity-80 truncate">{item.name}</h2>
                    <div className="text-xs opacity-50 flex font-light capitalize truncate">
                      <IoLocationSharp className="w-4 h-4" />
                      <h4>{item.location}</h4>
                    </div>
                    <button onClick={() => handleItemDetails()} className="p-2 bg-dos text-white shadow-md font-extrabold rounded-md mt-2 opacity-80">Details</button>
                  </div>
                </div>
              ))
            }
        </div>
      </div>
    </div>
  )
}
