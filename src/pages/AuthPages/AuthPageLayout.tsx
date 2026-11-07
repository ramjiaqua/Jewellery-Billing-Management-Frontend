import React from "react";

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">

            {/* =====================================================
                MAIN LAYOUT
            ===================================================== */}

            <div className="flex min-h-screen flex-col">

                {/* =================================================
                    CONTENT
                ================================================= */}

                <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <div className="w-full">
                        {children}
                    </div>
                </main>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center">

                    <p className="text-xs text-slate-400">
                        Powered by{" "}
                        <span className="font-medium text-slate-500">
                            RK Tech Labs
                        </span>
                        {" "}·{" "}
                        Mob: 9488492321
                    </p>

                </footer>

            </div>
        </div>
    );
}

