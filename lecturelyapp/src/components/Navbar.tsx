import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  Languages,
  Home,
  Layers,
  FileText,
  Phone,
  Contact,
  ToolCase,
  Rocket,
  LogIn,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
// import Home from "../app/page.js";

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  // Tools dropdown
  const [openTools, setOpenTools] = useState(false);

  // Language dropdown
  const [openLang, setOpenLang] = useState(false);

  const [isActive, setIsActive] = useState("home");

  // Sticky
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const sections = ["home", "tools", "summary", "contact"];

    const handleScroll = () => {
      setIsSticky(window.scrollY > 75);

      let currentSection = "home";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (
          window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + sectionHeight
        ) {
          currentSection = id;
        }
      });
      setIsActive(currentSection);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: session } = useSession();
  const router = useRouter();

  // if(session) {
  //   router.replace("/");
  // }

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`flex items-center z-50 transition duration-300 ${
        isSticky
          ? "fixed justify-around bottom-4 left-1/2 -translate-x-1/2 rounded-2xl px-4 py-3 backdrop-blur-md bg-white/80 dark:bg-black/80 shadow-xl border border-slate-200 dark:border-slate-700 min-w-[85%] md:min-w-[35%] gap-4"
          : "relative p-4 md:p-6 max-w-7xl mx-auto w-[95%] md:w-full justify-between"
      }`}
    >
      <a href="#" className="flex items-center gap-2">
        {isSticky ? (
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none">
            L
          </div>
        ) : (
          <>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none">
              L
            </div>
            <span className="hidden md:flex font-bold text-2xl text-slate-800 dark:text-slate-100 tracking-tight">
              Lecturely.AI
            </span>
          </>
        )}
      </a>

      <div className="hidden md:flex gap-5 items-center text-slate-600 dark:text-slate-400 font-medium">
        <a
          href="#"
          className={`nav-item ${isActive === "home" ? "text-indigo-500" : "text-gray-400"}`}
        >
          {isSticky ? <Home className="w-6 h-6" /> : "Home"}
        </a>

        <a
          href="#tools"
          className={`nav-item ${isActive === "tools" ? "text-indigo-500" : "text-gray-400"}`}
        >
          {isSticky ? <ToolCase className="w-6 h-6" /> : "Tools"}
        </a>

        <a
          href="#summary"
          className={`nav-item ${isActive === "summary" ? "text-indigo-500" : "text-gray-400"}`}
        >
          {isSticky ? <FileText className="w-6 h-6" /> : "Summary"}
        </a>

        <a
          href="#contact"
          className={`nav-item ${isActive === "contact" ? "text-indigo-500" : "text-gray-400"}`}
        >
          {isSticky ? <Contact className="w-6 h-6" /> : "Contact"}
        </a>
      </div>

      <div
        className={`flex items-center ${isSticky ? "gap-4 md:gap-3" : "gap-4 md:gap-10"}`}
      >
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDarkMode ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        <div
          className={`flex flex-row items-center ${isSticky ? "gap-4 md:gap-8" : "gap-4"}`}
        >
          {/* <a href="/login" className="text-slate-600 dark:text-slate-300 font-medium hover:text-indigo-600 dark:hover:text-white transition hidden sm:block cursor-pointer">
            Log in
          </a> */}

          <Button className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-bold  hidden md:inline transition shadow-lg">
            {isSticky ? <Rocket className="w-5 h-5" /> : "Get Started"}
          </Button>
        </div>
        <DropdownMenu open={openLang} onOpenChange={setOpenLang}>
          <DropdownMenuTrigger
            onMouseEnter={() => setOpenLang(true)}
            onMouseLeave={() => setOpenLang(false)}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer flex flex-row items-center gap-1"
          >
            {/* {!isSticky ? (
              <span className="inline">Lang</span>
            ) : (
            )} */}

            <Languages className="w-5 h-5" />
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                openLang ? "rotate-180" : "rotate-0"
              }`}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            onMouseEnter={() => setOpenLang(true)}
            onMouseLeave={() => setOpenLang(false)}
          >
            <DropdownMenuItem className="cursor-pointer">EN</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">JA</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">TA</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">HI</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Not logged in → Show Login */}
        {!session && (
          <button
            onClick={() => signIn("google")}
            className="text-slate-600 dark:text-slate-300 font-medium hover:text-indigo-600 dark:hover:text-white transition hidden sm:block cursor-pointer"
          >
            {isSticky ? <LogIn className="w-5 h-5" /> : "Log in"}
          </button>
        )}

        {/* Logged in → Show Profile Image */}
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <img
                src={session.user?.image || "/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                {session.user?.email}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="cursor-pointer text-red-600"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* MMobile responsive menu */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden fixed left-5 right-5 z-60 rounded-2xl shadow-xl p-6 space-y-6
      bg-white dark:bg-black transition-all duration-300
      ${
        isSticky
          ? "bottom-24" // 👈 opens ABOVE bottom navbar
          : "top-[90px]" // 👈 normal top navbar
      }
    `}
        >
          <a
            href="#"
            className="block font-medium text-slate-700 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            {isSticky ? <Home /> : "Home"}
          </a>

          {/* Tools */}
          <a
            href="#tools"
            className="block font-medium text-slate-700 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Tools
          </a>

          <a
            href="#summary"
            className="block font-medium text-slate-700 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Summary
          </a>

          <a
            href="#contact"
            className="block font-medium text-slate-700 dark:text-slate-300"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>

          <Button
            onClick={() => {
              router.push("/signup");
              setMobileMenuOpen(false);
            }}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700"
          >
            Get Started
          </Button>

          {/* Auth */}
          {!session ? (
            <button
              onClick={() => signIn("google")}
              className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold"
            >
              Log in
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 text-white py-2 rounded-xl font-semibold"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
