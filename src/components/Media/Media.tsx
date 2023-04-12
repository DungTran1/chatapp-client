import { useQuery } from "@tanstack/react-query";
import classnames from "classnames/bind";
import { getMedia } from "../../service/api";
import { Media } from "../../shared/type";
import { IoMdCloseCircle } from "react-icons/io";

import ListMedia from "./ListMedia";
import styles from "./Media.module.scss";
import { useAppDispatch } from "../../store/hook";
import { setFormPopUp } from "../../reducer/ChatReducer";
import { useQuerySelector } from "../../service/Query/querySelector";
const cx = classnames.bind(styles);
interface MediaProps {}

const MediaSection: React.FC<MediaProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { currentRoom } = useQuerySelector();
  const { data } = useQuery<Media>(["media", currentRoom?._id], () =>
    getMedia(currentRoom?._id)
  );
  return (
    <div className={cx("media-wrapper")}>
      <ListMedia media={data} />
      <button
        className={cx("close-media")}
        onClick={() => dispatch(setFormPopUp(null))}
      >
        <IoMdCloseCircle size="45" color="fff" />
      </button>
    </div>
  );
};

export default MediaSection;
