import { z, ZodType } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify"
import { Helmet } from 'react-helmet-async';
import { reset } from '../api/auth';

type ResetFormData = {
    password: string;
    confirmPassword: string;
}

function Reset() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const {id, token} = useParams()
    const navigate = useNavigate()
    
    const schema: ZodType<ResetFormData> = z.object({
        password: z.string().min(4, {message: "Password too short"}).max(30),
        confirmPassword: z.string()

    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match",
        path: ["confirmPassword"]
    })

    const {register, handleSubmit, formState:{errors}} = useForm<ResetFormData>({resolver: zodResolver(schema)})


    //reset function
    const handleReset= async (data: ResetFormData) => {
        setIsLoading(true)
        try {
            if(id && token){
                const res = await reset(id, token, data.password)
                const responseData = await res.data
    
                setIsLoading(false)
                if(responseData.message === "success"){
                    toast.success("Password Reset Successful!",{
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                    })
                    setTimeout(()=> {
                        navigate('/login', {replace: true})
                    }, 3000)
                }
            }else{
                console.log("no id or token at params");
                
            }
        } catch (err: any) {
            setIsLoading(false)
            if(err.message === "Network Error"){
              setIsLoading(false)
            }else{
              setIsLoading(false)
              toast.error(err.response.data.error,{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              })
            }  
        }
    }
    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };


  return (
    <div className='bg-[#e9ebf8] dark:bg-[#1a1a1d] h-screen flex items-center'>
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
        />
        <Helmet>
          <title>BandB | Reset Password</title>
        </Helmet>

        <div className="reset-container h-full w-full flex justify-center items-center">
            <form onSubmit={handleSubmit(handleReset)} className='w-10/12 sm:w-6/12 md:w-5/12 lg:w-4/12 px-5 py-3 bg-uno dark:bg-[#212225] shadow-2xl rounded-3xl flex flex-col mt-5 mb-10'>
                <h2 className='text-center pt-10 font-extrabold tracking-wider text-2xl text-dos'>Change your Password</h2>
                <div className="fullname w-full font-medium">
                    <p className="text-gray-400 pb-3 break-words text-center text-sm">Enter a new password below to change your password</p>
                    <div className="password w-full font-medium">
                        <label className="text-dos text-xs">New Password</label>
                        <br />
                            <input
                            className="px-4 py-2 bg-uno dark:bg-transparent dark:text-gray-200 rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] border-gray-400 w-full tracking-wider"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            placeholder="New Password"
                            required
                        />
                        {errors.password && <div className="text-red-400 w-full text-center text-sm">{errors.password.message}</div>}
                    </div>

                    <div className="confirmpassword w-full font-medium">
                        <label className="text-dos text-xs">Confirm New Password</label>
                        <br />
                            <input
                            className="px-4 py-2 bg-uno dark:bg-transparent dark:text-gray-200 rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] border-gray-400 w-full tracking-wider"
                            type={showPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            placeholder="Confirm New Password"
                            required
                        />
                        {errors.confirmPassword && <div className="text-red-400 w-full text-center text-sm">{errors.confirmPassword.message}</div>}
                    </div>

                    <div className="checkme py-2 flex gap-3 items-center">
                    <input className='h-4 w-4 bg-transparent checked:bg-red-500' type="checkbox" onChange={handlePasswordToggle} />
                    <p className='text-sm font-medium text-dos'>Show Password</p>
                    </div>
                </div>

                {isLoading
                    ? <button className='py-3 px-3 mt-2 bg-dos rounded-md font-bold text-gray-100' disabled >Changing...</button>
                    : <button type='submit' className='py-3 px-3 mt-2 bg-dos rounded-md font-bold text-gray-100'>Change Password</button>
                }
            </form>
        </div>
    </div>
  )
}

export default Reset