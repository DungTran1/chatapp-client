import { useEffect } from "react";
import RoomJoined from "../../components/Room/Room";
import { useAppSelector } from "../../store/hook";
import { Socket } from "socket.io-client";
import { defaultPhoto } from "../../shared/utils";
import { useRoomQuery } from "../../service/Query/UseQuery";
import RoomSkeleton from "../../components/Common/Skeleton/RoomSkeleton/RoomSkeleton";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useQuerySelector } from "../../service/Query/querySelector";
import { useActionQuery } from "../../service/Query/ActionQuery";
import { updateUsersTyping } from "../../reducer/ChatReducer";
import { useDispatch } from "react-redux";

import Title from "../../components/Common/Title";

import styles from "./Chat.module.scss";
import classnames from "classnames/bind";
const cx = classnames.bind(styles);

interface ChatProps {
  socket: Socket;
}
const Chat: React.FC<ChatProps> = ({ socket }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const theme = useAppSelector((state) => state.theme);
  const user = useAppSelector((state) => state.auth.user);
  const { currentRoom } = useQuerySelector();
  const { resetRoom } = useActionQuery();
  const { data, isLoading } = useRoomQuery(user?._id);
  const isMobile = useMediaQuery({ maxWidth: "40em" });
  useEffect(() => {
    socket.on("receive_typing", (data) => {
      dispatch(updateUsersTyping(data));
    });
    socket.on("receive_reset_room", (roomId?: string) => {
      if (roomId === currentRoom?._id) {
        localStorage.removeItem("currentRoom");
        navigate("/chat");
      }
      resetRoom(user?._id as string);
    });
  }, []);

  if (!user || isLoading) return <RoomSkeleton />;
  return (
    <>
      <Title value={"Chat"} />
      {!data && <RoomSkeleton />}
      {data && (!isMobile || (isMobile && !roomId)) && (
        <RoomJoined data={data} socket={socket} />
      )}
      {data &&
        currentRoom?.users.find((u) => u.user._id === user?._id) &&
        (!isMobile || (isMobile && roomId)) && <Outlet />}

      {!roomId && !isMobile && (
        <div className={cx("empty-background", { dark: theme })}>
          <div>
            <img src={defaultPhoto("user-account.png")} alt="" />
          </div>
          <div className={cx("icon-overlay")}></div>
        </div>
      )}
    </>
  );
};

export default Chat;
