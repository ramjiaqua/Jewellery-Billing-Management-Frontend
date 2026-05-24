import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../common/axiosConfig";
import { useNavigate } from "react-router-dom";
import {SHOP_NAME, SHOP_ADDRESS, SHOP_PHONE} from "../../common/constants";



export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ username: "", password: "" });
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
           );          localStorage.setItem("token", response.data.token);
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
       }
        finally {
          setLoading(false); // ✅ always runs
        }
//     <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
  };

  return (
   <div className="flex flex-col flex-1">
                {/* Shop Name */}
                <h1 className="mt-20 mb-6 text-9xl font-bold tracking-wide text-center
                  bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                  text-transparent bg-clip-text drop-shadow-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {SHOP_NAME}
                </h1>
                 <h2 className="mb-6 text-4xl font-bold tracking-wide text-center
                                  bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600
                                  text-transparent bg-clip-text drop-shadow-lg"
                                  style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                {SHOP_ADDRESS}   {SHOP_PHONE}
                                </h2>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Log In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to log in!
            </p>
          </div>
          <div>
          <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="Enter your username"  onChange={(e) => setUser({...user, username: e.target.value})}/>
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password" onChange={(e) => setUser({...user, password: e.target.value})}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div>
               <Button className="w-full" size="sm" type="submit" disabled={loading}>
                 {loading ? "Logging in..." : "Log in"}
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
