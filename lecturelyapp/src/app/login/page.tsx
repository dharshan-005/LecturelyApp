"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

import { Input } from "../../components/ui/input";
import { useEffect, useState } from "react";

import logo from "../../../public/assets/LA.png";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  // password visibility toggle state
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  // Wait until session is resolved (avoid hydration errors)
  if (status === "loading")
    return <div className="min-h-screen bg-black/5"></div>;

  // If redirecting → do not render UI (hook order already stable)
  if (status === "authenticated") {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setLocalError("Invalid email or password");
      } else {
        router.replace("/");
      }
    } catch (err) {
      setLocalError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="relative flex flex-col justify-center items-center min-h-screen bg-wrapper">
        <div className="absolute inset-0 -z-10 flex flex-col justify-center gap-10 select-none">
          <div className="bg-row move-right text-white">
            A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا
            א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
          </div>

          <div className="bg-row move-left text-white">
            A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا
            א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
          </div>

          <div className="bg-row move-right text-white">
            A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا
            א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
          </div>

          <div className="bg-row move-left text-white">
            A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا
            א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
          </div>

          <div className="bg-row move-right text-white">
            A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا
            א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
          </div>
        </div>
        
        <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-12 rounded-3xl shadow-xl dark:shadow-2xl border border-indigo-50 dark:border-slate-700 text-center transition-all duration-300 hover:shadow-2xl flex flex-col gap-4 w-full max-w-md">
          {/* <div className="bg-[linear-gradient(106.91deg,rgba(255,255,255,0.1)_3.73%,rgba(255,255,255,0.02)_97.95%)] shadow-[3px_4px_8px_rgba(0,0,0,0.25)] backdrop-blur-[7.5px] rounded-[25px] flex flex-col gap-4 w-full max-w-md p-12 text-center"> */}
          <div>
            <img
              src={logo.src}
              alt="Lecturely.Ai Logo"
              className="w-25 h-25 mx-auto rounded-2xl"
            />
          </div>
          <h1 className="font-bold text-2xl">Welcome to Lecturely.AI</h1>
          <h2 className="font-semibold text-[22px]">Login</h2>
          {/* <h3>Login with Google</h3> */}
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              className="border-black"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex items-center gap-1.5">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border-black"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer text-lg"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline text-[12px] flex justify-start"
            >
              Forgot your password?
            </a>

            <button className="bg-black text-white px-4 py-2 rounded hover:bg-indigo-500 hover:text-black cursor-pointer">
              Login
            </button>

            {localError && <p className="text-red-500">{localError}</p>}
          </form>

          <hr className="border-black/40 border-t dark:border-white/20" />

          <button
            onClick={() => {
              signIn("google", { callbackUrl: "/" });
            }}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 cursor-pointer flex justify-center items-center gap-2 border border-gray-300"
          >
            <FaGoogle />
            Login with Google
          </button>

          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline mt-4">
              Register
            </a>
          </p>

          <a href="/" className="text-blue-500 hover:underline mt-2">
            Go to Home
          </a>
        </div>
      </div>
    </>
  );
}

/* Rectangle 17 

box-sizing: border-box;

position: absolute;
width: 360px;
height: 264px;
left: 17px;
top: 179px;

background: linear-gradient(106.91deg, rgba(255, 255, 255, 0.1) 3.73%, rgba(255, 255, 255, 0.02) 97.95%);
box-shadow: 3px 4px 8px rgba(0, 0, 0, 0.25);
backdrop-filter: blur(7.5px);
border-radius: 25px;
 */
