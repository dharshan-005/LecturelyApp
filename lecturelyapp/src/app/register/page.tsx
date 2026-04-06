"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import logo from "../../../public/assets/LA.png";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName: name, email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const errorText = await res.text();
      alert(errorText || "Registration failed");
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-wrapper background-pattern overflow-hidden">
      {/* Moving Background */}
      <div className="absolute inset-0 -z-10 flex flex-col justify-center gap-10 select-none">
        <div className="bg-row move-right text-white">
          A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا א
          Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
        </div>

        <div className="bg-row move-left text-white">
          A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا א
          Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
        </div>

        <div className="bg-row move-right text-white">
          A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا א
          Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
        </div>

        <div className="bg-row move-left text-white">
          A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا א
          Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
        </div>

        <div className="bg-row move-right text-white">
          A あ ア 漢 한 अ ا א Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו A あ ア 漢 한 अ ا א
          Α Ж ก க అ ಮ গ ᚠ Ω し 一 ㅣ ل ו
        </div>
      </div>
      <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-12 rounded-3xl shadow-xl dark:shadow-2xl border border-indigo-50 dark:border-slate-700 text-center transition-all duration-300 hover:shadow-2xl flex flex-col gap-4 w-full max-w-md">
        <div>
          <img
            src={logo.src}
            alt="Lecturely.Ai Logo"
            className="w-25 h-25 mx-auto rounded-2xl"
          />
        </div>

        <h1 className="font-bold text-2xl">Welcome to Lecturely.AI</h1>
        <h2 className="font-semibold text-[22px]">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          <Input
            type="text"
            placeholder="Name"
            className="border-black"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <button className="bg-black text-white px-4 py-2 rounded hover:bg-indigo-500 hover:text-black cursor-pointer">
            Register
          </button>

          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline mt-4">
              Login here
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
