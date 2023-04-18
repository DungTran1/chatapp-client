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

type ChatProps = {
  socket: Socket;
};
const Chat: React.FC<ChatProps> = ({ socket }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomId } = useParams();
  useCurrentRoomQuery(roomId);
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  const user = useAppSelector((state) => state.auth.user);
  const { currentRoom } = useQuerySelector();
  const { resetRoom } = useActionQuery();
  const { data, isLoading } = useRoomQuery(user?._id);
  const isTablet = useMediaQuery({ maxWidth: "46.25em" });
  const ref = useRef<string | undefined>();
  ref.current = roomId;
  const softRoom = data?.sort((a, b) => {
    const dateA = new Date(a.lastMessage.createdAt).getTime();
    const dateB = new Date(b.lastMessage.createdAt).getTime();
    return dateB - dateA;
  });
  useEffect(() => {
    const receiveResetRoom = (roomId?: string) => {
      resetRoom();
      if (roomId === currentRoom?._id) {
        navigate("/chat");
      }
    };
    const receiveTyping = (data: UsersTyping) => {
      dispatch(updateUsersTyping(data));
    };
    const connect = () => {
      if (ref.current) {
        socket.emit("subscribe_room", {
          newRoom: ref.current,
        });
      }
    };
    const listEvent = [
      ["connect", connect],
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
      {data && (!isTablet || (isTablet && !roomId)) && (
        <RoomJoined data={softRoom} socket={socket} />
      )}
      {currentRoom?.users.find((u) => u.user._id === user?._id) &&
        (!isTablet || (isTablet && roomId)) && <Outlet />}

      {!roomId && !isTablet && (
        <div className={cx("empty-background", { dark: darkTheme })}>
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
