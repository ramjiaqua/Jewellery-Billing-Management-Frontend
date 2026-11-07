import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router-dom";

export default function UserDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const fullName = localStorage.getItem("fullname") || "User";
    const userName = localStorage.getItem("username") || "";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        localStorage.removeItem("fullname");

        navigate("/");
    };

    function toggleDropdown() {
        setIsOpen((previous) => !previous);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    return (
        <div className="relative">
            {/* User Button */}
            <button
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                className="
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    border
                    border-transparent
                    bg-white
                    px-2
                    py-1.5
                    transition-colors
                    hover:border-slate-200
                    hover:bg-slate-50
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-100
                "
            >
                {/* Profile Image */}
                <span
                    className="
                        h-9
                        w-9
                        shrink-0
                        overflow-hidden
                        rounded-full
                        border
                        border-slate-200
                        bg-slate-100
                    "
                >
                    <img
                        src="/images/user/Male.jpg"
                        alt="User"
                        className="h-full w-full object-cover"
                    />
                </span>

                {/* User Details */}
                <span className="hidden text-left sm:block">
                    <span className="block text-[11px] font-medium leading-4 text-slate-400">
                        Welcome
                    </span>

                    <span className="block max-w-[150px] truncate text-sm font-semibold leading-5 text-slate-700">
                        {fullName}
                    </span>

                    <span className="block max-w-[150px] truncate text-[11px] leading-4 text-slate-400">
                        {userName}
                    </span>
                </span>

                {/* Arrow */}
                <svg
                    className={`
shrink-0
text-slate-400
transition-transform
duration-200
${isOpen ? "rotate-180" : ""}
`}
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {/* Dropdown */}
            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="
                    absolute
                    right-0
                    mt-2
                    w-72
                    overflow-hidden
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    shadow-lg
                "
            >
                {/* Dropdown Header */}
                <div
                    className="
                        border-b
                        border-slate-200
                        bg-slate-50
                        px-5
                        py-4
                    "
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="
                                h-11
                                w-11
                                shrink-0
                                overflow-hidden
                                rounded-full
                                border
                                border-slate-200
                                bg-white
                            "
                        >
                            <img
                                src="/images/user/Male.jpg"
                                alt="User"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {fullName}
                            </p>

                            <p className="mt-0.5 truncate text-xs text-slate-500">
                                {userName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <ul className="border-b border-slate-200 p-2">
                    <li>
                        <DropdownItem
                            onItemClick={closeDropdown}
                            tag="a"
                            to="/profile"
                            className="
                                group
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-lg
                                px-3
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-600
                                transition-colors
                                hover:bg-blue-50
                                hover:text-blue-700
                            "
                        >
                            {/* Profile Icon */}
                            <span
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-slate-100
                                    text-slate-500
                                    transition-colors
                                    group-hover:bg-blue-100
                                    group-hover:text-blue-600
                                "
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </span>

                            <span>View Profile</span>
                        </DropdownItem>
                    </li>
                </ul>

                {/* Logout */}
                <div className="p-2">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            group
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-3
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-600
                            transition-colors
                            hover:bg-red-50
                            hover:text-red-600
                        "
                    >
                        {/* Logout Icon */}
                        <span
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-slate-100
                                text-slate-500
                                transition-colors
                                group-hover:bg-red-100
                                group-hover:text-red-600
                            "
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497V14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497V5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501H14.3507V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609H18.5007C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609V18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484H16.0007C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484H5.81528L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </span>

                        <span>Sign Out</span>
                    </button>
                </div>
            </Dropdown>
        </div>
    );
}