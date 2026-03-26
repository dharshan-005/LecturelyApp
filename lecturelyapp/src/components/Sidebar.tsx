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

import { BsArrowLeftShort, BsPerson } from "react-icons/bs";

import { useRouter } from "next/navigation";
import logo from "../../public/assets/LA.png";

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isActive, setIsActive] = useState("home");
  const [openLang, setOpenLang] = useState(false);
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const sections = ["home", "tools", "summary", "contact"];

    const handleScroll = () => {
      let current = "home";

      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const top = section.offsetTop - 150;
        const height = section.offsetHeight;

        if (window.scrollY >= top && window.scrollY < top + height) {
          current = id;
        }
      });

      setIsActive(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-screen ${open ? "w-64" : "w-24"} bg-white dark:bg-black border-r border-slate-200 dark:border-slate-800 p-6 flex-col justify-between z-50`}
      >
        <div className="flex flex-col h-full justify-between">
          <BsArrowLeftShort
            className={`bg-white text-black text-3xl rounded-full absolute -right-3 top-9 border border-[#081A51] cursor-pointer ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img src={logo.src} className="w-10 h-10 rounded-xl" />
              {open && <span className="font-bold text-xl">Lecturely.AI</span>}
            </div>

            {/* Nav Links */}
            <div className="mt-4">
              <nav className={`flex flex-col gap-4 rounded-md`}>
                {[
                  { id: "home", label: "Home", icon: Home },
                  { id: "tools", label: "Tools", icon: ToolCase },
                  { id: "summary", label: "Summary", icon: FileText },
                  { id: "contact", label: "Contact", icon: Contact },
                ].map(({ id, label, icon: Icon }) => (
                  <div key={id} className="relative group">
                    <a
                      key={id}
                      href={`#${id}`}
                      className={`flex items-center hover:text-indigo-500 ${
                        open ? "justify-start gap-3" : "justify-center"
                      } ${
                        isActive === id ? "text-indigo-500" : "text-slate-500"
                      }`}
                    >
                      <Icon
                        className={` ${open ? "w-5 h-5" : ""} text-current`}
                      />
                      {open && <span>{label}</span>}
                    </a>
                    {!open && (
                      <span className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                        {label}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          <div>
            <a href="">History</a>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-4">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              className={`flex items-center ${
                open ? "gap-2" : "justify-center"
              }`}
            >
              {isDarkMode ? <Moon /> : <Sun />}
              {open && (isDarkMode ? "Dark" : "Light")}
            </button>

            {/* Language */}
            <DropdownMenu open={openLang} onOpenChange={setOpenLang}>
              <DropdownMenuTrigger
                className={`flex items-center ${
                  open ? "gap-2" : "justify-center"
                }`}
              >
                <Languages />
                {open && "Language"}
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem>EN</DropdownMenuItem>
                <DropdownMenuItem>JA</DropdownMenuItem>
                <DropdownMenuItem>TA</DropdownMenuItem>
                <DropdownMenuItem>HI</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth */}
            {!session ? (
              <Button
                onClick={() => router.push("/login")}
                className={`${!open && "px-2"}`}
              >
                {open ? "Log in" : <LogIn />}
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => router.push("/profile")}
                  className={`${!open && "px-2"}`}
                >
                  <BsPerson />
                  {open && "Profile"}
                </Button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <div className="p-5">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50"
        >
          <img src={logo.src} className="w-10 h-10 rounded-xl" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800 flex justify-around items-center py-3 z-50">
        {[
          { id: "home", icon: Home },
          { id: "tools", icon: ToolCase },
          { id: "summary", icon: FileText },
          { id: "contact", icon: Contact },
        ].map(({ id, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`flex flex-col items-center ${
              isActive === id ? "text-indigo-500" : "text-slate-500"
            }`}
          >
            <Icon className="w-6 h-6" />
          </a>
        ))}
      </div>
    </>
  );
};
