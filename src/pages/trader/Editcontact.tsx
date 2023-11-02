import { HiMail } from "react-icons/hi";
import { useTrader, useUpdateMobile } from "../../hooks/queries/useTrader";
import { useAuthStore } from "../../hooks/state";
import { BiEdit } from "react-icons/bi";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type MobileFormData = {
    mobile_number:string;
};

export default function Editcontact() {
    const { user_id } = useAuthStore((state) => state);
    const traderQuery = useTrader(user_id);
    const [isUpdateEmailOpen,setIsUpdateEmailOpen] = useState(false)

    const {mutate: updateMobile, isLoading: isMobileUpdating} = useUpdateMobile()


    const mobileSchema = z.object({
        mobile_number: z.string().regex(/^09\d{9}$/, {message: "Mobile number must be a valid PH Mobile Number",
        }).min(11).max(11)
      });
    
    const { register:mobileRegister, handleSubmit:mobileHandleSubmit, formState: {errors:mobileErrors, isDirty:mobileIsDirty} } = useForm<MobileFormData>({
    resolver: zodResolver(mobileSchema)
    });

    function handleChangeMobile(data: MobileFormData){
        updateMobile({
            user_id,
            mobile_number: data.mobile_number.split(" ").join("")
        })
    }

  return (
    <div className="">
        <h2 className="mt-10 ml-10 text-2xl">Contact information</h2>
        <div className="email mt-10 mb-5 flex items-center  py-1">
            <aside className="px-8 flex justify-end basis-1/4">
                <span>
                    <HiMail className="w-8 h-8" />
                </span>
            </aside>
            <div className="email flex gap-3 basis-3/4">
                <h3>{traderQuery?.data?.trader?.email}</h3>
                <BiEdit onClick={() => setIsUpdateEmailOpen(true)} className="w-6 h-6 text-blue-500 dark:text-sky-500 cursor-pointer"/>
            </div>
        </div>
        <div className="number mt-10 mb-5 flex items-center  py-1">
            <aside className="px-8 flex justify-end basis-1/4">
                <h5>Mobile Number:</h5>
            </aside>
            {traderQuery.isLoading
                ? <div className="loading">Loading...</div>
                : <div  className=" flex flex-col gap-1 basis-3/4">
                    <form onSubmit={mobileHandleSubmit(handleChangeMobile)} className="flex items-center gap-5">
                        <input
                        {...mobileRegister("mobile_number")}
                        type="text"
                        defaultValue={traderQuery?.data?.trader?.mobile_number ?? "09000000000"}
                        maxLength={11}
                        minLength={11}
                        className="rounded focus:outline-none px-4 py-2 bg-transparent border border-gray-400 dark:border-gray-500 "
                        />
                        {isMobileUpdating
                            ?  <button className={`py-2 px-6 font-bold bg-[#0095F6] rounded-lg opacity-50`} disabled>
                            Updating...
                            </button>
                            :  <button type="submit" className={`py-2 px-6 font-bold bg-[#0095F6] rounded-lg ${!mobileIsDirty ? "opacity-50" : ''}`} disabled={!mobileIsDirty}>
                            Update
                            </button>
                        }
                    </form>
                    {mobileErrors.mobile_number && (
                    <span className="text-red-400 text-sm">
                    {mobileErrors.mobile_number.message}
                </span>
            )}
                </div>
            }
            
        </div>
    </div>
  )
}
