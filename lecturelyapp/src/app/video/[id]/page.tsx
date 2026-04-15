"use client";

import { useState, useRef } from "react";
import { TranscriptSegment } from "@/types/transcript";

type Props = {
  params: { id: string };
};

export default function VideoPage({ params }: Props) {
  const [results, setResults] = useState<TranscriptSegment[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSearch = async (query: string) => {
    if (!query) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/search/${params.id}?query=${query}`,
    );

    const data: TranscriptSegment[] = await res.json();
    console.log("API data:", data);
    setResults(data);
  };

  const jumpTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  return (
    <div className="p-4">
      <video
        ref={videoRef}
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${params.id}`}
        controls
        className="w-full mb-4"
      />

      <input
        type="text"
        placeholder="Search keyword..."
        onChange={(e) => handleSearch(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <div>
        {results.map((r, i) => (
          <div
            key={i}
            onClick={() => jumpTo(r.start)}
            className="cursor-pointer border p-2 mb-2"
          >
            {/* <p>{r.text}</p> */}
            <p className="font-medium">{r.original}</p>
            <p className="text-sm text-gray-500">{r.translated}</p>
            {/* <small>{r.start.toFixed(2)}s</small> */}
          </div>
        ))}
      </div>
    </div>
  );
}
