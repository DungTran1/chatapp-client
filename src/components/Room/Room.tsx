import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { Message, Room } from "../../shared/type";
import SearchRoom from "../Search/SearchUserPrivateChat";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-loading-skeleton/dist/skeleton.css";
import {
  defaultPhoto,
  displayLastTimeUserChat,
  toastMessage,
} from "../../shared/utils";
import { Socket } from "socket.io-client";
import { NavLink } from "react-router-dom";
import { setFormPopUp } from "../../reducer/ChatReducer";
import { BsPencilSquare } from "react-icons/bs";
import classnames from "classnames/bind";
import styles from "./Room.module.scss";

import { useActionQuery } from "../../service/Query/ActionQuery";
import { useQuerySelector } from "../../service/Query/querySelector";

const cx = classnames.bind(styles);
interface RoomJoinedProps {
  data: Room[] | undefined;
  socket: Socket;
}
const RoomJoined: React.FC<RoomJoinedProps> = ({ data, socket }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const { userOnline } = useAppSelector((state) => state.chat);
  const { currentRoom } = useQuerySelector();
  const { UpdateCurrentRoom, CreateRoom, UpdateLastMessage } = useActionQuery();
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    const listEvent = ["receive_created_room", "receive_last_message"];
    socket.on(
      listEvent[0],
      (data: { status: boolean; room: Room; message: string }) => {
        if (data.status && user) {
          CreateRoom(user, data.room);
          dispatch(setFormPopUp(null));
        } else toastMessage("error", data.message);
      }
    );
    socket.on(
      "receive_last_message",
      async (data: { lastMessage: Message }) => {
        if (!user) return;
        UpdateLastMessage(user, data.lastMessage);
      }
    );
    return () => {
      for (const i in listEvent) {
        socket.off(listEvent[i]);
      }
    };
  }, [socket, user]);
  const displayNicknameOrDefaultName = (mess: Message) => {
    return (
      currentRoom?.users.find((u) => u.user._id === mess.actedByUser?._id)
        ?.nickname || mess.actedByUser?.displayName
    );
  };
  const displayPrivateOrGroupChat = (room: Room) => {
    if (room.type === "Group") {
      return room.name;
    }
    if (room.type === "Private") {
      const display = room.users.find((u) => u.user._id !== user?._id);

      return display?.nickname || display?.user.displayName;
    }
  };

  const handleTakeMessage = (room: Room) => {
    localStorage.setItem("currentRoom", room._id);
    socket.emit("connect_to_room", {
      oldRoom: currentRoom?._id,
      newRoom: room._id,
      userId: user?._id,
    });
    UpdateCurrentRoom(room);
  };

  const renderLastMessage = (room: Room) => {
    const lastMessage = room.lastMessage;
    if (!lastMessage) {
      return;
    }
    if (lastMessage.type !== "Notification") {
      if (lastMessage.actedByUser?._id === user?._id) {
        if (lastMessage.files.length > 0) {
          return (
            <>
              <p>{`Bạn: ${lastMessage.text}`}</p>
              <img
                src={require(`../../assets/image/${
                  lastMessage.files[lastMessage.files.length - 1].match(/.mp4/g)
                    ?.length
                    ? "folder.png"
                    : "picture.png"
                }`)}
                alt=""
              />
            </>
          );
        }
        return <p>{`Bạn: ${lastMessage.text}`}</p>;
      } else {
        if (lastMessage.files.length > 0) {
          return (
            <>
              <p>{`${displayNicknameOrDefaultName(lastMessage)}: ${
                lastMessage.text
              }`}</p>
              <img
                src={require(`../../assets/image/${
                  lastMessage.files[lastMessage.files.length - 1].match(/.mp4/g)
                    ?.length
                    ? "folder.png"
                    : "picture.png"
                }`)}
                alt=""
              />
            </>
          );
        }
        return (
          <p>{`${displayNicknameOrDefaultName(lastMessage)}: ${
            lastMessage.text
          }`}</p>
        );
      }
    }
    if (lastMessage.type === "Notification") {
      const actedBy = lastMessage.actedByUser;

      return (
        <>
          <p>{`${
            actedBy
              ? actedBy._id === user?._id
                ? "Bạn"
                : actedBy.displayName
              : ""
          } ${lastMessage.text}`}</p>
        </>
      );
    }

    return "";
  };

  const handleUserOnline = (room: Room) => {
    for (let i = 0; i < userOnline.length; i++) {
      if (
        room?.type === "Private" &&
        room?.users.find((e) => e.user._id === userOnline[i]) &&
        userOnline[i] !== user?._id
      ) {
        return true;
      } else if (
        room?.type === "Group" &&
        room?.users.find((e) => e.user._id === userOnline[i])
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className={`${cx("room-joined", { dark: theme })} `}>
      <div>
        <div className={cx("room-title")}>
          <h4>Chat</h4>
          <button onClick={() => dispatch(setFormPopUp("CreateGroupChat"))}>
            <BsPencilSquare size="20" color={theme ? "#fff" : ""} />
          </button>
        </div>

        <SearchRoom socket={socket} />
        <div>
          <ul className={cx("room-list")}>
            {data?.map((room, index) => {
              const displayTime = displayLastTimeUserChat(
                room.lastMessage?.createdAt
              );
              return (
                <li
                  onClick={() => {
                    return handleTakeMessage(room);
                  }}
                  key={index}
                >
                  {displayTime && room.lastMessage && (
                    <div className={cx("distance-time-not-sending-message")}>
                      {displayTime}
                    </div>
                  )}
                  <NavLink
                    to={"/chat/" + room._id}
                    className={({ isActive }) =>
                      isActive ? cx("currentRoom", { dark: theme }) : ""
                    }
                  >
                    <LazyLoadImage
                      width={50}
                      height={50}
                      effect="blur"
                      src={
                        room.photoURL ||
                        defaultPhoto(
                          room.type === "Private" ? "user.png" : "group.png"
                        )
                      }
                      alt=""
                    />
                    <div>
                      <h4 className={cx("user-name")}>
                        <>{displayPrivateOrGroupChat(room)}</>
                      </h4>

                      <div className={cx("last-message")}>
                        <>{renderLastMessage(room)}</>
                      </div>
                    </div>
                    {handleUserOnline(room) && (
                      <div className={cx("status")}></div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoomJoined;
