import { useState, useRef } from "react";
import { useQuerySelector } from "../../../service/Query/querySelector";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaPencilAlt } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import Overlay from "../../Overlay/Overlay";
import { FcCheckmark } from "react-icons/fc";
import { setFormPopUp } from "../../../reducer/ChatReducer";
import { Socket } from "socket.io-client";
import { UserInRoom } from "../../../shared/type";

import classnames from "classnames/bind";
import styles from "./ChangeNickName.module.scss";
const cx = classnames.bind(styles);

interface ChangeNickNameProps {
  socket: Socket;
}
const ChangeNickName: React.FC<ChangeNickNameProps> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const { currentRoom } = useQuerySelector();
  const { user } = useAppSelector((state) => state.auth);
  const [isChangeNickName, setIsChangeNickName] = useState<string>("");
  const changeRef = useRef<HTMLInputElement[]>([]) as any;

  const handleChangeNickName = (userIsSet: UserInRoom, index: number) => {
    const newNickname = changeRef.current[userIsSet.user._id]?.value;
    if (!newNickname?.trim()) {
      return;
    }
    socket.emit("change_nickname", {
      newNickname,
      userSet: user,
      userIsSet: userIsSet.user,
      roomId: currentRoom?._id,
    });
    dispatch(setFormPopUp(null));
  };
  return (
    <>
      <div className={cx("wrapper", { dark: theme })}>
        <div className={cx("title")}>
          <h4>Biệt danh</h4>
          <button
            className={cx("close-btn")}
            onClick={() => dispatch(setFormPopUp(null))}
          >
            <AiFillCloseCircle size="20" color="#a7a7a7" />
          </button>
        </div>
        <div className={cx("list-member-in-room")}>
          <ul>
            {currentRoom?.users.map((userInRoom, index) => {
              return (
                <li className={cx("member")} key={userInRoom.user._id}>
                  <>
                    <img src={userInRoom.user.photoURL} alt="" />
                    {(isChangeNickName !== userInRoom.user._id && (
                      <div>
                        <h4>
                          {userInRoom.nickname || userInRoom.user.displayName}
                        </h4>
                        <p className={cx("set-nickname")}>Đặt biệt danh</p>
                      </div>
                    )) || (
                      <input
                        ref={(el) => {
                          if (el) changeRef.current[userInRoom.user._id] = el;
                        }}
                        className={cx("change-input")}
                        placeholder={
                          userInRoom.nickname ||
                          userInRoom.user.displayName ||
                          ""
                        }
                      />
                    )}
                  </>
                  <button
                    className={cx("change-btn")}
                    onClick={() => {
                      setIsChangeNickName(userInRoom.user._id);
                      handleChangeNickName(userInRoom, index);
                    }}
                  >
                    {(!isChangeNickName.includes(userInRoom.user._id) && (
                      <FaPencilAlt size="20" color={theme ? "#fff" : ""} />
                    )) || <FcCheckmark />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <Overlay position="absolute" />
    </>
  );
};

export default ChangeNickName;
