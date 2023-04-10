import React, {
  useEffect,
  Fragment,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { RotatingLines } from "react-loader-spinner";
import { Message, Messages, User } from "../../../shared/type";
import "react-lazy-load-image-component/src/effects/blur.css";

import InfiniteScroll from "react-infinite-scroll-component";

import MoreFunction from "./SeeMore/SeeMore";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useParams, useSearchParams } from "react-router-dom";

import Loading from "../../Loading/Loading";
import UserReacted from "./UserReaction/UserReacted";
import MessageTyping from "./MessageTyping/MessageTyping";

import classnames from "classnames/bind";
import styles from "./MessageContent.module.scss";
import { setFormPopUp } from "../../../reducer/ChatReducer";
import { useQuerySelector } from "../../../service/Query/querySelector";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
const cx = classnames.bind(styles);
interface MessageContentProps {
  dataLength: number;
  hasNextPage: boolean | undefined;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<Messages, Promise<Message>>>;
  messages: Message[];
  user: User | null;
  socket: Socket;
}
const MessageContent: React.FC<MessageContentProps> = ({
  dataLength,
  hasNextPage,
  fetchNextPage,
  messages,
  user,
  socket,
}) => {
  const dispatch = useAppDispatch();

  const [params, setSearchParams] = useSearchParams();
  const theme = useAppSelector((state) => state.theme.theme);
  const { currentRoom } = useQuerySelector();

  const files = messages
    .filter((e) => e.type !== "Revocation")
    .map((e) => e.files)
    .reverse();
  let file: string[] = [];
  for (let i = 0; i < files.length; i++) {
    for (let j = 0; j < files[i].length; j++) {
      file.push(files[i][j]);
    }
  }
  file.reverse();
  const renderDate = (message: Message[], index: number) => {
    if (index === message.length - 1) {
      return;
    }
    const weekday = [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ];
    const unit = {
      year: 12 * 30 * 7 * 24 * 60 * 60 * 1000,
      month: 30 * 7 * 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
    };
    const dateBefore = new Date(message[index + 1].createdAt);
    const dateAfter = new Date(message[index].createdAt);
    const dateNow = new Date();
    const hour = dateAfter.getHours() - dateBefore.getHours();
    const diff = dateNow.getTime() - dateAfter.getTime();
    if (diff > unit.year || diff > unit.month) {
      if (hour) {
        return (
          <p
            className={cx("time-display")}
          >{`${dateAfter.toLocaleTimeString()},${dateAfter.toLocaleDateString()},${dateAfter.getFullYear()}`}</p>
        );
      }
    }
    if (diff > unit.week) {
      if (hour) {
        return (
          <p
            className={cx("time-display")}
          >{`${dateAfter.getHours()}:${dateAfter.getMinutes()}, ${dateAfter.getDate()} month ${dateAfter.getMonth()},${dateAfter.getFullYear()}`}</p>
        );
      }
    }
    if (diff > unit.day) {
      if (hour) {
        return (
          <p className={cx("time-display")}>{`${
            weekday[dateAfter.getDay()]
          }, ${dateAfter.getHours()}:${dateAfter.getMinutes()}`}</p>
        );
      }
    }
    if (
      diff > unit.hour ||
      dateAfter.getTime() - dateBefore.getTime() > unit.hour
    ) {
      if (hour) {
        return (
          <p
            className={cx("time-display")}
          >{`${dateAfter.getHours()}:${dateAfter.getMinutes()}`}</p>
        );
      }
    }
  };
  const handleOpenMedia = (fileName: string) => {
    dispatch(setFormPopUp("WatchMediaFile"));
    const mediaIndex = file.findIndex((e) => e === fileName);
    params.set("mediaIndex", mediaIndex.toString() || "0");
    setSearchParams(params);
  };
  const displayNicknameOrDefaultName = (mess: Message) => {
    return (
      currentRoom?.users.find((u) => u.user._id === mess.actedByUser?._id)
        ?.nickname || mess.actedByUser?.displayName
    );
  };
  const renderCommentContent = (mess: Message) => {
    if (mess.type === "Revocation") {
      return (
        <>
          <p className={cx("revoke-message-text", "message-text")}>
            Tin nhắn đã bị thu hồi
          </p>
        </>
      );
    }
    if (mess.type === "Sending") {
      return (
        <>
          <div className={cx("reply-message-section")}>
            {mess.reply && (
              <div className={cx("reply-message-content")}>
                <p>Tin nhắn đã bị thu hồi</p>
              </div>
            )}
            {mess.text && (
              <p className={cx("message-text", "send-message")}>{mess.text}</p>
            )}
            {mess?.files.length > 0 && (
              <div className={cx("media-file-message")}>
                {mess.files.map((e, index) => {
                  if (e.match(/.mp4/g)?.length) {
                    return (
                      <video
                        onClick={() => handleOpenMedia(e)}
                        key={index}
                        src={e}
                        width="200"
                        height="200"
                        controls
                      >
                        <source src={e} />
                      </video>
                    );
                  }
                  return (
                    <img
                      key={index}
                      src={e}
                      alt=""
                      onClick={() => handleOpenMedia(e)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </>
      );
    }
    if (mess.type === "Notification") {
      const activedBy = mess.actedByUser;
      return (
        <>
          <p>
            {`${
              activedBy
                ? activedBy._id === user?._id
                  ? "Bạn"
                  : activedBy.displayName
                : ""
            } ${mess.text}`}
          </p>
        </>
      );
    }
  };

  return (
    <>
      <div
        id="scrollableDiv"
        style={{
          height: "500px",
          overflowX: "hidden",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
        }}
        className={cx("message-content")}
      >
        <>
          <InfiniteScroll
            inverse={true}
            style={{
              height: "500px",
              padding: "30px 0 10px 0",
              display: "flex",
              overflowX: "hidden",
              flexDirection: "column-reverse",
            }}
            scrollableTarget="scrollableDiv"
            dataLength={dataLength}
            next={() => fetchNextPage()}
            hasMore={hasNextPage as boolean}
            height={200}
            loader={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="30"
                  visible={true}
                />
              </div>
            }
            scrollThreshold={1}
          >
            <MessageTyping />
            {messages.map((message, index, messageArr) => {
              return (
                <Fragment key={message._id}>
                  <div
                    id={message._id}
                    // ref={setRefs}
                    className={cx({
                      "message-row": true,
                      notification: message.type === "Notification",
                      revoke: message.type === "Revocation",
                      others: user?._id !== message.actedByUser?._id,
                      self: user?._id === message.actedByUser?._id,

                      dark: theme,
                    })}
                  >
                    <div>
                      <div className={cx("user-info")}>
                        {(message.type === "Sending" ||
                          message.type === "Revocation") &&
                          user?._id !== message?.actedByUser?._id && (
                            <>
                              {messageArr[index].actedByUser?._id !==
                                messageArr[index + 1]?.actedByUser?._id && (
                                <div>
                                  <p className={cx("user-name")}>
                                    {displayNicknameOrDefaultName(message)}
                                  </p>
                                </div>
                              )}
                              {((message.type === "Sending" ||
                                message.type === "Revocation") &&
                                messageArr[index].actedByUser?._id !==
                                  messageArr[index - 1]?.actedByUser?._id && (
                                  <LazyLoadImage
                                    // effect={""}
                                    width={40}
                                    height={40}
                                    src={message?.actedByUser?.photoURL}
                                    alt=""
                                  />
                                )) || (
                                <div className={cx("img-user-distance")}></div>
                              )}
                            </>
                          )}
                        {renderCommentContent(message)}

                        <div className={cx("showSeeMore")}>
                          <MoreFunction
                            className={
                              user?._id !== message.actedByUser?._id
                                ? "others"
                                : "self"
                            }
                            socket={socket}
                            user={user}
                            index={index}
                            message={message}
                          />
                        </div>
                        <UserReacted message={message} socket={socket} />
                      </div>
                    </div>
                  </div>

                  {renderDate(messageArr, index)}
                </Fragment>
              );
            })}
          </InfiniteScroll>
        </>
      </div>
    </>
  );
};

export default MessageContent;
