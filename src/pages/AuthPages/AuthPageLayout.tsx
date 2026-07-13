import React from "react";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFFDF7] via-[#FFF8E8] to-[#FDE8A8]">

            {/* Decorative Background */}
           {/* <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-400 blur-3xl opacity-20"></div>

                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-400 blur-3xl opacity-20"></div>
            </div>*/}

            {/* Theme Toggle */}
          {/*  <div className="fixed top-6 right-6 z-50">
                <ThemeTogglerTwo />
            </div>*/}

            {/* Login Content */}
            <div className="relative z-10 flex min-h-screen flex-col">

                <main className="flex flex-1 items-center justify-center px-6 py-4">
                    {children}
                </main>

                {/* Footer */}
                <footer className="border-t border-yellow-300 bg-gradient-to-br
from-[#FFFDF7]
via-[#FFF8E8]
to-[#FDE8A8] /60 backdrop-blur-md py-5 text-center shadow-inner">

                      <p className="mt-2 text-xs text-black-400">
                        Powered by RK Tech Labs. Mob: 9488492321.
                    </p>

                </footer>

            </div>
        </div>
    );
}


