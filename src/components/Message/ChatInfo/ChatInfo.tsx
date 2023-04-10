import {
  MdContentCopy,
  MdNavigateBefore,
  MdOutlinePermMedia,
} from "react-icons/md";
import { useState } from "react";
import Tippy from "@tippyjs/react/headless";
import { post } from "../../../service/axiosConfig";
import { useQueryClient } from "@tanstack/react-query";

import { LazyLoadImage } from "react-lazy-load-image-component";
import Loading from "../../Loading/Loading";
import {
  BsChevronCompactUp,
  BsFillPencilFill,
  BsImageFill,
  BsLink45Deg,
  BsThreeDots,
} from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  // removeUserFromCurrentRoom,
  // setCurrentRoom,
  setFormPopUp,
} from "../../../reducer/ChatReducer";
import { Socket } from "socket.io-client";
import {
  FaShieldAlt,
  FaSignature,
  FaSignOutAlt,
  FaUserAltSlash,
} from "react-icons/fa";
import { BsChevronCompactDown } from "react-icons/bs";
import { useMediaQuery } from "react-responsive";
import { AiOutlinePlus } from "react-icons/ai";
import { uploadImage } from "../../../service/saveImage";
import {
  defaultPhoto,
  displayLastTimeUserChat,
  toastMessage,
} from "../../../shared/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserInRoom } from "../../../shared/type";
import { useQuerySelector } from "../../../service/Query/querySelector";

import styles from "./ChatInfo.module.scss";
import classnames from "classnames/bind";
import { updateAllowJoinInLink } from "../../../service/room";
const cx = classnames.bind(styles);

