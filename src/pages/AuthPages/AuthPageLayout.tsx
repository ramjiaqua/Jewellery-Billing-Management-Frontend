import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 p-6 sm:p-0">

            <div className="flex-1 flex flex-col justify-center lg:flex-row">
                {children}
            </div>

            {/* Footer */}
            <footer className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">
                &copy; {new Date().getFullYear()} - RK Tech Labs. Mob: 9488492321.
            </footer>

            {/* Theme Toggle */}
            <div className="fixed z-50 bottom-6 right-6">
                <ThemeTogglerTwo />
            </div>
        </div>
    );
}
