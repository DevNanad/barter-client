import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

//QUERY FOR ADDING ITEM
export const useAddItem = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()  
  return useMutation({
      mutationFn: async (newItem: {
        name: string,
        price: string,
        details: string,
        category: string,
        condition: string,
        location: string,
        user_id: string,
        image: string[]
      }) =>{
          const response = await axiosPrivate.post('/item', newItem)
          return response.data
      },
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({
            queryKey: ['elections'],
            exact: true
        })

        if(data.message === 'success'){
          toast.success('Item Added!',{
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

//QUERY FOR CLAIMING COUPON 
export const useClaimCoupon = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  return useMutation({
      mutationFn: async (couponInfo: {coupon_code: string, user_id: string}) =>{
          const response = await axiosPrivate.post('/user/claim-coupon', couponInfo)
          return response.data
      },
      onSuccess: async (data) => {
          if(data.message === 'success'){
            await queryClient.invalidateQueries({
              queryKey: ['trader'],
              exact: true
            })
            toast.success('Coupon Claimed!',{
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
          } else if(error.response.data?.error){
            toast.error(error.response.data?.error,{
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

//QUERY FOR UPDATING TRADER PROFILE PICTURE
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {user_id:string, profile: string,}) => {
          const response = await axiosPrivate.patch(`/user/profile`, {
            user_id: newData.user_id,
            profile: newData.profile,
          } )
          return response.data
      },
      onSuccess: async () => {
          await queryClient.invalidateQueries({
              queryKey: ['trader'],
              exact: true
          })
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
            } else if(error.response.data?.error){
              toast.error(error.response.data?.error,{
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

//QUERY FOR UPDATING TRADER PROFILE INFO
export const useUpdateProfileInfo = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {user_id:string, bio: string, fullname: string}) => {
          const response = await axiosPrivate.patch(`/user/update-info`, {
            user_id: newData.user_id,
            bio: newData.bio,
            fullname: newData.fullname,
          } )
          return response.data
      },
      onSuccess: async (data) => {
          if(data.message === 'success'){
            await queryClient.invalidateQueries({
              queryKey: ['trader'],
              exact: true
            })
            toast.success('Updated!',{
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
            } else if(error.response.data?.error){
              toast.error(error.response.data?.error,{
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

//QUERY FOR UPDATING TRADER USERNAME
export const useUpdateUsername = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {user_id:string, username: string}) => {
          const response = await axiosPrivate.patch(`/user/update-username`, {
            user_id: newData.user_id,
            username: newData.username,
          } )
          return response.data
      },
      onSuccess: async (data) => {
          if(data.message === 'success'){
            await queryClient.invalidateQueries({
              queryKey: ['trader'],
              exact: true
            })
            toast.success('Username Updated!',{
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
            } else if(error.response.data?.error){
              toast.error(error.response.data?.error,{
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

//QUERY FOR UPDATING TRADER MOBILE
export const useUpdateMobile = () => {
  const queryClient = useQueryClient()
  const axiosPrivate = useAxiosPrivate()
  return useMutation({
      mutationFn:async (newData: {user_id:string, mobile_number: string}) => {
          const response = await axiosPrivate.patch(`/user/update-mobile`, {
            user_id: newData.user_id,
            mobile_number: newData.mobile_number,
          } )
          return response.data
      },
      onSuccess: async (data) => {
          if(data.message === 'success'){
            await queryClient.invalidateQueries({
              queryKey: ['trader'],
              exact: true
            })
            toast.success('Mobile number Updated!',{
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
            } else if(error.response.data?.error){
              toast.error(error.response.data?.error,{
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