import React from "react";
import logo from "../../public/assets/LA.png";

const Contact = () => {
  return (
    <div id="contact">
      <div className="md:px-36 py-5.5 md:py-11 flex flex-row justify-around">
        <div className="flex items-center">
          <a href="/" className="flex items-center gap-2">
            <img
              src={logo.src}
              alt="Lecturely Logo"
              className="w-10 h-10 bg-black rounded-2xl"
            />
            <span className="font-bold md:text-2xl text-slate-800 dark:text-slate-100 tracking-tight">
              Lecturely.ai
            </span>
          </a>
        </div>
        <div>
          {/*Social Media*/}

          {/*Tools Info*/}
          <ul>
            <h1 className="pb-1 md:pb-3 font-bold text-[14px] md:text-[16px]">
              Tools
            </h1>
            <hr className="border-t-2 border-slate-950 dark:border-slate-300" />
            <div className="pt-2 md:pt-5 text-gray-500 text-[12px] md:text-[15px]">
              <li>Video to Text</li>
              <li>Audio to Text</li>
            </div>
          </ul>
        </div>
      </div>
      <hr className="border-t-2 border-slate-950 dark:border-slate-300" />
      <footer className="p-5 flex justify-center text-[10px] md:text-[16px]">
        <h1>© 2025 Lecturely AI. All rights reserved.</h1>
      </footer>
    </div>
  );
};

export default Contact;
