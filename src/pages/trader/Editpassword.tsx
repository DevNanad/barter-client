import { useForm } from "react-hook-form";
import { useChangePassword, useTrader } from "../../hooks/queries/useTrader";
import { useAuthStore } from "../../hooks/state";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type PassFormData = {
    current: string;
    new_password: string;
}

export default function EditPassword() {
    const { user_id } = useAuthStore((state) => state);
    const traderQuery = useTrader(user_id);

    const { mutate: changePassword, isLoading: isPasswordChanging } = useChangePassword();

    const schema = z.object({
        current: z.string().min(1, {message: "Current password is required"}).max(255),
        new_password: z.string().min(1, {message: "New password is required"}).max(255),
      });
    
      const { register, handleSubmit, formState: {errors, isDirty}, reset } = useForm<PassFormData>({
        resolver: zodResolver(schema)
      });

      function handleChangePassword(data: PassFormData){
        changePassword({
            user_id,
            current: data.current,
            new_password: data.new_password
        },{
            onSuccess(data){
                if(data.message === 'success'){
                    reset()
                }
            }
        })
      }

    
  return (
    <div className=" pb-20 md:pb-0">
        <h2 className="sm:mt-10 ml-2 sm:ml-10 text-lg md:text-2xl">Change password</h2>
        {traderQuery?.isLoading
            ? <div className="flex justify-center">Loading...</div>
            : <div className="infos">
            <form onSubmit={handleSubmit(handleChangePassword)}>
                <div className="curren px-3 mt-10 md:px-0 flex flex-col md:flex-row mb-5">
                    <aside className="md:px-8 md:text-right md:basis-1/4 mt-2">Current Password</aside>
                    <div className="fullname-input md:basis-3/4 md:mr-20 flex flex-col">
                        <input
                        type="text"
                        {...register("current")}
                        className="rounded focus:outline-none px-4 py-2 bg-transparent border border-gray-400 dark:border-gray-500 "
                        />
                        {errors.current && (
                        <span className="text-red-400 text-center text-sm">
                            {errors.current.message}
                        </span>
                        )}
                    </div>
                </div>
                <div className="new password px-3 md:px-0 flex flex-col md:flex-row mb-5">
                    <aside className="md:px-8 md:text-right md:basis-1/4 mt-2">New Password</aside>
                    <div className="newpass-input md:basis-3/4 md:mr-20 flex flex-col">
                        <input
                        type="text"
                        {...register("new_password")}
                        className="rounded focus:outline-none px-4 py-2 bg-transparent border border-gray-400 dark:border-gray-500 "
                        />
                        {errors.new_password && (
                        <span className="text-red-400 text-center text-sm">
                            {errors.new_password.message}
                        </span>
                        )}
                    </div>
                </div>
                <div className="submit flex flex-row justify-center md:justify-start mb-5">
                <aside className="md:px-8 md:basis-1/4 mt-2"></aside>
                <div className="rounded md:basis-3/4 md:mr-20">
                {isPasswordChanging
                    ?  <button className={`py-2 px-6 font-bold text-white bg-[#0095F6] rounded-lg opacity-50`} disabled>
                    Updating...
                    </button>
                    :  <button type="submit" className={`py-2 px-6 font-bold text-white bg-[#0095F6] rounded-lg ${!isDirty ? "opacity-50" : ''}`} disabled={!isDirty}>
                    Update
                    </button>
                }
                </div>
                </div>
            </form>
            </div>
        }
    </div>
  )
}
