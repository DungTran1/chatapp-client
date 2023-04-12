import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import classnames from "classnames/bind";
import styles from "./Media.module.scss";
import { Media } from "../../shared/type";
import { useSearchParams } from "react-router-dom";
const cx = classnames.bind(styles);
interface ListMediaProps {
  media: Media | undefined;
}

const ListMedia: React.FC<ListMediaProps> = ({ media }) => {
  const files = media?.files.slice().reverse();
  const swiperRef = useRef() as any;
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
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={(swiper) => {
            setMediaIndex(swiper.activeIndex);
          }}
        >
          {files?.map((m, index) => {
            return (
              <SwiperSlide key={index}>
                {m.match(/.mp4/g) ? (
                  <div className={cx("media")}>
                    <video src={m} controls>
                      <source src={m} />
                    </video>
                  </div>
                ) : (
                  <div className={cx("media")}>
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
          {files?.map((m, index) => {
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

export default ListMedia;
