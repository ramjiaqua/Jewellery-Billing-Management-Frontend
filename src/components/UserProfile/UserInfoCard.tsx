import api from "../../common/axiosConfig.tsx";
import { useEffect, useState } from "react";

export default function UserInfoCard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");
  const getUserByUsername = async (username: string) => {
    const response = await api.get(`/api/users/profile/${username}`);
    console.log('/api/users/profile/${username}');
    console.log(response);
    return response.data;
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!username) return;
        const data = await getUserByUsername(username);
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchUser();
  }, [username]);

  console.log(user);
  if (loading) return <div>Loading...</div>;

  if (!user) return <div>No user found</div>;



  return (
      <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src="/images/user/owner.jpg" alt="user"/>
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.fullname}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.role}
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.fullname}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                User Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.username}
              </p>
            </div>


            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.emailid}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Mobile Number
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.phonenumber}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.address}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Service Start Date
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.startdate}
              </p>
            </div>
          </div>
        </div>


      </div>


    </div>

      </>
  );
}
