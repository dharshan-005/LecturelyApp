import { useRef } from "react";

type Props = {
    src: string;
}

export default function VideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const jumpTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  return (
    <>
      <video src={src} ref={videoRef}></video>
    </>
  );
}
