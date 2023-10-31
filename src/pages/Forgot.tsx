import { z, ZodType } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify"
import { Navbar } from '../components/Navbar';
import { Helmet } from 'react-helmet-async';
import { forgot } from '../api/auth';

type ForgotFormData = {
    email: string
}

function Forgot() {
    const [isLoading, setIsLoading] = useState(false)
    
    const schema: ZodType<ForgotFormData> = z.object({
        email: z.string().email()
    })

    const {register, handleSubmit, formState:{errors}} = useForm<ForgotFormData>({resolver: zodResolver(schema)})

    //forgot function
    const handleForgot= async (data: ForgotFormData) => {
        setIsLoading(true)
        try {

            const res = await forgot(data.email)

            const responseData = await res.data

            setIsLoading(false)
            if(responseData.message === "success"){
                toast.success("Reset Link Sent!",{
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


  return (
    <div className='bg-[#E7AD99] dark:bg-[#495867] h-full'>
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
        <Helmet>
          <title>BandB | Forgot Password</title>
        </Helmet>
        <Navbar>
            <Link to="/signup" className='p-2'>Signup</Link>
            <Link to="/login" className='p-2'>Login</Link>
        </Navbar>

        <div className="forgot-container h-full w-full flex mt-20 justify-center">
            <form onSubmit={handleSubmit(handleForgot)} className='w-10/12 sm:w-6/12 md:w-5/12 lg:w-4/12 px-5 py-3 bg-uno shadow-2xl rounded-3xl flex flex-col mt-5 mb-10'>
                <h2 className='text-center pt-10 pb-2 font-extrabold tracking-wider text-2xl text-dos'>Forgot Password?</h2>
                <div className="fullname w-full font-medium">
                    <p className="text-gray-400 p-3 break-words text-center text-sm">Enter your email address you're using for your account below and we will send you a password reset link.</p>
                        <label className="text-dos text-xs">Email address</label>
                        <input
                        className="py-2 px-5 bg-violet-100 rounded-lg text-gray-900 text-md font-medium outline-none border-solid border-[1px] border-violet-300 w-full tracking-widest"
                        type="text"
                        {...register("email")}
                        placeholder='Email address'
                        required
                    />
                    {errors.email && <div className="text-red-400 w-full text-center text-sm">{errors.email.message}</div>}
                </div>

                {isLoading
                    ? <button className='py-3 px-3 mt-2 bg-dos rounded-md font-bold text-gray-100' disabled >Requesting...</button>
                    : <button type='submit' className='py-3 px-3 mt-2 bg-dos rounded-md font-bold text-gray-100'>Request Reset Link</button>
                }
            </form>
        </div>
    </div>
  )
}

export default Forgot