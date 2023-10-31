import { z, ZodType } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupSend } from '../api/auth';
import {ToastContainer, toast} from "react-toastify"
import { Navbar } from '../components/Navbar';
import {Helmet} from "react-helmet-async"
import womanshopping from '../assets/womanshopping.json'
import Lottie from 'lottie-react';

type SignupFormData = {
    fullname: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
}

function Signup() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const schema: ZodType<SignupFormData> = z.object({
        fullname: z.string().min(3, {message: "Fullname too short"}).max(30),
        username: z.string().min(3, {message: "Username too short"}).max(30),
        password: z.string().min(4, {message: "Password too short"}).max(30),
        confirmPassword: z.string(),
        email: z.string().email()

    }).refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match",
        path: ["confirmPassword"]
    })

    const {register, handleSubmit, formState:{errors}} = useForm<SignupFormData>({resolver: zodResolver(schema)})

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    //signup function
    const handleSignup = async (data: SignupFormData) => {
        setIsLoading(true)
        try {
            const res = await signupSend(data.username, data.email)

            const responseData = await res.data

            setIsLoading(false)
            if(responseData.message === "success"){
                //save to localstorage
                localStorage.setItem("username", data.username)
                localStorage.setItem("email", data.email)
                localStorage.setItem("fullname", data.fullname)
                localStorage.setItem("password", data.password)
                navigate('/verify')
            }
        } catch (err: any) {
            //console.log(err)
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
      };

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
            <title>BandB | Signup</title>
        </Helmet>

        <Navbar>
            <Link to="/login" className='p-2'>Login</Link>
        </Navbar>
        
        <div className="signup-container pt-6 gap-5 lg:pt-10 h-full w-full grid md:grid-cols-2">
            <div className="signup-cloud flex justify-center items-center">
                <Lottie animationData={womanshopping} className="h-32 sm:h-48 md:h-[30rem] drop-shadow-2xl" loop={true} />
            </div>
            <div className="signup-form w-full flex justify-center">
                <form onSubmit={handleSubmit(handleSignup)} className='w-10/12 lg:w-7/12 p-5 bg-uno rounded-xl flex flex-col shadow-2xl'>
                    <h2 className='text-center text-dos md:py-5 font-extrabold tracking-wider text-2xl'>Sign up</h2>
                    <div className="fullname w-full font-medium">
                        <label className="text-dos text-xs">Fullname</label>
                        <br />
                            <input
                            className="px-4 py-2 bg-uno rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] border-gray-400 w-full tracking-wider"
                            type="text"
                            {...register("fullname")}
                            placeholder="Fullname"
                            required
                        />
                        {errors.fullname && <span className="text-red-400 text-center text-sm">{errors.fullname.message}</span>}
                    </div>

                    <div className="username w-full font-medium">
                        <label className="text-dos text-xs">Username</label>
                        <br />
                            <input
                            className="px-4 py-2 bg-uno rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] border-gray-400 w-full tracking-wider"
                            type="text"
                            {...register("username")}
                            placeholder="Username"
                            required
                        />
                        {errors.username && <span className="text-red-400 text-center text-sm">{errors.username.message}</span>}
                    </div>

                    <div className="email w-full font-medium">
                        <label className="text-dos text-xs">Email</label>
                        <br />
                            <input
                            className="px-4 py-2 bg-uno rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] border-gray-400 w-full tracking-wider"
                            type="text"
                            {...register("email")}
                            placeholder="Email"
                            required
                        />
                        {errors.email && <span className="text-red-400 text-center text-sm">{errors.email.message}</span>}
                    </div>

                    <div className="password w-full font-medium">
                        <label className="text-dos text-xs">Password</label>
                        <br />
                            <input
                            className="px-4 py-2 bg-uno rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] border-gray-400 w-full tracking-wider"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            placeholder="Password"
                            required
                        />
                        {errors.password && <span className="text-red-400 text-center text-sm">{errors.password.message}</span>}
                    </div>

                    <div className="confirmpassword w-full font-medium">
                        <label className="text-dos text-xs">Confirm Password</label>
                        <br />
                            <input
                            className="px-4 py-2 bg-uno rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] border-gray-400 w-full tracking-wider"
                            type={showPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            placeholder="Confirm Password"
                            required
                        />
                        {errors.confirmPassword && <span className="text-red-400 text-center text-sm">{errors.confirmPassword.message}</span>}
                    </div>

                    <div className="checkme py-2 flex gap-3 items-center">
                    <input className='h-4 w-4 bg-transparent checked:bg-red-500' type="checkbox" onChange={handlePasswordToggle} />
                    <p className='text-sm font-medium text-dos'>Show Password</p>
                    </div>

                    {isLoading
                        ? <button className='py-3 px-3 mt-2 bg-dos rounded-md font-bold text-gray-100 uppercase' disabled >Signing up...</button>
                        : <button className='py-3 px-3 mt-2 bg-dos rounded-md font-bold text-gray-100 uppercase' type='submit'>Sign up</button>
                    }
                </form>
            </div>
        </div>
    </div>
  )
}

export default Signup