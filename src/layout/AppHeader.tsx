import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import UserDropdown from "../components/header/UserDropdown";

const AppHeader: React.FC = () => {
    const [isApplicationMenuOpen, setApplicationMenuOpen] =
        useState(false);

    const {
        isMobileOpen,
        toggleSidebar,
        toggleMobileSidebar,
    } = useSidebar();

    const inputRef = useRef<HTMLInputElement>(null);

    // =========================================================
    // SIDEBAR TOGGLE
    // =========================================================

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    // =========================================================
    // MOBILE APPLICATION MENU
    // =========================================================

    const toggleApplicationMenu = () => {
        setApplicationMenuOpen((previous) => !previous);
    };

    // =========================================================
    // KEYBOARD SHORTCUT
    // =========================================================

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    // =========================================================
    // UI
    // =========================================================

    return (
        <header
            className="
                sticky
                top-0
                z-40
                w-full
                border-b
                border-slate-200
                bg-white
            "
        >

            <div
                className="
                    flex
                    h-16
                    w-full
                    items-center
                    justify-between
                    px-3
                    sm:px-4
                    lg:px-6
                "
            >

                {/* =================================================
                    LEFT SECTION
                ================================================== */}

                <div className="flex items-center gap-3">

                    {/* Sidebar Toggle */}

                    <button
                        type="button"
                        onClick={handleToggle}
                        aria-label="Toggle Sidebar"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-slate-200
                            bg-white
                            text-slate-500
                            transition-colors
                            hover:bg-slate-50
                            hover:text-slate-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-100
                            lg:h-10
                            lg:w-10
                        "
                    >

                        {isMobileOpen ? (

                            /* Close Icon */

                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6 6L18 18M18 6L6 18"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            </svg>

                        ) : (

                            /* Menu Icon */

                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 6H20"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M4 12H20"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />

                                <path
                                    d="M4 18H14"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                />
                            </svg>

                        )}

                    </button>

                    {/* =================================================
                        MOBILE LOGO
                    ================================================== */}

                    <Link
                        to="/home"
                        className="flex items-center lg:hidden"
                    >
                        <img
                            src="/images/logo/logo.jpeg"
                            alt="Logo"
                            className="
                                h-9
                                w-9
                                rounded-lg
                                border
                                border-slate-200
                                object-cover
                            "
                        />
                    </Link>

                    {/* =================================================
                        SEARCH
                    ================================================== */}

                    <div className="hidden lg:block">

                        <form
                            onSubmit={(event) =>
                                event.preventDefault()
                            }
                        >

                        </form>

                    </div>

                </div>

                {/* =================================================
                    RIGHT SECTION
                ================================================== */}

                <div
                    className={`
${
  isApplicationMenuOpen
      ? "flex"
      : "hidden"
}
items-center
gap-3
lg:flex
    `}
                >

                    {/* Mobile Application Menu */}

                    <button
                        type="button"
                        onClick={toggleApplicationMenu}
                        aria-label="Toggle application menu"
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-500
                            transition-colors
                            hover:bg-slate-50
                            hover:text-slate-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-100
                            lg:hidden
                        "
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="5"
                                cy="12"
                                r="1.5"
                                fill="currentColor"
                            />

                            <circle
                                cx="12"
                                cy="12"
                                r="1.5"
                                fill="currentColor"
                            />

                            <circle
                                cx="19"
                                cy="12"
                                r="1.5"
                                fill="currentColor"
                            />
                        </svg>
                    </button>

                    {/* =================================================
                        USER DROPDOWN
                    ================================================== */}

                    <div
                        className="
                            rounded-lg
                            border
                            border-transparent
                            transition-colors
                            hover:border-slate-200
                            hover:bg-slate-50
                        "
                    >
                        <UserDropdown />
                    </div>

                </div>

            </div>

        </header>
    );
};

export default AppHeader;