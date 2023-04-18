import { useState, useRef } from "react";
type videoProps = {
  src: string;
  width: number;
  height: number;
  length: number;
  onClick: React.MouseEventHandler<HTMLVideoElement> | undefined;
};
const Video: React.FC<videoProps> = ({
  src,
  width,
  height,
  length,
  onClick,
  ...props
}) => {
  const [playing, setPlaying] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement[]>([]);

  return (
    <>
      {new Array(length).fill("").map((_, index) => {
        return (
          <video
            ref={(el) => {
              if (el) videoRef.current[index] = el;
            }}
            onPlay={() => {
              if (playing) videoRef.current[playing].pause();
              setPlaying(index);
            }}
            onClick={onClick}
            key={index}
            src={src}
            width="200"
            height="200"
            controls
          >
            <source src={src} />
          </video>
        );
      })}
    </>
  );
};

export default Video;
