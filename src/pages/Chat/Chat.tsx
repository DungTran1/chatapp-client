import { useEffect, useState } from "react";
import RoomJoined from "../../components/Room/Room";
import { useAppSelector } from "../../store/hook";
import { Socket } from "socket.io-client";

import styles from "./Chat.module.scss";
import classnames from "classnames/bind";
import { defaultPhoto } from "../../shared/utils";
import { useRoomQuery } from "../../service/Query/UseQuery";
import RoomSkeleton from "../../components/Common/Skeleton/RoomSkeleton/RoomSkeleton";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useQuerySelector } from "../../service/Query/querySelector";
import { useActionQuery } from "../../service/Query/ActionQuery";
import { updateUsersTyping } from "../../reducer/ChatReducer";
import { useDispatch } from "react-redux";
const cx = classnames.bind(styles);

interface ChatProps {
  socket: Socket;
  //   handleSoundMessage: () => void;
}
const Chat: React.FC<ChatProps> = ({ socket }) => {
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.theme);
  const user = useAppSelector((state) => state.auth.user);
  const { currentRoom } = useQuerySelector();
  const { resetRoom } = useActionQuery();
  const { data, isLoading } = useRoomQuery();
  const isMobile = useMediaQuery({ maxWidth: "40em" });
  useEffect(() => {
    socket.on("receive_typing", (data) => {
      dispatch(updateUsersTyping(data));
    });
    socket.on("receive_reset_room", (roomId?: string) => {
      resetRoom(user?._id as string, roomId);
    });
  }, []);

  if (isLoading) return <RoomSkeleton />;
  return (
    <>
      {!data && <RoomSkeleton />}
      {data && (!isMobile || (isMobile && !roomId)) && (
        <RoomJoined data={data} socket={socket} />
      )}
      {currentRoom?.users.find((u) => u.user._id === user?._id) &&
        (!isMobile || (isMobile && roomId)) && <Outlet />}

      {!roomId && !isMobile && (
        <div className={cx("empty-background", { dark: theme })}>
          <div>
            <img src={defaultPhoto("user-account.png")} alt="" />
          </div>
          <div className={cx("icon-overlay")}></div>
        </div>
      )}
      {/* <div className={cx("empty-background", { dark: theme })}>
        <div>
          <img src={defaultPhoto("user-account.png")} alt="" />
        </div>
        <div className={cx("icon-overlay")}></div>
      </div> */}
    </>
  );
};

export default Chat;
