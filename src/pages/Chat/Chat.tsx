import { useEffect, useRef } from "react";
import RoomJoined from "../../components/Room/Room";
import { useAppSelector } from "../../store/hook";
import { Socket } from "socket.io-client";
import {
  addSocketEventListener,
  defaultPhoto,
  removeSocketEventListener,
} from "../../shared/utils";
import {
  useCurrentRoomQuery,
  useRoomQuery,
} from "../../service/Query/UseQuery";
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
import { UsersTyping } from "../../shared/type";
const cx = classnames.bind(styles);

interface ChatProps {
  socket: Socket;
}
const Chat: React.FC<ChatProps> = ({ socket }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomId } = useParams();
  useCurrentRoomQuery(roomId);
  const theme = useAppSelector((state) => state.theme);
  const user = useAppSelector((state) => state.auth.user);
  const { currentRoom } = useQuerySelector();
  const { resetRoom } = useActionQuery();
  const { data, isLoading } = useRoomQuery(user?._id);
  const isMobile = useMediaQuery({ maxWidth: "40em" });
  const ref = useRef<string | undefined>();
  ref.current = roomId;
  useEffect(() => {
    const receiveResetRoom = (roomId?: string) => {
      resetRoom(user?._id as string);
      if (roomId === currentRoom?._id) {
        navigate("/chat");
      }
    };
    const receiveTyping = (data: UsersTyping) => {
      dispatch(updateUsersTyping(data));
    };
    socket.on("connect", () => {
      if (ref.current) {
        socket.emit("subscribe_room", {
          newRoom: ref.current,
        });
      }
    });
    socket.on("reconnect", () => {
      socket.emit("subscribe_room", {
        newRoom: roomId,
      });
    });
    const listEvent = [
      ["receive_typing", receiveTyping],
      ["receive_reset_room", receiveResetRoom],
    ];
    addSocketEventListener(listEvent, socket);
    return () => {
      removeSocketEventListener(listEvent, socket);
    };
  }, []);

  if (!user || isLoading) return <RoomSkeleton />;
  return (
    <>
      <Title value={"Chat"} />
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
    </>
  );
};

export default Chat;
