import { useQuery } from "@tanstack/react-query";
import classnames from "classnames/bind";
import { getMedia } from "../../../service/api";
import { Media } from "../../../shared/type";
import { IoMdCloseCircle } from "react-icons/io";

import { useAppDispatch } from "../../../store/hook";
import { setFormPopUp } from "../../../reducer/ChatReducer";
import { useQuerySelector } from "../../../service/Query/querySelector";
import Loading from "../../Common/Loading/Loading";

import ListMedia from "./ListMediaFile";
import styles from "./MessageMediaFile.module.scss";
const cx = classnames.bind(styles);

type MediaProps = {};

const MediaSection: React.FC<MediaProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { currentRoom } = useQuerySelector();
  const { data, isLoading } = useQuery<Media>(
    ["media", currentRoom?._id],
    () => getMedia(currentRoom?._id),
    { initialData: { files: [] } }
  );
  return (
    <div className={cx("media-wrapper")}>
      {isLoading && <Loading />}
      {data.files.length > 0 && !isLoading && <ListMedia files={data.files} />}
      {!data.files.length && !isLoading && (
        <div className={cx("empty-file")}>Không có file nào để hiển thị</div>
      )}
      <button
        className={cx("close-file")}
        onClick={() => dispatch(setFormPopUp(null))}
      >
        <IoMdCloseCircle size="45" color="fff" />
      </button>
    </div>
  );
};

export default MediaSection;
