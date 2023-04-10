import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import classnames from "classnames/bind";
import styles from "./RoomSkeleton.module.scss";
import { useAppSelector } from "../../../../store/hook";
const cx = classnames.bind(styles);
const RoomSkeleton = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div className={cx("wrapper", { dark: theme })}>
      <SkeletonTheme
        baseColor={theme ? "#404040" : ""}
        highlightColor={theme ? "#5c5c5c" : ""}
      >
        <div className={cx("title")}>
          <Skeleton width={50} height={30} borderRadius={5} />
          <div className={cx("icon-create-room")}>
            <Skeleton width={20} height={20} circle />
          </div>
        </div>
        <div className={cx("search")}>
          <Skeleton width={"100%"} borderRadius={25} height={40} />
        </div>
        <div className={cx("list-room")}>
          {new Array(9).fill("").map((_, index) => {
            return (
              <div className={cx("item")} key={index}>
                <div className={cx("room-avatar")}>
                  <Skeleton circle width={50} height={50} />
                </div>
                <div>
                  <div>
                    <Skeleton borderRadius={5} width={150} height={18} />
                  </div>
                  <div>
                    <Skeleton borderRadius={5} width={180} height={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default RoomSkeleton;
