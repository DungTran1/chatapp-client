import React, { useEffect, useRef, useState } from "react";

import "react-lazy-load-image-component/src/effects/blur.css";

import MessageInfoTab from "./ChatInfo/ChatInfo";
import MessageContent from "./MessageContent/MessageContent";
import MessageSubmit from "./MessageContent/MessageSubmit/MessageSubmit";

import { useAppSelector } from "../../store/hook";

import { useMediaQuery } from "react-responsive";
import { Socket } from "socket.io-client";

import { MdNavigateBefore } from "react-icons/md";
import { IoIosOptions } from "react-icons/io";

import { defaultPhoto } from "../../shared/utils";

import classnames from "classnames/bind";
import styles from "./Message.module.scss";
import { useQuerySelector } from "../../service/Query/querySelector";
import { useInfiniteMessageQuery } from "../../service/Query/UseQuery";
import { Link, useParams } from "react-router-dom";
import { Message } from "../../shared/type";
import { useActionQuery } from "../../service/Query/ActionQuery";

const cx = classnames.bind(styles);
interface MessageProps {
  socket: Socket;
}
const MessageSection: React.FC<MessageProps> = ({ socket }) => {
  const { AddMessage, RevokeMessage } = useActionQuery();
  const [isToggleOption, setIsToggleOption] = useState(false);
  const { currentRoom } = useQuerySelector();
  const isMobileOrTablet = useMediaQuery({ maxWidth: "54em" });
  const isMobile = useMediaQuery({ maxWidth: "40em" });
  const { chatNotificationSound } = useAppSelector((state) => state.chat);
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.auth.user);
  const skip = useRef(0);
  const { roomId } = useParams();
  useEffect(() => {
    skip.current = 0;
  }, [roomId]);

  const { data, hasNextPage, fetchNextPage } = useInfiniteMessageQuery(
    roomId,
    skip.current
  );
  const messages: Message[] = [];
  data?.pages.forEach((e) => {
    e?.messages.forEach((p) => {
      messages.push(p);
    });
  });

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
    socket.on("receive_send_message", receiveSendMessage);
    socket.on("receive_revoke_message", receiveRevokeMessage);
    const listEvent = {
      receive_send_message: receiveSendMessage,
      receive_type_message: receiveRevokeMessage,
    };
    return () => {
      for (let i in listEvent)
        socket.off(i, listEvent[i as keyof typeof listEvent]);
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
        messages.length > 0 && (
          <div
            className={`${cx("message-wrapper", {
              dark: theme,
            })} 
          
        `}
          >
            {(!isMobileOrTablet || (isMobileOrTablet && !isToggleOption)) && (
              <div
                className={cx({
                  dark: theme,
                })}
              >
                <header>
                  <div>
                    {isMobile && (
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
                        currentRoom?.photoURL ||
                        defaultPhoto(
                          currentRoom.type === "Private"
                            ? "user.png"
                            : "group.png"
                        )
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
                  <MessageContent
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
export default React.memo(MessageSection);
