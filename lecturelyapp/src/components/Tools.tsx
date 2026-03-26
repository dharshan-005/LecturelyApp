import React, { useState } from "react";

import Link from "next/link";

const Tools = () => {
  // const [activeTab, setActiveTab] = useState<string>("video-to-text");

  return (
    <>
      <main id="tools" className="w-auto h-screen pt-8 md:ml-64">
        <div className="h-full">
          <h1 className="text-3xl font-bold text-center dark:text-slate-200">
            Explore Our Tools
          </h1>
          <p className="text-center mt-4 text-slate-700 dark:text-slate-300">
            Choose from our powerful tools to convert your media into text.
          </p>

          <div className="flex m-4 justify-around gap-6 py-6 dark:text-slate-400 h-full">
            <div className="text-center text-slate-700 dark:text-slate-300 border-2 rounded-2xl h-3/4 w-2/6 p-4">
              <h2 className="text-lg">Video to Text</h2>
            </div>
            <div className="text-center text-slate-700 dark:text-slate-300 border-2 rounded-2xl h-3/4 w-2/6 p-4">
              <h2 className="text-lg">Audio to Text</h2>
            </div>
          </div>
        </div>
      </main>
      {/* <div id="tools" className="w-full h-screen pt-8">
        {/* Tab Titles 
        <div className="flex justify-center gap-6 py-6 dark:text-slate-400">
          <p
            className={`cursor-pointer pb-1 border-b-2 transition-all ${
              activeTab === "video-to-text"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent hover:border-slate-400"
            }`}
            onClick={() => setActiveTab("video-to-text")}
          >
            Video to Text
          </p>

          <p
            className={`cursor-pointer pb-1 border-b-2 transition-all ${
              activeTab === "audio-to-text"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent hover:border-slate-400"
            }`}
            onClick={() => setActiveTab("audio-to-text")}
          >
            Audio to Text
          </p>
        </div>

        {/* Tab Contents 
        <div className="border-2 h-8/12 pt-7 border-black/25 dark:border-white/25 mx-11 rounded-2xl text-center mt-4">
          {activeTab === "video-to-text" && (
            <>
              <div className="text-slate-700 dark:text-slate-300">
                <h2 className="text-xl font-semibold">Video to Text</h2>
                <p className="mt-2">
                  Generate accurate transcripts from videos.
                </p>
              </div>
              <div className="w-full px-8 h-9/12">
                <div className="flex flex-row items-center gap-6 mt-6">
                  <section className="flex flex-row justify-center items-center gap-4">
                    <div className="w-64 h-40 border-2 border-black rounded-2xl"></div>
                    <div className="flex justify-center items-center">
                      -----&gt;
                    </div>
                    <div className="w-64 h-40 border-2 border-black rounded-2xl"></div>
                  </section>

                  <hr className="border-t border-slate-950 dark:border-slate-300" />

                  <section className="w-full">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolor saepe consequatur cumque perspiciatis animi nostrum
                      nobis dicta harum cum mollitia sint necessitatibus
                      dignissimos commodi earum et repudiandae rem odio,
                      corporis voluptatum! Soluta itaque veniam delectus quis
                      maiores molestias, blanditiis laboriosam nostrum incidunt
                      dolor. Laudantium voluptatem dolore ullam nihil illo
                      impedit!
                    </p>
                  </section>
                </div>
                <a href="/VideoToText" className="p-4 pt-10 flex justify-end">
                  Get Started
                </a>
              </div>
            </>
          )}

          {activeTab === "audio-to-text" && (
            <>
              <div className="text-slate-700 dark:text-slate-300">
                <h2 className="text-xl font-semibold">Audio to Text</h2>
                <p className="mt-2">Convert audio recordings into text.</p>
              </div>
              <div className="w-full px-8 h-9/12">
                <div className="flex flex-row items-center gap-6 mt-6">
                  <section className="flex flex-row justify-center items-center gap-4">
                    <div className="w-64 h-40 border-2 border-black rounded-2xl"></div>
                    <div className="flex justify-center items-center">
                      -----&gt;
                    </div>
                    <div className="w-64 h-40 border-2 border-black rounded-2xl"></div>
                  </section>

                  <hr className="border-t border-slate-950 dark:border-slate-300" />

                  <section className="w-full">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Dolor saepe consequatur cumque perspiciatis animi nostrum
                      nobis dicta harum cum mollitia sint necessitatibus
                      dignissimos commodi earum et repudiandae rem odio,
                      corporis voluptatum! Soluta itaque veniam delectus quis
                      maiores molestias, blanditiis laboriosam nostrum incidunt
                      dolor. Laudantium voluptatem dolore ullam nihil illo
                      impedit!
                    </p>
                  </section>
                </div>
                <a href="/AudioToText" className="p-4 pt-10 flex justify-end">
                  Get Started
                </a>
              </div>
            </>
          )}
        </div>
      </div> */}
    </>
  );
};

export default Tools;
