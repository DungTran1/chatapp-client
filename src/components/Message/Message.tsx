import React, { useEffect, useRef, useState } from "react";

import "react-lazy-load-image-component/src/effects/blur.css";

import MessageInfoTab from "./ChatInfo/ChatInfo";
import MessageSection from "./MessageSection/MessageSection";
import MessageSubmit from "./MessageSection/MessageSubmit/MessageSubmit";

import { useAppSelector } from "../../store/hook";

import { useMediaQuery } from "react-responsive";
import { Socket } from "socket.io-client";

import { MdNavigateBefore } from "react-icons/md";
import { IoIosOptions } from "react-icons/io";

import {
  addSocketEventListener,
  defaultPhoto,
  removeSocketEventListener,
} from "../../shared/utils";

import classnames from "classnames/bind";
import styles from "./Message.module.scss";
import { useQuerySelector } from "../../service/Query/querySelector";
import { useInfiniteMessageQuery } from "../../service/Query/UseQuery";
import { Link, useParams } from "react-router-dom";
import { Message } from "../../shared/type";
import { useActionQuery } from "../../service/Query/ActionQuery";
import Loading from "../Common/Loading/Loading";

const cx = classnames.bind(styles);
type MessageProps = {
  socket: Socket;
};
const MessageComp: React.FC<MessageProps> = ({ socket }) => {
  const { AddMessage, RevokeMessage } = useActionQuery();
  const [isToggleOption, setIsToggleOption] = useState(false);
  const { currentRoom } = useQuerySelector();
  const isTablet = useMediaQuery({ maxWidth: "46.25em" });

  const { chatNotificationSound } = useAppSelector((state) => state.chat);
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  const user = useAppSelector((state) => state.auth.user);
  const skip = useRef(0);
  const { roomId } = useParams();
  useEffect(() => {
    skip.current = 0;
  }, [roomId]);
  const { data, hasNextPage, fetchNextPage, isLoading } =
    useInfiniteMessageQuery(roomId, skip.current);
  const messages = data?.pages.map((page) => page.messages).flat() || [];
  useEffect(() => {
    const receiveSendMessage = (data: { message: Message }) => {
      skip.current = skip.current + 1;
      AddMessage(data.message);
      chatNotificationSound.play();
    };
    const receiveRevokeMessage = (data: {
      messageId: string;
      type: string;
    }) => {
      if (!roomId) return;
      RevokeMessage(roomId, data.messageId);
    };
    const listEvent = [
      ["receive_send_message", receiveSendMessage],
      ["receive_revoke_message", receiveRevokeMessage],
    ];
    addSocketEventListener(listEvent, socket);
    return () => {
      removeSocketEventListener(listEvent, socket);
    };
  }, []);

  const displayPrivateOrGroupChat = () => {
    if (!currentRoom) {
      return;
    }
    if (currentRoom?.type === "Group") {
      return currentRoom.name;
    }
    if (currentRoom?.type === "Private") {
      const display = currentRoom.users.find((u) => u.user._id !== user?._id);

      return display?.nickname || display?.user.displayName;
    }
  };

  return (
    <>
      {currentRoom?.users.find((u) => u.user._id === user?._id) &&
        !isLoading &&
        messages.length > 0 && (
          <div
            className={`${cx("message-wrapper", {
              dark: darkTheme,
            })} 
          
        `}
          >
            {isLoading && <Loading />}
            {(!isTablet || (isTablet && !isToggleOption)) && (
              <div
                className={cx({
                  dark: darkTheme,
                })}
              >
                <header>
                  <div>
                    {isTablet && (
                      <Link
                        to={"/chat"}
                        className={cx("back-room")}
                        onClick={() => {
                          // setIsOpenMessage(false);
                        }}
                      >
                        <MdNavigateBefore size={25} color="#8141ff" />
                      </Link>
                    )}
                    <img
                      src={
                        currentRoom.type === "Group"
                          ? currentRoom.photoURL || defaultPhoto("group.png")
                          : currentRoom.users.find(
                              (u) => u.user._id !== user?._id
                            )?.user.photoURL || defaultPhoto("user.png")
                      }
                      alt=""
                    />
                    <h4>{displayPrivateOrGroupChat()}</h4>
                  </div>
                  <div
                    className={cx("message-tab-info")}
                    onClick={() => setIsToggleOption(!isToggleOption)}
                  >
                    <button>
                      <IoIosOptions size="25" color="" />
                    </button>
                  </div>
                </header>

                <div>
                  <MessageSection
                    dataLength={data?.pages.length || 0}
                    messages={messages}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    socket={socket}
                  />
                  <MessageSubmit socket={socket} />
                </div>
              </div>
            )}

            {isToggleOption && (
              <MessageInfoTab
                setIsToggleOption={setIsToggleOption}
                socket={socket}
              />
            )}
          </div>
        )}
    </>
  );
};
export default React.memo(MessageComp);
