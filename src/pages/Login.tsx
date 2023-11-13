import { z, ZodType } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {ToastContainer, toast} from "react-toastify"
import { Navbar } from '../components/Navbar';
import {Helmet} from "react-helmet-async"
import { login } from '../api/auth';
import { useAuthStore } from '../hooks/state';
import shoppingcart from '../assets/shoppingcart.json'
import Lottie from 'lottie-react';

type LoginFormData = {
    usernameORemail: string;
    password: string;
}

function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const schema: ZodType<LoginFormData> = z.object({
        usernameORemail: z.string().min(1, {message: "Username or Email is required"}).max(255),
        password: z.string().min(1, {message: "Password is required"}).max(255),

    })

    const {register, handleSubmit, formState:{errors}} = useForm<LoginFormData>({resolver: zodResolver(schema)})

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    //login function
    const handleLogin = async (data: LoginFormData) => {
        setIsLoading(true)
        try {
            const res = await login(data.usernameORemail, data.password)

            const responseData = await res.data
            setIsLoading(false)
            
            if(responseData.user_type === "trader"){
                //navigate to trader dashboard
                useAuthStore.setState({ token: JSON.stringify(responseData)})
                useAuthStore.setState({ user_id: responseData.user_id})
                localStorage.setItem('user_id', responseData.user_id)
                navigate('/trader', {replace: true})
            }else if (responseData.user_type === 'advertiser') {
                //navigate to advertiser dashboard
                useAuthStore.setState({ token: JSON.stringify(responseData)})
                useAuthStore.setState({ user_id: responseData.user_id})
                localStorage.setItem('user_id', responseData.user_id)
                navigate('/advertiser', {replace: true})
            }else {
                console.log("No role specified");
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
    <div className='bg-[#e9ebf8] dark:bg-[#1a1a1d] h-full'>
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
            <title>BandB | Login</title>
        </Helmet>

        <Navbar>
            <Link to="/signup" className='p-2'>Signup</Link>
        </Navbar>
        
        <div className="login-container pt-6 gap-5 md:pt-20 h-full w-full grid md:grid-cols-2">
            <div className="signup-cloud flex justify-center items-center">
                <Lottie animationData={shoppingcart} className="h-40  md:h-[30rem] drop-shadow-2xl" loop={true} />
            </div>
            <div className="signup-form w-full flex justify-center">
                <form onSubmit={handleSubmit(handleLogin)} className='w-10/12 lg:w-7/12 p-5 bg-uno dark:bg-[#212225] rounded-xl flex flex-col shadow-2xl'>
                    <h2 className='text-center text-dos md:py-5 font-extrabold tracking-wider text-2xl'>Log in</h2>
                    <div className="fullname w-full font-medium">
                        <label className="text-dos text-xs">Username or Email</label>
                        <br />
                            <input
                            className="px-4 py-2 bg-uno dark:bg-transparent dark:text-gray-200 rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] border-gray-400  dark:border-zinc-700 w-full tracking-wider"
                            type="text"
                            {...register("usernameORemail")}
                            placeholder="Username or email"
                            required
                        />
                        {errors.usernameORemail && <span className="text-red-400 text-center text-sm">{errors.usernameORemail.message}</span>}
                    </div>



                    <div className="password w-full font-medium">
                        <label className="text-dos text-xs">Password</label>
                        <br />
                            <input
                            className="px-4 py-2 bg-uno dark:bg-transparent dark:text-gray-200 rounded-lg text-gray-900 text-md outline-none border-solid border-[1px] border-gray-400  dark:border-zinc-700 w-full tracking-wider"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            placeholder="Password"
                            required
                        />
                        {errors.password && <span className="text-red-400 text-center text-sm">{errors.password.message}</span>}
                    </div>

                    <div className="checkme py-2 flex gap-3 items-center">
                      <input className='h-4 w-4 bg-transparent checked:bg-red-500' type="checkbox" onChange={handlePasswordToggle} />
                      <p className='text-sm font-medium text-dos dark:text-gray-400'>Show Password</p>
                    </div>
                    <Link to='/forgot-password' className='text-center text-sm font-normal py-2 text-violet-300 dark:text-gray-400'>Forgot password?</Link>

                    {isLoading
                        ? <button className='py-3 px-3 mt-2 md:mt-6 bg-dos rounded-md font-bold text-gray-100 uppercase' disabled >Logging in...</button>
                        : <button className='py-3 px-3 mt-2 md:mt-6 bg-dos rounded-md font-bold text-gray-100 uppercase' type='submit'>Log In</button>
                    }
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login