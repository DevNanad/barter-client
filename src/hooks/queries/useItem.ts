import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import useAxiosPrivate from "../useAxiosPrivate"

//QUERY FOR GETTING ALL ITEMS
export const useItems = () => {
    const axiosPrivate = useAxiosPrivate()
    return useQuery({
        queryKey: ['items'], 
        queryFn: async () => {
          try {
            const response = await axiosPrivate.get('/item')
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

//QUERY FOR GETTING A SINGLE ITEM
export const useItem = () => {
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (id:string) => {
          const response = await axiosPrivate.get(`/item/${id}`)
          return response.data
      },
      onError: (error:any) => {
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
  })
}
  