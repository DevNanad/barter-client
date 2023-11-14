import { Helmet } from "react-helmet-async";
import { NavLink, Outlet } from "react-router-dom";

export default function Settings() {


  return (
    <div className="text-gray-700 dark:text-gray-100 flex flex-col sm:flex-row">
      <Helmet>
          <title>BandB | Settings</title>
      </Helmet>
      <div className="side-settings w-full sm:h-screen  sm:w-2/6 lg:w-3/12 p-5 md:border-r-[0.9rem] border-violet-300 dark:border-[#27272a]">
        <div className="ad hidden opacity-70 sm:flex justify-center items-center bg-gray-400 py-20 rounded-lg">ad</div>
        <div className="h2 sm:pt-8 md:pl-4 font-extrabold text-sm sm:text-xl">Settings</div>

        <div className="tabs grid text-xs sm:text-base md:gap-2 md:py-2">
          <NavLink to='/trader/settings' className=" py-3 px-4 font-bold hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg" end >
            Edit profile
          </NavLink>
          <NavLink to='/trader/settings/contact' className=" py-3 px-4 font-bold hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg" >
            Contact information
          </NavLink>
        </div>
      </div>
      <div className="side-content flex-grow overflow-y-auto md:py-10">
        <Outlet/>
      </div>
    </div>
  )
}
