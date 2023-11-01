import { useRef } from "react";
import { useTrader, useUpdateProfile, useUpdateProfileInfo } from "../../hooks/queries/useTrader";
import { useAuthStore } from "../../hooks/state";
import { uploadCloudinary } from "../../api/upload";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type InfoFormData = {
  bio: string;
  fullname: string;
};

export default function Editprofile() {
  const { user_id } = useAuthStore((state) => state);
  const traderQuery = useTrader(user_id);

  const bio = traderQuery?.data?.trader?.bio;
  const fullname = traderQuery?.data?.trader?.fullname;

  const { mutate: updateProfile, isLoading: isProfileUpdating } = useUpdateProfile();
  
  const { mutate: updateProfileInfo, isLoading: isProfileInfoUpdating } = useUpdateProfileInfo();
  

  const schema = z.object({
    bio: z.string().max(150, { message: "Bio should not be longer than 150 characters" }),
    fullname: z.string().max(100),
  });

  const { register, handleSubmit, formState: {errors, isDirty} } = useForm<InfoFormData>({
    resolver: zodResolver(schema)
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
            <h3>{traderQuery?.data?.trader.username}</h3>
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
    </div>
  );
}
