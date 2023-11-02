import { NavLink, Outlet } from "react-router-dom";

export default function Settings() {


  return (
    <div className="text-white flex">
      <div className="side-settings h-screen w-2/6 lg:w-3/12 p-5 border-r-[0.9rem] border-violet-300 dark:border-[#27272a]">
        <div className="ad opacity-70 flex justify-center items-center bg-gray-400 py-20 rounded-lg">ad</div>
        <div className="h2 pt-8 pl-4 font-extrabold text-xl">Settings</div>

        <div className="tabs grid gap-2 py-2">
          <NavLink to='/trader/settings' className=" py-3 px-4 font-bold hover:bg-[#ECC8AF] dark:hover:bg-gray-700 rounded-lg" end >
            Edit profile
          </NavLink>
          <NavLink to='/trader/settings/contact' className=" py-3 px-4 font-bold hover:bg-[#ECC8AF] dark:hover:bg-gray-700 rounded-lg" >
            Contact information
          </NavLink>
        </div>
      </div>
      <div className="side-content flex-grow overflow-y-auto py-10">
        <Outlet/>
      </div>
    </div>
  )
}
