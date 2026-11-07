import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { SHOP_NAME } from "../common/constants";

import {
    ChevronDownIcon,
    GridIcon,
    HorizontaLDots,
    UserCircleIcon,
} from "../icons";

import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget.tsx";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: {
        name: string;
        path: string;
        pro?: boolean;
        new?: boolean;
    }[];
};

const userRole = localStorage.getItem("role") || "";

const navItems: NavItem[] = [

    // =========================================================
    // SALES
    // =========================================================

    ...(["ADMIN", "STAFF"].includes(userRole)
        ? [
              {
                  icon: <GridIcon />,
                  name: "Sales",
                  subItems: [
                      {
                          name: "Generate Bill",
                          path: "/generate-sales-bill",
                          pro: false,
                      },
                      {
                          name: "View Bill",
                          path: "/view-sales-bill",
                          pro: false,
                      },
                  ],
              },
          ]
        : []),

    // =========================================================
    // USER MANAGEMENT
    // =========================================================

    ...(userRole === "ADMIN"
        ? [
              {
                  icon: <UserCircleIcon />,
                  name: "Add/Modify User Profile",
                  path: "/users",
              },
          ]
        : []),

    // =========================================================
    // PROFILE
    // =========================================================

    {
        icon: <UserCircleIcon />,
        name: "Profile",
        path: "/profile",
    },
];

