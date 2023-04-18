import { useState } from "react";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SearchUserGroupChat from "../../Search/SearchUserGroupChat";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { User, UserInRoom } from "../../../shared/type";
import { Socket } from "socket.io-client";
import { setFormPopUp } from "../../../reducer/ChatReducer";
import { useSearchParams } from "react-router-dom";
import { useQuerySelector } from "../../../service/Query/querySelector";

import styles from "./CreateRoomOrAddUser.module.scss";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);
type CreateRoomOrAddUserProps = {
  type: "CreateGroupChat" | "AddUserToGroupChat";
  socket: Socket;
  usersInCurrentRoom?: UserInRoom[];
};
const CreateRoomOrAddUser: React.FC<CreateRoomOrAddUserProps> = ({
  type,
  socket,
}) => {
  const [params] = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
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
      <div className={cx("create-room", { dark: darkTheme })}>
        <div className={cx("create-room-title")}>
          <h3>Tạo nhóm chat</h3>
        </div>
        <SearchUserGroupChat
          type={type}
          userAdded={userAdded}
          handleAddUserToListCreateRoom={handleAddUserToListCreateRoom}
        />
        {userAdded.length > 0 && (
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
                  <button
                    onClick={() => handleRemoveUserToListCreateRoom(user)}
                  >
                    <AiFillCloseCircle size={15} color="#ff4f4f" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
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

export default CreateRoomOrAddUser;
