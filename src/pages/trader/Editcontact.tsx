import { HiMail } from "react-icons/hi";
import { useTrader, useUpdateEmailCONFIRM, useUpdateEmailSEND, useUpdateMobile } from "../../hooks/queries/useTrader";
import { useAuthStore } from "../../hooks/state";
import { BiEdit } from "react-icons/bi";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Modal from "../../components/Modal";
import { FaAngleLeft } from "react-icons/fa6";

type MobileFormData = {
    mobile_number:string;
};
type EmailFormData = {
    new_email:string;
};
type EmailConfirmFormData = {
    code:string;
};

export default function Editcontact() {
    const { user_id } = useAuthStore((state) => state);
    const traderQuery = useTrader(user_id);
    const [isUpdateEmailOpen,setIsUpdateEmailOpen] = useState(false)
    const [isItemSliderOpen, setIsItemSliderOpen] = useState<boolean>(false)
    const [newEmail, setNewEmail] = useState("")

    const {mutate: updateMobile, isLoading: isMobileUpdating} = useUpdateMobile()
    const {mutate: updateEmail, isLoading: isEmailUpdating} = useUpdateEmailSEND()
    const {mutate: updateEmailConfirm, isLoading: isEmailConfirmUpdating} = useUpdateEmailCONFIRM()

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
    const emailSchema = z.object({
        new_email: z.string().email().min(1).max(100)
      });
    
    const { register:emailRegister, handleSubmit:emailHandleSubmit, formState: {errors:emailErrors, isDirty:emailIsDirty} } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema)
    });

    function handleChangeEmailSENDOTP(datas: EmailFormData){
        updateEmail({
            user_id,
            new_email: datas.new_email
        },
        {
            onSuccess(data){
                if(data.message === "success"){
                    setNewEmail(datas.new_email)
                    setIsItemSliderOpen(true)
                }
            }
        }
        )
    }

    //CONFIRM OTP
    const emailSchemaConfirm = z.object({
        code: z.string().min(6).max(6)
      });
    
    const { register:emailConfirmRegister, handleSubmit:emailConfirmHandleSubmit, formState: {errors:emailConfirmErrors, isDirty:emailConfirmIsDirty} } = useForm<EmailConfirmFormData>({
    resolver: zodResolver(emailSchemaConfirm)
    });

    function handleChangeEmailCONFIRMOTP(data: EmailConfirmFormData){
        
        updateEmailConfirm({
            user_id,
            new_email: newEmail,
            code: data.code.split(" ").join("")
        },
        {
            onSuccess(data){
                if(data.message === "success"){
                    setIsItemSliderOpen(false)
                    setIsUpdateEmailOpen(false)
                }
            }
        }
        )
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
        {/* UPDATE EMAIL MODAL */}
        <Modal open={isUpdateEmailOpen} onClose={() => setIsUpdateEmailOpen(false)}>
            <div className="update-email p-10 overflow-hidden relative bg-white dark:bg-[#212225]">
                <h2 className="pb-5 text-center">Update your email</h2>
                <form onSubmit={emailHandleSubmit(handleChangeEmailSENDOTP)} className="flex flex-col text-gray-700 dark:text-gray-100">
                    <label className="text-sm text-gray-400">New email</label>
                    <input {...emailRegister("new_email")} className="px-4 py-2 bg-uno dark:bg-transparent dark:text-gray-200 rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] mb-3 border-gray-400 dark:border-zinc-700 w-full tracking-wider" type="text" placeholder="yournew@email.com" />
                    
                    {isEmailUpdating
                        ?  <button className={`py-2 px-6 font-bold bg-[#0095F6] rounded-lg opacity-50`} disabled>
                        OTP Sending...
                        </button>
                        :  <button type="submit" className={`py-2 px-6 font-bold bg-[#0095F6] rounded-lg ${!emailIsDirty ? "opacity-50" : ''}`} disabled={!emailIsDirty}>
                        Send OTP
                        </button>
                    }
                </form>
                {emailErrors.new_email && (
                    <div className="text-red-400 text-center py-1 text-sm">
                    {emailErrors.new_email.message}
                    </div>
                )}

                <div className={` bg-white dark:bg-[#212225] rounded-md w-full min-h-full absolute top-0 left-0 z-10 ${ isItemSliderOpen ? 'translate-x-0' : 'translate-x-full'} transition-all duration-500`}>
                    <div className="close">
                        <button onClick={() => setIsItemSliderOpen(false)} className="p-2 rounded-xl">
                            <FaAngleLeft className="w-6 h-6 text-gray-900 dark:text-gray-300"/>
                        </button>
                    </div>
                    <div className="item px-3">
                        <h2 className="pb-5 text-center">Confirm OTP</h2>
                        <form onSubmit={emailConfirmHandleSubmit(handleChangeEmailCONFIRMOTP)} className="flex flex-col text-gray-700 dark:text-gray-100">
                            <label className="text-sm text-gray-400">OTP Code</label>
                            <input maxLength={6} minLength={6} {...emailConfirmRegister("code")} className="px-4 py-2 bg-uno dark:bg-transparent text-center dark:text-gray-200 rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] mb-3 border-gray-400 dark:border-zinc-700 w-full tracking-wider" type="text" placeholder="ex. 123456" />
                            
                            {isEmailConfirmUpdating
                                ?  <button className={`py-2 px-6 font-bold bg-[#0095F6] rounded-lg opacity-50`} disabled>
                                OTP Confirming...
                                </button>
                                :  <button type="submit" className={`py-2 px-6 font-bold bg-[#0095F6] rounded-lg ${!emailConfirmIsDirty ? "opacity-50" : ''}`} disabled={!emailConfirmIsDirty}>
                                Confirm OTP
                                </button>
                            }
                        </form>
                        {emailConfirmErrors.code && (
                            <div className="text-red-400 text-center py-1 text-sm">
                            {emailConfirmErrors.code.message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
        {/* UPDATE EMAIL MODAL */}
    </div>
  )
}
