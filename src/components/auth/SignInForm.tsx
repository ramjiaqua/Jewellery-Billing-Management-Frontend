import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../common/axiosConfig";
import { useNavigate } from "react-router-dom";
import {
    SHOP_NAME,
    SHOP_ADDRESS,
    SHOP_PHONE,
    SHOP_CITYZIP,
} from "../../common/constants";

type LoginUser = {
    username: string;
    password: string;
};

export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);

    const [user, setUser] = useState<LoginUser>({
        username: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const username = user.username.trim();
        const password = user.password;

        if (!username || !password) {
            alert("Please enter username and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/api/auth/login", {
                username,
                password,
            });

            const data = response.data;

            localStorage.setItem("token", data.token || "");
            localStorage.setItem("role", data.role || "");
            localStorage.setItem("username", data.username || username);
            localStorage.setItem("fullname", data.fullname || "");

            navigate("/home", { replace: true });
        } catch (error: any) {
            console.error("Login failed:", error);

            const message =
                error?.response?.data?.message ||
                error?.response?.data ||
                "Invalid username or password.";

            alert(
                typeof message === "string"
                    ? message
                    : "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-slate-50">

            <div className="flex justify-center px-4 py-3 sm:px-6">

                <div className="w-full max-w-md">

                    {/* =================================================
                        BRAND HEADER
                    ================================================== */}

                    <div className="mb-4 text-center">

                        <div className="mb-3 flex justify-center">
                            <div
                                className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                shadow-sm
                                "
                            >
                                <img
                                    src="/images/logo/logo.jpeg"
                                    alt={`${SHOP_NAME} logo`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                            {SHOP_NAME}
                        </h1>

                        <p className="mt-1 text-sm leading-5 text-slate-500">
                            {SHOP_ADDRESS} {SHOP_CITYZIP}
                        </p>

                        <p className="mt-0.5 text-sm text-slate-500">
                            {SHOP_PHONE}
                        </p>

                    </div>

                    {/* =================================================
                        LOGIN CARD
                    ================================================== */}

                    <div
                        className="
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                        sm:p-6
                        "
                    >

                        {/* Card Header */}

                        <div className="mb-5">

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-50
                                    text-blue-600
                                    "
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />

                                        <path
                                            d="M10 17L15 12L10 7"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        <path
                                            d="M15 12H3"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">
                                        Welcome Back
                                    </h2>

                                    <p className="mt-0.5 text-sm text-slate-500">
                                        Sign in to continue to your account
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            LOGIN FORM
                        ================================================== */}

                        <form onSubmit={handleLogin}>

                            <div className="space-y-4">

                                {/* Username */}

                                <div>
                                    <Label className="mb-1 block text-sm font-medium text-slate-700">
                                        Username
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </Label>

                                    <Input
                                        type="text"
                                        placeholder="Enter your username"
                                        value={user.username}
                                        disabled={loading}
                                        onChange={(e) =>
                                            setUser((previous) => ({
                                                ...previous,
                                                username: e.target.value,
                                            }))
                                        }
                                        className="
                                        h-10
                                        rounded-lg
                                        border-slate-300
                                        bg-white
                                        text-slate-800
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:ring-blue-100
                                        disabled:cursor-not-allowed
                                        disabled:bg-slate-50
                                        "
                                    />
                                </div>

                                {/* Password */}

                                <div>
                                    <Label className="mb-1 block text-sm font-medium text-slate-700">
                                        Password
                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </Label>

                                    <div className="relative">

                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={user.password}
                                            disabled={loading}
                                            onChange={(e) =>
                                                setUser((previous) => ({
                                                    ...previous,
                                                    password: e.target.value,
                                                }))
                                            }
                                            className="
                                            h-10
                                            rounded-lg
                                            border-slate-300
                                            bg-white
                                            pr-11
                                            text-slate-800
                                            placeholder:text-slate-400
                                            focus:border-blue-500
                                            focus:ring-blue-100
                                            disabled:cursor-not-allowed
                                            disabled:bg-slate-50
                                            "
                                        />

                                        <button
                                            type="button"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            disabled={loading}
                                            onClick={() =>
                                                setShowPassword(
                                                    (previous) => !previous
                                                )
                                            }
                                            className="
                                            absolute
                                            right-2
                                            top-1/2
                                            flex
                                            h-8
                                            w-8
                                            -translate-y-1/2
                                            items-center
                                            justify-center
                                            rounded-md
                                            text-slate-400
                                            hover:bg-slate-100
                                            hover:text-slate-600
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-blue-100
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            "
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="size-5" />
                                            ) : (
                                                <EyeCloseIcon className="size-5" />
                                            )}
                                        </button>

                                    </div>
                                </div>

                                {/* Sign In */}

                                <div className="pt-1">

                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={loading}
                                        className="
                                        h-10
                                        w-full
                                        rounded-lg
                                        bg-blue-600
                                        font-medium
                                        text-white
                                        shadow-sm
                                        transition-colors
                                        hover:bg-blue-700
                                        focus:ring-2
                                        focus:ring-blue-100
                                        disabled:cursor-not-allowed
                                        disabled:bg-slate-300
                                        "
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span
                                                    className="
                                                    h-4
                                                    w-4
                                                    animate-spin
                                                    rounded-full
                                                    border-2
                                                    border-white/40
                                                    border-t-white
                                                    "
                                                />
                                                Authenticating...
                                            </span>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </Button>

                                </div>

                            </div>

                        </form>

                    </div>


                </div>

            </div>

        </div>
    );
}