const AppSidebar: React.FC = () => {
    const {
        isExpanded,
        isMobileOpen,
        isHovered,
        setIsHovered,
    } = useSidebar();

    const location = useLocation();

    const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);

    const [subMenuHeight, setSubMenuHeight] = useState<
        Record<string, number>
    >({});

    const subMenuRefs = useRef<
        Record<string, HTMLDivElement | null>
    >({});

    // =========================================================
    // ACTIVE MENU
    // =========================================================

    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname]
    );

    // =========================================================
    // OPEN SUBMENU BASED ON CURRENT ROUTE
    // =========================================================

    useEffect(() => {
        let submenuIndex: number | null = null;

        navItems.forEach((nav, index) => {
            if (nav.subItems) {
                nav.subItems.forEach((subItem) => {
                    if (isActive(subItem.path)) {
                        submenuIndex = index;
                    }
                });
            }
        });

        setOpenSubmenu(submenuIndex);
    }, [location.pathname, isActive]);

    // =========================================================
    // SUBMENU HEIGHT
    // =========================================================

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `main-${openSubmenu}`;
            const element = subMenuRefs.current[key];

            if (element) {
                setSubMenuHeight((previous) => ({
                    ...previous,
                    [key]: element.scrollHeight,
                }));
            }
        }
    }, [openSubmenu]);

    // =========================================================
    // SUBMENU TOGGLE
    // =========================================================

    const handleSubmenuToggle = (index: number) => {
        setOpenSubmenu((previous) =>
            previous === index ? null : index
        );
    };

    // =========================================================
    // MENU ITEMS
    // =========================================================

    const renderMenuItems = (items: NavItem[]) => (
        <ul className="flex flex-col gap-1.5">

            {items.map((nav, index) => (

                <li key={nav.name}>

                    {/* =================================================
                        MENU WITH SUBMENU
                    ================================================== */}

                    {nav.subItems ? (
                        <>

                            <button
                                type="button"
                                onClick={() =>
                                    handleSubmenuToggle(index)
                                }
                                className={`
menu-item
group
w-full
transition-colors
duration-150
${
    openSubmenu === index
        ? "menu-item-active"
        : "menu-item-inactive"
}
${
    !isExpanded &&
    !isHovered
        ? "lg:justify-center"
        : "lg:justify-start"
}
`}
                            >

                                {/* Icon */}

                                <span
                                    className={`
menu-item-icon-size
${
    openSubmenu === index
        ? "menu-item-icon-active"
        : "menu-item-icon-inactive"
}
`}
                                >
                                    {nav.icon}
                                </span>

                                {/* Menu Text */}

                                {(isExpanded ||
                                    isHovered ||
                                    isMobileOpen) && (
                                    <span className="menu-item-text">
                                        {nav.name}
                                    </span>
                                )}

                                {/* Chevron */}

                                {(isExpanded ||
                                    isHovered ||
                                    isMobileOpen) && (
                                    <ChevronDownIcon
                                        className={`
ml-auto
h-5
w-5
transition-transform
duration-200
${
    openSubmenu === index
        ? "rotate-180 text-blue-600"
        : "text-slate-400"
}
`}
                                    />
                                )}

                            </button>

                            {/* =================================================
                                SUBMENU
                            ================================================== */}

                            {(isExpanded ||
                                isHovered ||
                                isMobileOpen) && (

                                <div
                                    ref={(element) => {
                                        subMenuRefs.current[
                                            `main-${index}`
                                        ] = element;
                                    }}
                                    className="overflow-hidden transition-all duration-200"
                                    style={{
                                        height:
                                            openSubmenu === index
                                                ? `${
    subMenuHeight[
        `main-${index}`
        ] || 0
}px`
                                                : "0px",
                                    }}
                                >

                                    <ul className="ml-9 mt-1.5 space-y-0.5">

                                        {nav.subItems.map(
                                            (subItem) => (

                                                <li
                                                    key={
                                                        subItem.name
                                                    }
                                                >

                                                    <Link
                                                        to={
                                                            subItem.path
                                                        }
                                                        className={`
menu-dropdown-item
transition-colors
duration-150
${
    isActive(
        subItem.path
    )
        ? "menu-dropdown-item-active"
        : "menu-dropdown-item-inactive"
}
`}
                                                    >
                                                        {subItem.name}
                                                    </Link>

                                                </li>

                                            )
                                        )}

                                    </ul>

                                </div>
                            )}

                        </>
                    ) : (

                        /* =================================================
                           NORMAL MENU ITEM
                        ================================================== */

                        nav.path && (

                            <Link
                                to={nav.path}
                                className={`
menu-item
group
transition-colors
duration-150
${
    isActive(nav.path)
        ? "menu-item-active"
        : "menu-item-inactive"
}
${
    !isExpanded &&
    !isHovered
        ? "lg:justify-center"
        : "lg:justify-start"
}
`}
                            >

                                {/* Icon */}

                                <span
                                    className={`
menu-item-icon-size
${
    isActive(nav.path)
        ? "menu-item-icon-active"
        : "menu-item-icon-inactive"
}
`}
                                >
                                    {nav.icon}
                                </span>

                                {/* Text */}

                                {(isExpanded ||
                                    isHovered ||
                                    isMobileOpen) && (

                                    <span className="menu-item-text">
                                        {nav.name}
                                    </span>

                                )}

                            </Link>

                        )
                    )}

                </li>

            ))}

        </ul>
    );

    // =========================================================
    // SIDEBAR
    // =========================================================

    return (
        <aside
            className={`
fixed
left-0
top-0
z-50
flex
h-screen
flex-col
border-r
border-slate-200
bg-white
px-4
text-slate-700
transition-all
duration-300
ease-in-out

lg:translate-x-0

${
    isExpanded ||
    isMobileOpen ||
    isHovered
        ? "w-[280px]"
        : "w-[84px]"
}

${
    isMobileOpen
        ? "translate-x-0"
        : "-translate-x-full"
}
`}
            onMouseEnter={() =>
                !isExpanded && setIsHovered(true)
            }
            onMouseLeave={() =>
                setIsHovered(false)
            }
        >

            {/* =====================================================
                BRAND
            ===================================================== */}

            <div
                className={`
flex
h-20
shrink-0
items-center
${
    !isExpanded &&
    !isHovered
        ? "lg:justify-center"
        : "justify-start"
}
`}
            >

                <Link
                    to="/home"
                    className="w-full"
                >

                    {isExpanded ||
                    isHovered ||
                    isMobileOpen ? (

                        <div
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                px-4
                                py-3
                                text-center
                                shadow-sm
                            "
                        >

                            <h1
                                className="
                                    truncate
                                    text-lg
                                    font-semibold
                                    tracking-tight
                                    text-slate-800
                                "
                            >
                                {SHOP_NAME}
                            </h1>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Billing System
                            </p>

                        </div>

                    ) : (

                        <div className="flex justify-center">

                            <img
                                src="/images/logo/logo.jpeg"
                                alt={`${SHOP_NAME} logo`}
                                width={38}
                                height={38}
                                className="
                                    h-10
                                    w-10
                                    rounded-lg
                                    border
                                    border-slate-200
                                    object-cover
                                    shadow-sm
                                "
                            />

                        </div>

                    )}

                </Link>

            </div>

            {/* =====================================================
                NAVIGATION
            ===================================================== */}

            <div
                className="
                    flex
                    flex-1
                    flex-col
                    overflow-y-auto
                    pb-4
                    no-scrollbar
                "
            >

                <nav>

                    {/* Section Heading */}

                    <div className="mb-3">

                        <h2
                            className={`
flex
items-center
text-[11px]
font-semibold
uppercase
tracking-wider
text-slate-400
${
    !isExpanded &&
    !isHovered
        ? "lg:justify-center"
        : "justify-start"
}
`}
                        >

                            {isExpanded ||
                            isHovered ||
                            isMobileOpen ? (

                                "Menu"

                            ) : (

                                <HorizontaLDots className="size-5" />

                            )}

                        </h2>

                    </div>

                    {/* Menu */}

                    {renderMenuItems(navItems)}

                </nav>

                {/* =================================================
                    SIDEBAR WIDGET
                ================================================== */}

                {isExpanded ||
                isHovered ||
                isMobileOpen ? (
                    <div className="mt-auto pt-4">
                        <SidebarWidget />
                    </div>
                ) : null}

            </div>

        </aside>
    );
};

export default AppSidebar;