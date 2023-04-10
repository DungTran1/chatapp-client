import { useRef } from "react";
import { useQuerySelector } from "../../../service/Query/querySelector";
import { AiFillCloseCircle } from "react-icons/ai";
import { Socket } from "socket.io-client";
import { setFormPopUp } from "../../../reducer/ChatReducer";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import Overlay from "../../Overlay/Overlay";

import classnames from "classnames/bind";
import styles from "./ChangeChatRoomName.module.scss";
const cx = classnames.bind(styles);
interface ChangeChatRoomNameProps {
  socket: Socket;
}
const ChangeChatRoomName: React.FC<ChangeChatRoomNameProps> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const changeRef = useRef<HTMLInputElement>(null);
  const theme = useAppSelector((state) => state.theme.theme);
  const { currentRoom } = useQuerySelector();
  const { user } = useAppSelector((state) => state.auth);
  const handleChangeRoomName = () => {
    socket.emit("change_room_name", {
      roomId: currentRoom?._id,
      newRoomName: changeRef.current?.value,
      userSet: user,
    });
    dispatch(setFormPopUp(null));
  };
  return (
    <>
      <div className={cx("wrapper", { dark: theme })}>
        <div className={cx("title")}>
          <h4>Đổi tên đoạn chat</h4>
          <button
            className={cx("close-btn")}
            onClick={() => dispatch(setFormPopUp(null))}
          >
            <AiFillCloseCircle size="20" color="#a7a7a7" />
          </button>
        </div>
        <div className={cx("content")}>
          <label className={cx("chat-name")} htmlFor="change-room-name">
            <p>Tên đoạn chat</p>
            <p>{`${changeRef.current?.value.length || 0}/100`}</p>
          </label>
          <div className={cx("chat-name-input")}>
            <input
              spellCheck={false}
              ref={changeRef}
              id="change-room-name"
              defaultValue={currentRoom?.name}
            />
          </div>
        </div>
        <div className={cx("cancel-save")}>
          <button
            className={cx("cancel-btn")}
            onClick={() => dispatch(setFormPopUp(null))}
          >
            Hủy
          </button>
          <button className={cx("save-btn")} onClick={handleChangeRoomName}>
            Lưu
          </button>
        </div>
      </div>
      <Overlay position="absolute" />
    </>
  );
};

export default ChangeChatRoomName;
