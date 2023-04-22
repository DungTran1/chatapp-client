import React, { Fragment, useMemo } from "react";
import { RotatingLines } from "react-loader-spinner";
import { Message, Messages } from "../../../shared/type";
import "react-lazy-load-image-component/src/effects/blur.css";

import InfiniteScroll from "react-infinite-scroll-component";

import MessageControl from "./MessageControl/MessageControl";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../../../store/hook";

import UserReacted from "./UserReaction/UserReacted";
import MessageTyping from "./MessageTyping/MessageTyping";

import classnames from "classnames/bind";
import styles from "./MessageSection.module.scss";

import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

import MessageContent from "./MessageContent/MessageContent";
const cx = classnames.bind(styles);
type MessageSectionProps = {
  dataLength: number;
  hasNextPage: boolean | undefined;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<Messages, Error>>;
  messages: Message[];
  socket: Socket;
};
const MessageSection: React.FC<MessageSectionProps> = ({
  dataLength,
  hasNextPage,
  fetchNextPage,
  messages,
  socket,
}) => {
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  const user = useAppSelector((state) => state.auth.user);
  const file = useMemo(() => {
    const files = messages
      .filter((e) => e.type !== "Revocation")
      .map((e) => e.files)
      .reverse();
    const file = files.flat().reverse();

    return file;
  }, [messages]);
  const messageTime = (messCur: Message, messPrev: Message) => {
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
    const dateBefore = new Date(messPrev.createdAt);
    const dateAfter = new Date(messCur.createdAt);
    const dateNow = new Date();
    const hour = dateAfter.getHours() - dateBefore.getHours();
    const diff = dateNow.getTime() - dateAfter.getTime();
    if (diff > unit.year || diff > unit.month) {
      if (hour) {
        return (
          <p
            className={cx("message-time")}
          >{`${dateAfter.toLocaleTimeString()},${dateAfter.toLocaleDateString()},${dateAfter.getFullYear()}`}</p>
        );
      }
    }
    if (diff > unit.week) {
      if (hour) {
        return (
          <p
            className={cx("message-time")}
          >{`${dateAfter.getHours()}:${dateAfter.getMinutes()}, ${dateAfter.getDate()} month ${dateAfter.getMonth()},${dateAfter.getFullYear()}`}</p>
        );
      }
    }
    if (diff > unit.day) {
      if (hour) {
        return (
          <p className={cx("message-time")}>{`${
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
            className={cx("message-time")}
          >{`${dateAfter.getHours()}:${dateAfter.getMinutes()}`}</p>
        );
      }
    }
  };

  return (
    <>
      <div
        id="scrollableDiv"
        style={{
          height: "520px",
          overflowX: "hidden",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column-reverse",
        }}
        className={cx("message-content", { dark: darkTheme })}
      >
        <>
          <InfiniteScroll
            inverse={true}
            style={{
              height: "520px",
              padding: "40px 0 35px 0",
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
                    className={cx({
                      "message-row": true,
                      notification: message.type === "Notification",
                      revoke: message.type === "Revocation",
                      others: user?._id !== message.actedByUser?._id,
                      self: user?._id === message.actedByUser?._id,
                      dark: darkTheme,
                    })}
                  >
                    <div>
                      <div className={cx("user-info")}>
                        <MessageContent
                          messCur={message}
                          messNext={messageArr[index - 1]}
                          file={file}
                        />
                        <div className={cx("showMessageControl")}>
                          <MessageControl
                            className={
                              user?._id !== message.actedByUser?._id
                                ? "others"
                                : "self"
                            }
                            socket={socket}
                            index={index}
                            message={message}
                          />
                        </div>
                        <UserReacted message={message} socket={socket} />
                      </div>
                    </div>
                  </div>

                  {index !== messageArr.length - 1 &&
                    messageTime(messageArr[index], messageArr[index + 1])}
                </Fragment>
              );
            })}
          </InfiniteScroll>
        </>
      </div>
    </>
  );
};

export default MessageSection;
