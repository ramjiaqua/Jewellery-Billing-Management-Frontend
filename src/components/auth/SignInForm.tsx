import {useState} from "react";
import {EyeCloseIcon, EyeIcon} from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../common/axiosConfig";
import {useNavigate} from "react-router-dom";
import {SHOP_NAME, SHOP_ADDRESS, SHOP_PHONE} from "../../common/constants";


export default function SignInForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState({username: "", password: ""});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user.username || !user.password) {
            alert("Please enter username and password");
            return;
        }
        try {
            console.log("Inside handle login");
            console.log(user);
            setLoading(true);
            const response = await api.post(
                "/api/auth/login",
                user
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("fullname", response.data.fullname);
            console.log(localStorage.getItem("fullname"));
            navigate("/home");
            /* if (response.data.role === "ADMIN") navigate("/dashboard");
            else if (response.data.role === "STAFF") navigate("/customers");
            else navigate("/chitscheme"); */
        } catch (error: any) {
            console.error("Login failed");

            console.log(error.response?.data);
            console.log(error.response?.status);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false); // ✅ always runs
        }

    };

    return (
        <div
            className="min-h-screen  flex flex-col items-center justify-center px-6">
            <div className="flex justify-center mb-4">
                <img
                    src="/images/logo/logo.jpeg"
                    className="h-24 w-24 rounded-full border-4 border-yellow-400 shadow-xl"
                />
            </div>
            <h1
                className="text-5xl font-bold text-center bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-700 bg-clip-text text-transparent"
                style={{fontFamily: "'Cinzel', serif"}}
            >
                {SHOP_NAME}
            </h1>

            <p className="mt-2 text-center text-gray-600">
                {SHOP_ADDRESS}
            </p>

            <p className="text-center text-yellow-700 font-semibold mb-6">
                📞 {SHOP_PHONE}
            </p>


            <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-yellow-200 border border-yellow-300 shadow-[0_15px_50px_rgba(212,175,55,0.25)] p-10">
                <div className="mb-5 sm:mb-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800">
                        Welcome Back
                    </h2>

                    <p className="text-center text-gray-500 mt-2">
                        Sign in to continue
                    </p>
                </div>
                <div>
                    <form onSubmit={handleLogin}>
                        <div className="space-y-6">
                            <div>
                                <Label className="font-semibold text-yellow-700">
                                    Username <span className="text-error-500">*</span>{" "}
                                </Label>
                                <Input
                                    className="h-12 rounded-xl border-yellow-300 bg-yellow-50 focus:border-yellow-500 focus:ring-yellow-400"
                                    placeholder="Enter your username"
                                    onChange={(e) => setUser({...user, username: e.target.value})}/>
                            </div>
                            <div>
                                <Label className="font-semibold text-yellow-700">
                                    Password <span className="text-error-500">*</span>{" "}
                                </Label>
                                <div className="relative">
                                    <Input
                                        className="h-12 rounded-xl border-yellow-300 bg-yellow-50 focus:border-yellow-500 focus:ring-yellow-400"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        onChange={(e) => setUser({...user, password: e.target.value})}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                      {showPassword ? (
                          <EyeIcon className="fill-yellow-600 hover:fill-yellow-700 dark:fill-gray-400 size-5"/>
                      ) : (
                          <EyeCloseIcon className="fill-yellow-600 hover:fill-yellow-700 dark:fill-gray-400 size-5"/>
                      )}
                    </span>
                                </div>
                            </div>

                            <div>
                                <Button
                                    className="w-full rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                                    size="sm" type="submit" disabled={loading}>
                                    💍 {loading ? "Authenticating..." : "Sign In"}
                                </Button>


                             {/*   <div className="mt-8 text-center">

                                    <p className="text-sm text-gray-500">
                                        ✨ Success Through Dedication ✨
                                    </p>

                                    <p className="mt-2 text-xs text-gray-400">
                                        © 2026 {SHOP_NAME}
                                    </p>

                                </div>*/}


                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