interface ChatInfoTabProps {
  setIsToggleOption: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
}
const MessageInfoTab: React.FC<ChatInfoTabProps> = ({
  setIsToggleOption,
  socket,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.auth.user);
  const { userOnline } = useAppSelector((state) => state.chat);
  const { currentRoom } = useQuerySelector();
  const isMobileOrTablet = useMediaQuery({ maxWidth: "54em" });
  const [isOpenOption, setIsOpenOption] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);

  const uploadRoomImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const photoRoomURL = await uploadImage(e.target.files[0]);
      setIsLoading(true);
      if (photoRoomURL) {
        await post("auth/updateRoomProfile", {
          roomId: currentRoom?._id,
          photoRoomURL,
        });
        setIsLoading(false);
      }
    }
  };
  const handleAppointmentAsAdministrator = (userIsAppoitment: UserInRoom) => {
    if (!currentRoom) return;
    const setCurrRoom = {
      ...currentRoom,
      initiator: userIsAppoitment.user._id,
    };
    // dispatch(setCurrentRoom(setCurrRoom));
    socket.emit("appoitment_as_administrator", {
      admin: currentRoom?.users.find(
        (u) => u.user._id === currentRoom.initiator
      ),
      userIsAppoitment,
      roomId: currentRoom?._id,
    });
  };
  const handleRemoveUser = (userRemoved: UserInRoom | undefined) => {
    socket.emit("remove_user_from_room", {
      admin: user,
      userRemoved,
      roomId: currentRoom?._id,
    });
  };

  const handleShowOption = (name: string) => {
    setIsOpenOption((prev) => {
      const newOption = [...prev];
      if (newOption.includes(name)) {
        return newOption.filter((e) => e !== name);
      } else {
        return [...newOption, name];
      }
    });
  };
  const handleDeleteChatOrLeaveRoom = () => {
    if (!currentRoom) return;
    if (currentRoom?.initiator !== user?._id) {
      const userLeave = currentRoom?.users.find(
        (u) => u.user._id === user?._id
      );
      // dispatch(
      //   setCurrentRoom({
      //     ...currentRoom,
      //     users: currentRoom?.users.filter((u) => u.user._id !== user?._id),
      //   })
      // );
      queryClient.setQueryData(["room", user?._id], (oldData: any) => {
        const newData = [...oldData];
        return newData.filter((d: any) => d._id !== currentRoom?._id);
      });
      socket.emit("leave_room", {
        userLeave,
        roomId: currentRoom?._id,
      });
      navigate("/chat");
      return;
    }
    localStorage.removeItem("currentRoom");
    // dispatch(setCurrentRoom(null));
    socket.emit("delete_chat_group_room", {
      roomId: currentRoom?._id,
    });
    navigate("/chat");
    return;
  };
  const handleAllowJoinLink = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(e.target.checked);
    if (!currentRoom) return;
    await updateAllowJoinInLink(currentRoom?._id, e.target.checked);
  };
  const admin = currentRoom?.users.find(
    (u) => u.user._id === currentRoom.initiator
  );
  const userDisplay = currentRoom?.users.find((u) => u.user._id !== user?._id);
  return (
    <>
      <div
        className={`${cx("message-info-wrapper", {
          dark: theme,
        })}  `}
      >
        <div>
          {isMobileOrTablet && (
            <div
              className={cx("display-toggle")}
              onClick={() => setIsToggleOption(false)}
            >
              <button>
                <MdNavigateBefore size={25} color="#8141ff" />
              </button>
            </div>
          )}
          <div className={cx("upload-room-image")}>
            {isLoading && <Loading />}
            <div>
              <LazyLoadImage
                effect="blur"
                src={
                  currentRoom?.photoURL || currentRoom?.type === "Private"
                    ? defaultPhoto("user.png")
                    : defaultPhoto("group.png")
                }
                width="80"
                height="80"
              />
              <h4>
                {currentRoom?.name ||
                  userDisplay?.nickname ||
                  userDisplay?.user.displayName}
              </h4>
              <p className={cx("time-online")}>
                {currentRoom &&
                  displayLastTimeUserChat(currentRoom.lastMessage?.createdAt) &&
                  `Hoạt động ${displayLastTimeUserChat(
                    currentRoom.lastMessage?.createdAt
                  )} trước`}
              </p>
              <input
                hidden
                id="upload-img"
                type="file"
                accept="image/*"
                onChange={uploadRoomImage}
              />
            </div>
          </div>
          <div className={cx("customize-chat", "option-wrapper")}>
            <div
              className={cx("show-option")}
              onClick={() => handleShowOption("customize-chat")}
            >
              <h4>Tuy chinh doan chat</h4>
              <button>
                {(!isOpenOption.includes("customize-chat") && (
                  <BsChevronCompactDown color={theme ? "#fff" : ""} />
                )) || <BsChevronCompactUp color={theme ? "#fff" : ""} />}
              </button>
            </div>
            <div
              className={cx("option-section", {
                isShow: isOpenOption.includes("customize-chat"),
                dark: theme,
              })}
            >
              {currentRoom?.type === "Group" &&
                currentRoom.initiator === user?._id && (
                  <div
                    className={cx("option")}
                    onClick={() => dispatch(setFormPopUp("ChangeRoomName"))}
                  >
                    <button>
                      <BsFillPencilFill
                        size="15"
                        color={theme ? "#fff" : "#222222"}
                      />
                    </button>
                    <h4>Doi ten doan chat</h4>
                  </div>
                )}
              <label htmlFor="upload-img">
                <div className={cx("option")}>
                  <button>
                    <BsImageFill size="15" color={theme ? "#fff" : "#222222"} />
                  </button>
                  <h4>Thay doi anh</h4>
                </div>
              </label>
              <div
                className={cx("option")}
                onClick={() => dispatch(setFormPopUp("ChangeNickName"))}
              >
                <button>
                  <FaSignature size="15" color={theme ? "#fff" : "#222222"} />
                </button>
                <h4>Sua biet danh</h4>
              </div>
            </div>
          </div>
          <div className={cx("member-chat", "option-wrapper")}>
            <div
              className={cx("show-option")}
              onClick={() => handleShowOption("member-chat")}
            >
              <h4>Thành viên {`( ${currentRoom?.users.length} )`}</h4>

              <button>
                {(!isOpenOption.includes("member-chat") && (
                  <BsChevronCompactDown color={theme ? "#fff" : ""} />
                )) || <BsChevronCompactUp color={theme ? "#fff" : ""} />}
              </button>
            </div>
            <div
              className={cx("option-section", {
                isShow: isOpenOption.includes("member-chat"),
              })}
            >
              <ul className={cx("list-member")}>
                <div
                  className={cx("add-member")}
                  onClick={() => {
                    if (currentRoom?.type === "Private") {
                      params.set("user-added", currentRoom.users[1].user._id);
                      setSearchParams(params);
                      dispatch(setFormPopUp("CreateGroupChat"));
                      return;
                    }
                    dispatch(setFormPopUp("AddUserToGroupChat"));
                  }}
                >
                  <div className={cx("add-member-icon")}>
                    <AiOutlinePlus size={20} color={theme ? "#fff" : "#000"} />
                  </div>
                  <p>
                    {currentRoom?.type === "Private"
                      ? "Tạo nhóm"
                      : "Thêm người"}
                  </p>
                </div>
                <li className={cx("option")}>
                  <div>
                    <img src={admin?.user.photoURL} alt="" />
                    <h4>{admin?.nickname || admin?.user.displayName}</h4>
                    {userOnline.some(
                      (userId) => userId === admin?.user._id
                    ) && <div className={cx("online")}></div>}
                  </div>
                </li>
                {currentRoom?.users.map((e) => {
                  if (e.user._id === currentRoom.initiator) {
                    return "";
                  }
                  return (
                    <li key={e.user._id} className={cx("option")}>
                      <div>
                        <img src={e.user.photoURL} alt="" />
                        <h4>{e.user.displayName}</h4>
                        {userOnline.some((userId) => userId === e.user._id) && (
                          <div className={cx("online")}></div>
                        )}
                      </div>

                      {currentRoom?.type === "Group" && (
                        <Tippy
                          interactive
                          placement="top"
                          trigger="click"
                          render={() => {
                            return (
                              <>
                                <div className={cx("member-option")}>
                                  <div
                                    className={cx("")}
                                    onClick={() =>
                                      handleAppointmentAsAdministrator(e)
                                    }
                                  >
                                    <FaShieldAlt size="15" color="#2d6eff" />
                                    <div
                                      className={cx(
                                        "appointment-as-administrator"
                                      )}
                                    >
                                      Chỉ định làm quản trị viên
                                    </div>
                                  </div>

                                  <div
                                    className={cx("l")}
                                    onClick={() =>
                                      handleRemoveUser(
                                        currentRoom.users.find(
                                          (u) => u.user._id === e.user._id
                                        )
                                      )
                                    }
                                  >
                                    <FaUserAltSlash size="15" color="" />
                                    <div className={cx("remove-user")}>
                                      Xóa thành viên
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          }}
                        >
                          <div>
                            {e.user._id !== currentRoom?.initiator &&
                              currentRoom.initiator === user?._id && (
                                <BsThreeDots size="15" color="" />
                              )}
                          </div>
                        </Tippy>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className={cx("file-chat", "option-wrapper")}>
            <div
              className={cx("show-option")}
              onClick={() => handleShowOption("file-chat")}
            >
              <h4>Media file</h4>
              <button>
                {(!isOpenOption.includes("file-chat") && (
                  <BsChevronCompactDown color={theme ? "#fff" : ""} />
                )) || <BsChevronCompactUp color={theme ? "#fff" : ""} />}
              </button>
            </div>

            <div
              className={cx("option-section", {
                isShow: isOpenOption.includes("file-chat"),
              })}
            >
              <div
                className={cx("option")}
                onClick={() => dispatch(setFormPopUp("WatchMediaFile"))}
              >
                <button>
                  <MdOutlinePermMedia
                    size="15"
                    color={theme ? "#fff" : "#222222"}
                  />
                </button>
                <h4>Media file</h4>
              </div>
            </div>
          </div>
          <div className={cx("private-and-help-chat", "option-wrapper")}>
            <div
              className={cx("show-option")}
              onClick={() => handleShowOption("private-and-help-chat")}
            >
              <h4>Riêng tư và hỗ trợ</h4>
              <button>
                {(!isOpenOption.includes("private-and-help-chat") && (
                  <BsChevronCompactDown color={theme ? "#fff" : ""} />
                )) || <BsChevronCompactUp color={theme ? "#fff" : ""} />}
              </button>
            </div>

            <div
              className={cx("option-section", {
                isShow: isOpenOption.includes("private-and-help-chat"),
              })}
            >
              <Tippy
                interactive
                trigger="click"
                placement="top"
                render={() => {
                  return (
                    <div className={cx("link-join")}>
                      <div
                        onClick={() => {
                          toastMessage("success", "Lưu đường dẫn thành công");
                          navigator.clipboard.writeText(
                            `http://localhost:3000/p/${currentRoom?._id}`
                          );
                        }}
                      >
                        <input
                          readOnly
                          value={`http://localhost:3000/p/${currentRoom?._id}`}
                        />
                        <button>
                          <MdContentCopy size="15" color="#ff4d4d" />
                        </button>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          onChange={handleAllowJoinLink}
                          defaultChecked={currentRoom?.isAcceptLink}
                        />
                        <p>cho phép tham gia bằng liên kết</p>
                      </div>
                    </div>
                  );
                }}
              >
                <div className={cx("option")}>
                  <button>
                    <BsLink45Deg color={theme ? "#fff" : "#222222"} />
                  </button>
                  <h4>Tham gia lien ket</h4>
                </div>
              </Tippy>
              {currentRoom?.type === "Group" && (
                <div
                  className={cx("option")}
                  onClick={handleDeleteChatOrLeaveRoom}
                >
                  <button>
                    <FaSignOutAlt color={theme ? "#fff" : "#222222"} />
                  </button>
                  <h4>
                    {(currentRoom?.initiator === user?._id &&
                      "Xóa đoạn chat") ||
                      (currentRoom?.initiator !== user?._id && "Rời nhóm")}
                  </h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageInfoTab;