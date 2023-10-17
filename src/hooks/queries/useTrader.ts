import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../useAxiosPrivate";
import { toast } from "react-toastify";

//QUERY FOR GETTING SINGLE TRADER (USERNAME)
export const useTrader = (id:string) =>{
    const axiosPrivate = useAxiosPrivate()
    return useQuery({
        queryKey: ['trader'], 
        queryFn: async () => {
          try {
            const response = await axiosPrivate.get(`/user/trader/${id}`)
            return response.data
          } catch (error:any) {
              if (error.message === 'Network Error') {
                  toast.error('Server Unavailable',{
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  })
                } else if(error.response.data?.message){
                  toast.error(error.response.data.message,{
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                  })
                }else {
                  // Handle other errors
                  error.response.data.errors?.map((err:any) => {
                    toast.error(err.msg,{
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    })
                  })
                } 
          }
        },
    }) 
}

//QUERY FOR GETTING SINGLE TRADER (USERNAME)
export const useProfile = (username:string|undefined) =>{
  const axiosPrivate = useAxiosPrivate()
  return useQuery({
      queryKey: ['profile'], 
      queryFn: async () => {
        try {
          const response = await axiosPrivate.get(`/user/trader/profile/${username}`)
          return response.data
        } catch (error:any) {
            if (error.message === 'Network Error') {
                toast.error('Server Unavailable',{
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                })
              } else if(error.response.data?.message){
                toast.error(error.response.data.message,{
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                })
              }else {
                // Handle other errors
                error.response.data.errors?.map((err:any) => {
                  toast.error(err.msg,{
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                  })
                })
              } 
        }
      },
  }) 
} 