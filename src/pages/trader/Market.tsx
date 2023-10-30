import { BiSearch } from "react-icons/bi"
import { ToastContainer } from "react-toastify"
import categories from "../../assets/categories.json"
import { useItems } from "../../hooks/queries/useItem";
import { useMemo, useState } from "react";
import Carousel from "../../components/Carousel";
import {IoLocationSharp} from 'react-icons/io5'

export default function Market() {
  const [categoryQuery, setCategoryQuery] = useState<string | null>(null)
  const itemsQuery = useItems()

  const byCategory = useMemo(() => {
    if (categoryQuery) {
      return itemsQuery?.data.filter((item:any) => item.category === categoryQuery);
    }
    // If no category is selected, return all items
    return itemsQuery?.data;
  }, [categoryQuery, itemsQuery]);
  
  function getCategory(category: string | null){
    if(category === "All"){
      setCategoryQuery(null)
    }else{
      setCategoryQuery(category)
    }
  }

  function handleItemDetails(itemId: string){
    console.log(itemId);
    
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
      <nav className="grid grid-cols-9 sticky top-0  place-content-center w-full place-items-center py-3 dark:bg-[#09090b] border-b-2 border-violet-300 dark:border-[#262626]">
        <div className="search-bar flex items-center w-full h-full col-start-3 col-end-7">
            <input type="search" placeholder="Search in BandB" className=" bg-gray-200/70 dark:bg-zinc-700 px-3 py-3 h-full rounded-l-md  focus:border-indigo-400 outline-none font-regular text-gray-900 dark:text-gray-100 w-full" />
            <div className="search-icon flex items-center justify-center pl-3 pr-2 rounded-r-md h-full bg-orange-300 dark:bg-orange-900">
              <BiSearch className="text-white w-7 h-7" />
            </div>
        </div>
      </nav>
      <h2 className="dark:text-white py-10 text-center text-xl uppercase tracking-widest font-extrabold">Market</h2>
      <div className="body px-5 max-h-40 w-full grid grid-cols-12 grid-flow-row">
        <div className="category-nav col-span-3 lg:col-span-2 flex flex-col items-start dark:text-gray-300  gap-1 rounded-l-lg">
          <h3 className="text-center w-full border-violet-400 dark:border-[#262626] uppercase font-bold border-b-[1px] pb-4">Categories</h3>
          <hr className="bg bg-gray-500" />
          {categories.map((category) => (
            <button onClick={() => getCategory(category.category)} key={category.id} className="category py-2 px-5 font-semibold w-full text-left  dark:hover:bg-zinc-700 text-sm rounded-sm hover:text-violet-500">
              {category.category}
            </button>
          ))}
        </div>
        <div className={`items-category grid  gap-3 p-5 col-span-9 lg:col-span-10 rounded-xl dark:dark:bg-zinc-900 ${byCategory?.length === 0 ? 'grid-cols-1' : 'grid-cols-3 lg:grid-cols-4'}`}>
            {byCategory?.length === 0
              ? <div className="no-items place-self-center dark:text-gray-400 uppercase font-semibold text-sm">Items not found</div>
              : byCategory?.map((item:any) => (
                <div key={item.id} className="item text-gray-100 bg-[#202124] rounded-md overflow-hidden flex flex-col shadow-lg h-fit pb-3">
                  <Carousel slides={item.image} />
                  <div className="flex-1 px-3 flex flex-col">
                    <div className=" pt-3 text-white font-extrabold capitalize">₱{item.price}</div>
                    <h2 className="font-bold opacity-80 truncate">{item.name}</h2>
                    <div className="text-xs opacity-50 flex font-light capitalize truncate">
                      <IoLocationSharp className="w-4 h-4" />
                      <h4>{item.location}</h4>
                    </div>
                    <button onClick={() => handleItemDetails(item.id)} className="p-2 bg-indigo-900 font-extrabold rounded-md mt-2">Details</button>
                  </div>
                </div>
              ))
            }
        </div>
      </div>
    </div>
  )
}
