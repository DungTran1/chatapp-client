import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import classnames from "classnames/bind";
import styles from "./MessageMediaFile.module.scss";

import { useSearchParams } from "react-router-dom";
const cx = classnames.bind(styles);
type ListMediaProps = {
  files: string[];
};

const ListMedia: React.FC<ListMediaProps> = ({ files }) => {
  const [playing, setPlaying] = useState<number | null>(null);
  const filesReverse = files.slice().reverse();
  const swiperRef = useRef() as any;
  const videoRef = useRef<HTMLVideoElement[]>([]);
  const [params, setSearchParams] = useSearchParams();
  const [mediaIndex, setMediaIndex] = useState(
    Number(params.get("mediaIndex")) || 0
  );
  useEffect(() => {
    return () => {
      params.delete("mediaIndex");
      setSearchParams(params);
    };
  }, []);
  return (
    <div className={cx("file-list-wrapper")}>
      <div className={cx("file-list")}>
        <Swiper
          ref={swiperRef}
          grabCursor
          initialSlide={mediaIndex}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => {
            if (playing) videoRef.current[playing].pause();
            setMediaIndex(swiper.activeIndex);
          }}
        >
          {filesReverse?.map((m, index) => {
            return (
              <SwiperSlide key={index}>
                {m.match(/.mp4/g) ? (
                  <div className={cx("file")}>
                    <video
                      onPlay={() => setPlaying(index)}
                      ref={(el) => {
                        if (el) videoRef.current[index] = el;
                      }}
                      src={m}
                      controls
                    >
                      <source src={m} />
                    </video>
                  </div>
                ) : (
                  <div className={cx("file")}>
                    <img src={m} alt="" />
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className={`${cx("swiper-control-file")}`}>
        <Swiper
          initialSlide={mediaIndex}
          spaceBetween={20}
          height={300}
          slidesPerView={4}
          breakpoints={{
            480: {
              slidesPerView: 5,
            },
            720: {
              slidesPerView: 8,
            },
            1024: {
              slidesPerView: 10,
            },
          }}
        >
          {filesReverse?.map((m, index) => {
            return (
              <SwiperSlide
                key={index}
                style={{ width: "100px", height: "100px" }}
                onClick={() => {
                  setMediaIndex(index);
                  swiperRef.current?.swiper.slideTo(index, 500);
                }}
              >
                {m.match(/.mp4/g) ? (
                  <div
                    className={cx("file-list-control", {
                      isActive: mediaIndex === index,
                    })}
                  >
                    <video src={m}>
                      <source src={m} />
                    </video>
                  </div>
                ) : (
                  <div
                    className={cx("file-list-control", {
                      isActive: mediaIndex === index,
                    })}
                  >
                    <img src={m} alt="" />
                  </div>
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default React.memo(ListMedia);
