import { z, ZodType } from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import mail from "../assets/mail.png"
import { signupSend, signupVerify } from '../api/auth';
import {ToastContainer, toast} from "react-toastify"
import Modal from '../components/Modal';
import { Navbar } from '../components/Navbar';
import { Helmet } from 'react-helmet-async';

type VerifyFormData = {
    code: string
}

type NewEmailFormData = {
    email: string
}

function Verify() {
    const [isLoading, setIsLoading] = useState(false)
    const [isResendLoading, setIsResendLoading] = useState(false)
    const navigate = useNavigate();
    const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
    const [isEmailChanging, setIsEmailChanging] = useState<boolean>(false);
    
    const schema: ZodType<VerifyFormData> = z.object({
        code: z.string().regex(/^\d{6}$/, {message: "Invalid Code"}).min(6).max(6)

    })

    const {register, handleSubmit, formState:{errors}} = useForm<VerifyFormData>({resolver: zodResolver(schema)})
    
    const schemaNewEmail: ZodType<NewEmailFormData> = z.object({
      email: z.string().email()      
    })
    const {register:registerNewEmail, handleSubmit:handleSubmitNewEmail, formState:{errors: errorsNewEmail}} = useForm<NewEmailFormData>({resolver: zodResolver(schemaNewEmail)})

    const localUsername = localStorage.getItem("username")
    const localEmail = localStorage.getItem("email")
    const localFullname = localStorage.getItem("fullname")
    const localPassword = localStorage.getItem("password")

    useEffect(() => {
      if(!localUsername || !localEmail){
        navigate('/signup')
      }
    }, [])

    //verify function
    const handleVerify = async (data: VerifyFormData) => {
        setIsLoading(true)
        try {
            if(!localEmail || !localFullname || !localPassword || !localUsername){
              throw new Error("One or more Fields are empty @ Continue")
            }

            const res = await signupVerify(localFullname, localUsername, localEmail, localPassword, data.code)

            const responseData = await res.data

            setIsLoading(false)
            if(responseData.message === "success"){
                toast.success("Registered Successfully",{
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                })

                localStorage.removeItem("password")
                localStorage.removeItem("email")
                localStorage.removeItem("fullname")
                localStorage.removeItem("username")
                navigate('/login', {replace: true})
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

    const handleChangeEmail = async (data: NewEmailFormData) => {
      //change email logic
      try {
        if(!localUsername ){
          throw new Error("One or more Fields are empty @ Resend")
        }

        setIsEmailChanging(true)

        const res = await signupSend(localUsername, data.email)
        const responseData = await res.data

        setIsEmailChanging(false)
        if(responseData.message === "success"){
          setIsEmailModalOpen(false)
          localStorage.setItem("email", data.email)
          toast.success("Email Changed, Confirmation Sent",{
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
          if(err.message === "Network Error"){
            setIsEmailChanging(false)
          }else{
            setIsEmailChanging(false)
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

    const handleResendCode = async () => {
      try {
        setIsResendLoading(true)
        
        if(!localEmail || !localUsername ){
          throw new Error("One or more Fields are empty @ Resend")
        }

        const res = await signupSend(localUsername, localEmail)
        const responseData = await res.data

        setIsResendLoading(false)
        if(responseData.message === "success"){
          toast.success("Confirmation Resent!",{
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
          //console.log(err)
          if(err.message === "Network Error"){
            setIsResendLoading(false)
          }else{
            setIsResendLoading(false)
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
          <title>BandB | Verify</title>
        </Helmet>
        <Navbar>
            <Link to="/login" className='p-2'>Login</Link>
        </Navbar>

        <div className="verify-container h-full w-full flex justify-center">
            <form onSubmit={handleSubmit(handleVerify)} className='w-10/12 sm:w-6/12 md:w-5/12 lg:w-4/12 px-5 py-3 bg-uno shadow-2xl rounded-3xl flex flex-col mt-5 mb-10'>
                <div className="img flex justify-center items-center py-5">
                  <img className='w-60' src={mail} alt="email 3d image" />
                </div>
                <h2 className='text-center font-extrabold tracking-wider text-xl text-dos'>Verify your email</h2>
                <div className="fullname w-full font-medium">
                    <p className="text-gray-400 p-3 break-words text-center text-sm">Please enter the 6 digit code sent to {localEmail ? localEmail : "yourmail@example.com"}</p>
                        <input
                        className="py-2 text-center bg-violet-100 rounded-lg text-gray-900 text-2xl font-extrabold outline-none border-solid border-[1px] border-violet-300 w-full tracking-widest"
                        type="text"
                        {...register("code")}
                        minLength={6}
                        maxLength={6}
                        required
                    />
                    {errors.code && <span className="text-red-400 text-center text-sm">{errors.code.message}</span>}
                </div>
                {isResendLoading
                    ? <div className='py-3 mt-2 rounded-md font-medium text-sm text-violet-500' >Resending...</div>
                    : <div onClick={handleResendCode} className='py-3 mt-2 cursor-pointer rounded-md font-medium text-sm text-violet-500'>Resend Code</div>
                }

                {isLoading
                    ? <button className='py-3 px-3 mt-2 bg-dos rounded-md font-bold text-gray-100' disabled >Loading...</button>
                    : <button type='submit' className='py-3 px-3 mt-2 bg-dos rounded-md font-bold text-gray-100'>Confirm</button>
                }
                <div onClick={() => setIsEmailModalOpen(true)} className='py-3 px-3 mt-2 text-center cursor-pointer font-normal text-dos' >
                  <p className='underline'>Change Email</p>
                </div>

                
            </form>
        </div>
        <Modal open={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)}>
          <div className="change-email-container bg-white p-5">
            <form onSubmit={handleSubmitNewEmail(handleChangeEmail)}>
              <h3 className='text-center text-dos text-lg font-bold py-2'>Enter new email</h3>
              <input {...registerNewEmail("email")} type="text" className='py-2 p-5 mb-3 bg-violet-100 rounded-lg text-gray-900 text-lg font-medium outline-none border-solid border-[1px] border-violet-300 w-full tracking-widest' required />
              {errorsNewEmail.email && <div className="text-red-400 w-full text-center text-sm">{errorsNewEmail.email.message}</div>}
              {isEmailChanging
                    ? <button className='py-3 px-3 mt-2 bg-dos rounded-md w-full font-bold text-gray-100' disabled >Changing...</button>
                    : <button type='submit' className='py-3 px-3 mt-2 bg-dos rounded-md w-full font-bold text-gray-100'>Change</button>
              }
            </form>
            <button className='py-3 px-3 mt-2 rounded-md w-full font-bold text-dos' onClick={() => setIsEmailModalOpen(false)}>Cancel</button>
          </div>
        </Modal>
    </div>
  )
}

export default Verify