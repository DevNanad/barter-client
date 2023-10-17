import { BiSearch } from "react-icons/bi"
import { ToastContainer } from "react-toastify"
import categories from "../../assets/categories.json"

export default function Market() {

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
      <nav className="grid grid-cols-9 fixed top-0 place-content-center w-full place-items-center py-3 dark:bg-[#09090b] border-b-2 border-violet-300 dark:border-[#262626]">
        <div className="search-bar flex items-center w-full h-full col-start-3 col-end-7">
            <input type="search" placeholder="Search in BandB" className=" bg-gray-200/70 dark:bg-zinc-700 px-3 py-3 h-full rounded-l-md  focus:border-indigo-400 outline-none font-regular text-gray-900 dark:text-gray-100 w-full" />
            <div className="search-icon flex items-center justify-center pl-3 pr-2 rounded-r-md h-full bg-orange-300 dark:bg-orange-900">
              <BiSearch className="text-white w-7 h-7" />
            </div>
        </div>
      </nav>
      <div className="body px-5 pt-28 min-h-screen grid grid-cols-12 grid-flow-row">
        <div className="category-nav col-span-3 lg:col-span-2 flex flex-col items-start dark:text-gray-300  gap-1 rounded-l-lg">
          <h3 className="text-center w-full border-violet-400 dark:border-[#262626] uppercase font-bold border-b-[1px] pb-4">Categories</h3>
          <hr className="bg bg-gray-500" />
          {categories.map((category) => (
            <button onClick={() => getCategory(category.category)} key={category.id} className="category py-2 px-5 font-semibold w-full text-left  dark:hover:bg-zinc-700 text-sm rounded-sm hover:text-violet-500">
              {category.category}
            </button>
          ))}
        </div>
        <div className="items-category- p-5 col-span-9 lg:col-span-10 rounded-xl border-2 border-violet-400 dark:border-[#262626] dark:dark:bg-zinc-900">
            <div className="">ITEMS</div>
        </div>
      </div>
    </div>
  )
}
