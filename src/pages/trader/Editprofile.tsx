import { useRef, useState } from "react";
import { useTrader, useUpdateProfile, useUpdateProfileInfo, useUpdateUsername } from "../../hooks/queries/useTrader";
import { useAuthStore } from "../../hooks/state";
import { uploadCloudinary } from "../../api/upload";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BiEdit } from "react-icons/bi";
import Modal from "../../components/Modal";

type InfoFormData = {
  bio: string;
  fullname: string;
};
type UsernameFormData = {
  username: string;
};

export default function Editprofile() {
  const { user_id } = useAuthStore((state) => state);
  const traderQuery = useTrader(user_id);
  const [isUpdateUsernameOpen, setIsUpdateUsernameOpen] = useState<boolean>(false)

  const bio = traderQuery?.data?.trader?.bio;
  const fullname = traderQuery?.data?.trader?.fullname;
  const username = traderQuery?.data?.trader?.username;

  const { mutate: updateProfile, isLoading: isProfileUpdating } = useUpdateProfile();
  
  const { mutate: updateProfileInfo, isLoading: isProfileInfoUpdating } = useUpdateProfileInfo();

  const { mutate: updateUsername, isLoading: isUsernameUpdating } = useUpdateUsername();
  

  const schema = z.object({
    bio: z.string().max(150, { message: "Bio should not be longer than 150 characters" }),
    fullname: z.string().max(100),
  });

  const { register, handleSubmit, formState: {errors, isDirty} } = useForm<InfoFormData>({
    resolver: zodResolver(schema)
  });

  const usernameSchema = z.object({
    username: z.string().min(1, {message: "Username required"}).max(100, { message: "Username should not be longer than 100 characters" })
  });

  const { register: usernameRegister, handleSubmit: usernameHandleSubmit, formState: {errors: usernameErrors, isDirty:usernameIsDirty} } = useForm<UsernameFormData>({
    resolver: zodResolver(usernameSchema)
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateImage = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    try {
      const response = await uploadCloudinary(file);
      updateProfile({
        user_id,
        profile: response.url
      })
    } catch (error) {
      console.log('Error uploading image: ', error);
    }
  }

  const handleChangeProfileInfo = (data: InfoFormData) => {
    updateProfileInfo({
      user_id,
      bio: data.bio,
      fullname: data.fullname
    })
  };

  function handleChangeUsername(data: UsernameFormData){
    updateUsername({
      user_id,
      username: data.username.split(" ").join("")
    },
      {
        onSuccess(data) {
          if(data.message === "success"){
            setIsUpdateUsernameOpen(false)
          }
        }
      }
    )
    
  }

  return (
    <div className="text-white">
      <h2 className="mt-10 ml-10 text-2xl">Edit profile</h2>
      {/* ... (profile picture and image upload) ... */}
        <div className="img-holder mt-10 mb-5 flex flex-row">
          <div className="px-8 flex justify-end items-center basis-1/4"> 
            {traderQuery?.isLoading
              ? <div className="profile w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-500"></div>
              : <img
                src={traderQuery?.data?.trader.profile}
                alt={`Profile Image`}
                className="object-cover rounded-full shadow-sm w-10 h-10"
              />
            }
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleUpdateImage}
          />

          {traderQuery?.isLoading
            ? <div className="btn flex basis-3/4 mr-20 flex-col justify-center gap-1">
              <div className="un h-3 rounded-md bg-gray-300 dark:bg-gray-400 w-20"></div>
              <div className="un h-3 rounded-md bg-gray-300 dark:bg-gray-400 w-20"></div>
            </div>
            : <div className="choose-btn basis-3/4 mr-20">
                <div className="username flex gap-3">
                  <h3>{traderQuery?.data?.trader.username}</h3>
                  <BiEdit onClick={() => setIsUpdateUsernameOpen(true)} className="w-6 h-6 text-blue-500 dark:text-sky-500 cursor-pointer"/>
                </div>
                {isProfileUpdating ? (
                    <h3 className="text-sky-500 font-semibold">
                      Uploading...
                    </h3>
                  ) : (
                    <h3
                      onClick={handleButtonClick}
                      className="text-blue-500 dark:text-sky-500 font-semibold cursor-pointer"
                    >
                      Change picture
                    </h3>
                  )
                }
          </div>
          }
        </div>
      {/* ... (profile picture and image upload) ... */}
      {traderQuery?.isLoading
        ? <div className="flex justify-center">Loading...</div>
        : <div className="infos">
          <form onSubmit={handleSubmit(handleChangeProfileInfo)}>
            <div className="bio flex flex-row mb-5">
              <aside className="px-8 text-right basis-1/4 mt-2">Bio</aside>
              <div className="text-area basis-3/4 mr-20 flex flex-col">
                <textarea
                  {...register("bio")}
                  defaultValue={bio}
                  className="rounded focus:outline-none px-4 py-2 bg-gray-400 dark:bg-gray-500"
                  id="bio"
                  rows={3}
                />
                {errors.bio && (
                  <span className="text-red-400 text-center text-sm">
                    {errors.bio.message}
                  </span>
                )}
              </div>
            </div>
            <div className="fullname flex flex-row mb-5">
              <aside className="px-8 text-right basis-1/4 mt-2">Fullname</aside>
              <div className="fullname-input basis-3/4 mr-20 flex flex-col">
                <input
                  type="text"
                  {...register("fullname")}
                  defaultValue={fullname}
                  className="rounded focus:outline-none px-4 py-2 bg-transparent border border-gray-400 dark:border-gray-500 "
                  id="fullname"
                />
                {errors.fullname && (
                  <span className="text-red-400 text-center text-sm">
                    {errors.fullname.message}
                  </span>
                )}
              </div>
            </div>
            <div className="submit flex flex-row mb-5">
              <aside className="px-8 basis-1/4 mt-2"></aside>
              <div className="rounded basis-3/4 mr-20">
              {isProfileInfoUpdating
                ?  <button className={`py-2 px-6 font-bold bg-[#0095F6] rounded-lg opacity-50`} disabled>
                Updating...
                </button>
                :  <button type="submit" className={`py-2 px-6 font-bold bg-[#0095F6] rounded-lg ${!isDirty ? "opacity-50" : ''}`} disabled={!isDirty}>
                Update
                </button>
              }
              </div>
            </div>
          </form>
        </div>
      }
      {/* UPDATE USERNAME MODAL */}
      <Modal open={isUpdateUsernameOpen} onClose={() => setIsUpdateUsernameOpen(false)}>
        <div className="update-username text-gray-950 p-5 bg-white">
          <h2 className="font-extrabold text-center pb-3 text-lg uppercase">Change Username</h2>
          <form onSubmit={usernameHandleSubmit(handleChangeUsername)} className="flex flex-col">
            <label className="text-sm">New username</label>
            <input defaultValue={username} {...usernameRegister("username")} type="text" className="py-2 px-4 rounded-lg bg-gray-200 border-2 border-gray-300" />
            {usernameErrors.username && (
              <span className="text-red-400 text-center text-sm">
                {usernameErrors.username.message}
              </span>
            )}
            {isUsernameUpdating
                ?  <button className={`py-2 px-6 font-bold text-white mt-5 bg-[#0095F6] rounded-lg opacity-50`} disabled>
                Saving...
                </button>
                :  <button type="submit" className={`py-2 px-6 font-bold text-white mt-5 bg-[#0095F6] rounded-lg ${!usernameIsDirty ? "opacity-50" : ''}`} disabled={!usernameIsDirty}>
                Save
                </button>
              }
            <div onClick={() => setIsUpdateUsernameOpen(false)} className="py-2 px-6 font-bold text-gray-400 mt-2 text-center bg-gray-300 rounded-lg">Cancel</div>
          </form>
        </div>
      </Modal>
      {/* UPDATE USERNAME MODAL */}
    </div>
  );
}
