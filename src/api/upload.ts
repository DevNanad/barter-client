import axios from 'axios'

export const uploadCloudinary = async (file:File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_PRESET}`)

    const url = import.meta.env.VITE_CLOUDINARY_URL

    const {data} = await axios.post(`${url}`, formData)
    return {
        public_id: data?.public_id,
        url: data?.secure_url,
    }
}