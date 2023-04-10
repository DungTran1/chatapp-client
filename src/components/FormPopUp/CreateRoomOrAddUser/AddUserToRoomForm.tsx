import { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Loading from "../../Loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { ThreeCircles } from "react-loader-spinner";
import SearchUserGroupChat from "../../Search/SearchUserGroupChat";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { User, UserInRoom, Users } from "../../../shared/type";
import styles from "./AddUserToRoomForm.module.scss";
import classnames from "classnames/bind";
import { Socket } from "socket.io-client";
import { getAllUserAbleAdd } from "../../../service/room";
import { setFormPopUp } from "../../../reducer/ChatReducer";
import { BiCheckbox } from "react-icons/bi";
import { FcCheckmark } from "react-icons/fc";
import { useSearchParams } from "react-router-dom";
import { useQuerySelector } from "../../../service/Query/querySelector";

const cx = classnames.bind(styles);
interface AddUserToRoomFormProps {
  type: "CreateGroupChat" | "AddUserToGroupChat";
  socket: Socket;
  usersInCurrentRoom?: UserInRoom[];
}
const AddUserToRoomForm: React.FC<AddUserToRoomFormProps> = ({
  type,
  socket,
  usersInCurrentRoom,
}) => {
  const [params, setSearchParams] = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const { theme } = useAppSelector((state) => state.theme);
  const { currentRoom } = useQuerySelector();
  const dispatch = useAppDispatch();
  const [userAdded, setUserAdded] = useState<Array<User>>(() => {
    const user = currentRoom?.users
      .map((i) => i.user)
      .find((e) => e._id === params.get("user-added"));
    if (user) {
      return [user];
    }
    return [];
  });

  const handleAddUserToListCreateRoom = (user: User) => {
    setUserAdded((prev) => {
      const added = [...prev];
      if (added.some((p) => p._id === user._id)) {
        const isAdded = added.filter((p) => p._id !== user._id);
        return isAdded;
      }
      return [...prev, user];
    });
  };
  const handleRemoveUserToListCreateRoom = (user: User) => {
    setUserAdded((prev) => {
      const added = [...prev];
      return added.filter((p) => p._id !== user._id);
    });
  };
  const handleCreateRoomOrInviteMember = () => {
    if (!userAdded.length) {
      return;
    }
    dispatch(setFormPopUp(null));
    if (type === "AddUserToGroupChat") {
      socket.emit("add_user", {
        userAdd: user,
        roomId: currentRoom?._id,
        userAdded,
      });
      return;
    }
    socket.emit("create_room", {
      initiator: user,
      usersAdded: userAdded,
    });
  };
  return (
    <>
      <div className={cx("create-room", { dark: theme })}>
        <div className={cx("create-room-title")}>
          <h3>Tạo nhóm chat</h3>
        </div>
        <SearchUserGroupChat
          type={type}
          userAdded={userAdded}
          handleAddUserToListCreateRoom={handleAddUserToListCreateRoom}
        />
        <div className={cx("list-people-added")}>
          {userAdded.map((user) => {
            return (
              <div key={user._id}>
                <LazyLoadImage
                  width={60}
                  height={60}
                  effect="blur"
                  src={user.photoURL}
                  alt=""
                />
                <p className={cx("user-name")}>{user.displayName}</p>
                <button onClick={() => handleRemoveUserToListCreateRoom(user)}>
                  <AiFillCloseCircle size={15} color="#ff4f4f" />
                </button>
              </div>
            );
          })}
        </div>
        {userAdded.length === 0 && (
          <h4 className={cx("user-not-added")}>Chưa chọn người dùng nào</h4>
        )}
        <div style={{ height: "200px" }}></div>
        <div
          className={cx("confirm-btn")}
          onClick={handleCreateRoomOrInviteMember}
        >
          {type === "CreateGroupChat" ? "Tạo" : "Mời"}
        </div>
        <button
          className={cx("close-icon")}
          onClick={() => {
            dispatch(setFormPopUp(null));
          }}
        >
          <AiOutlineClose size={25} color="#f54545" />
        </button>
      </div>
    </>
  );
};

export default AddUserToRoomForm;
