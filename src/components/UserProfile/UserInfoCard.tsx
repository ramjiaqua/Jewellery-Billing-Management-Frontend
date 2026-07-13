import api from "../../common/axiosConfig.tsx";
import {useEffect, useState} from "react";

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
    if (loading) return <div className="flex items-center justify-center py-20">

        <div className="text-center">

            <div
                className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>

            <p className="mt-4 text-yellow-700 font-semibold">

                Loading Profile...

            </p>

        </div>

    </div>;

    if (!user) return <div className="rounded-3xl bg-red-50 border border-red-200 p-8 text-center">

        <h2 className="text-red-600 text-xl">

            No Profile Found

        </h2>

    </div>;


    return (
        <>
            <div className="
rounded-3xl
border
border-yellow-300
bg-gradient-to-br
from-white
via-yellow-50
to-yellow-100
shadow-xl
p-8
">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                        <div
                            className="
h-28
w-28
overflow-hidden
rounded-full
border-4
border-white
shadow-2xl
ring-4
ring-yellow-300
"><img src="/images/user/Male.jpg" alt="user"   className="h-full w-full object-cover"/>
                        </div>
                        <div className="order-3 xl:order-2">
                            <h2 className="text-3xl font-bold">
                                {user.fullname}
                            </h2>

                            <p className="mt-2 text-yellow-100">
                                {user.role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="
rounded-3xl
border
border-yellow-300
bg-gradient-to-br
from-white
via-yellow-50
to-yellow-100
shadow-xl
p-8
">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="mb-8 border-b border-yellow-300 pb-4">
                        <h2 className="text-2xl font-bold text-yellow-700">
                          👤 Personal Information
                        </h2>
                      </div>

                        <div
                            className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">
                          <div className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ">
                            <p className="text-xs uppercase tracking-widest text-yellow-600">
                              👤 Name
                            </p>
                            <p className="mt-2 text-lg font-semibold text-gray-800">
                              {user.fullname}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ">

                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    👤 User Name
                                </p>
                            <p className="mt-2 text-lg font-semibold text-gray-800">
                                    {user.username}
                                </p>
                            </div>


                          <div className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ">

                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    📧 Email address
                                </p>
                            <p className="mt-2 text-lg font-semibold text-gray-800">
                                    {user.emailid}
                                </p>
                            </div>

                          <div className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ">

                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    📱 Mobile
                                </p>
                            <p className="mt-2 text-lg font-semibold text-gray-800">
                                    {user.phonenumber}
                                </p>
                            </div>

                          <div className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ">

                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    🏠 Address
                                </p>
                            <p className="mt-2 text-lg font-semibold text-gray-800">
                                    {user.address}
                                </p>
                            </div>

                          <div className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ">

                          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    📅 Service Date
                                </p>
                            <p className="mt-2 text-lg font-semibold text-gray-800">
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
