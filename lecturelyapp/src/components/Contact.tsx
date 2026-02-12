import React from "react";

const Contact = () => {
  return (
    <div id="contact">
      <div className="md:px-36 py-5.5 md:py-11 flex flex-row justify-around">
        <div className="flex items-center">
          {/*About*/}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold md:text-xl shadow-lg dark:shadow-none">
              L
            </div>
            <span className="font-bold md:text-2xl text-slate-800 dark:text-slate-100 tracking-tight">
              Lecturely.ai
            </span>
          </a>
        </div>
        <div>
          {/*Social Media*/}

          {/*Tools Info*/}
          <ul>
            <h1 className="pb-1 md:pb-3 font-bold text-[14px] md:text-[16px]">Tools</h1>
            <hr className="border-t-2 border-slate-950 dark:border-slate-300" />
            <div className="pt-2 md:pt-5 text-gray-500 text-[12px] md:text-[15px]">
              <li>Video Translator</li>
              <li>Audio Translator</li>
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
