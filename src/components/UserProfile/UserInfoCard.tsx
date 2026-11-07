import api from "../../common/axiosConfig.tsx";
import { useEffect, useState } from "react";

export default function UserInfoCard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem("username");

    const getUserByUsername = async (username: string) => {
        const response = await api.get(`/api/users/profile/${username}`);
        return response.data;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!username) {
                    setLoading(false);
                    return;
                }

                const data = await getUserByUsername(username);
                setUser(data);
            } catch (err) {
                console.error("Error fetching user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    /* -------------------- Loading -------------------- */

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div
                        className="
                            mx-auto
                            h-10
                            w-10
                            animate-spin
                            rounded-full
                            border-4
                            border-blue-100
                            border-t-blue-600
                        "
                    />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                        Loading Profile...
                    </p>
                </div>
            </div>
        );
    }

    /* -------------------- No User -------------------- */

    if (!user) {
        return (
            <div
                className="
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    p-6
                    text-center
                "
            >
                <h2 className="text-lg font-semibold text-red-600">
                    No Profile Found
                </h2>

                <p className="mt-1 text-sm text-red-500">
                    Unable to load the user profile.
                </p>
            </div>
        );
    }

    /* -------------------- Profile -------------------- */

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6">

            {/* Page Header */}
            <div
                className="
                    mb-5
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-4
                    shadow-sm
                "
            >
                <div>
                    <h1 className="text-xl font-semibold text-slate-800">
                        My Profile
                    </h1>

                    <p className="mt-0.5 text-sm text-slate-500">
                        View your account and profile information
                    </p>
                </div>
            </div>

            <div className="space-y-5">

                {/* Profile Summary */}
                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            items-center
                            gap-5
                            sm:flex-row
                        "
                    >
                        {/* Profile Image */}
                        <div
                            className="
                                h-24
                                w-24
                                shrink-0
                                overflow-hidden
                                rounded-full
                                border-4
                                border-white
                                shadow-sm
                                ring-1
                                ring-slate-200
                            "
                        >
                            <img
                                src="/images/user/Male.jpg"
                                alt="User"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* User Details */}
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-semibold text-slate-800">
                                {user.fullname || "-"}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                @{user.username || "-"}
                            </p>

                            <div className="mt-2">
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        rounded-full
                                        bg-blue-50
                                        px-3
                                        py-1
                                        text-xs
                                        font-medium
                                        text-blue-700
                                    "
                                >
                                    {user.role || "-"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div
                    className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >
                    {/* Section Header */}
                    <div
                        className="
                            mb-5
                            border-b
                            border-slate-200
                            pb-4
                        "
                    >
                        <h2 className="text-lg font-semibold text-slate-800">
                            Personal Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your account and contact details
                        </p>
                    </div>

                    {/* Information Grid */}
                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-4
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >
                        {/* Name */}
                        <ProfileField
                            label="Name"
                            value={user.fullname}
                        />

                        {/* Username */}
                        <ProfileField
                            label="Username"
                            value={user.username}
                        />

                        {/* Email */}
                        <ProfileField
                            label="Email Address"
                            value={user.emailid}
                        />

                        {/* Mobile */}
                        <ProfileField
                            label="Mobile"
                            value={user.phonenumber}
                        />

                        {/* Address */}
                        <ProfileField
                            label="Address"
                            value={user.address}
                        />

                        {/* Service Date */}
                        <ProfileField
                            label="Service Date"
                            value={user.startdate}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -------------------- Reusable Field -------------------- */

function ProfileField({
    label,
    value,
}: {
    label: string;
    value: any;
}) {
    return (
        <div
            className="
                rounded-lg
                border
                border-slate-200
                bg-white
                p-4
                transition-colors
                hover:border-slate-300
                hover:bg-slate-50
            "
        >
            <p
                className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-2
                    break-words
                    text-base
                    font-semibold
                    text-slate-800
                "
            >
                {value || "-"}
            </p>
        </div>
    );
}