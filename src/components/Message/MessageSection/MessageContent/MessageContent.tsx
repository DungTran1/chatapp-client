import React from "react";
import ReactPlayer from "react-player/lazy";
import { Message } from "../../../../shared/type";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import classnames from "classnames/bind";
import styles from "./MessageContent.module.scss";
import { useSearchParams } from "react-router-dom";
import { setFormPopUp } from "../../../../reducer/ChatReducer";
import { useQuerySelector } from "../../../../service/Query/querySelector";
import { CiPlay1 } from "react-icons/ci";
import Tippy from "@tippyjs/react/headless";

const cx = classnames.bind(styles);
type MessageContentProps = {
  file: string[];
  messCur: Message;
  messNext: Message | undefined;
};

const MessageContent: React.FC<MessageContentProps> = ({
  messCur,
  messNext,
  file,
}) => {
  const dispatch = useAppDispatch();
  const [params, setSearchParams] = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  const { currentRoom } = useQuerySelector();
  const activedBy = messCur.actedByUser;

  const handleOpenMedia = (fileName: string) => {
    dispatch(setFormPopUp("WatchMediaFile"));
    const mediaIndex = file.findIndex((e) => e === fileName);
    params.set("mediaIndex", mediaIndex.toString() || "0");
    setSearchParams(params);
  };

  const displayNicknameOrDefaultName =
    currentRoom?.users.find((u) => u.user._id === activedBy?._id)?.nickname ||
    activedBy?.displayName;
  const displayNameAndImage = user?._id !== messCur?.actedByUser?._id && (
    <>
      {/* {messCur.actedByUser?._id !== messNext?.actedByUser?._id && (
        <p className={cx("user-name")}>{displayNicknameOrDefaultName}</p>
      )} */}
      {messNext &&
      (messCur.type === "Sending" || messCur.type === "Revocation") &&
      (messCur.actedByUser?._id !== messNext?.actedByUser?._id ||
        messNext.type === "Notification") ? (
        <Tippy
          arrow={true}
          placement="top-start"
          render={(attr) => {
            return (
              <p {...attr} className={cx("user-name")}>
                {displayNicknameOrDefaultName}
              </p>
            );
          }}
        >
          <img
            src={messCur.actedByUser?.photoURL}
            className={cx("user-photo")}
            alt=""
          />
        </Tippy>
      ) : (
        <div className={cx("img-user-distance")}></div>
      )}
    </>
  );
  return (
    <div
      className={cx({
        wrapper: true,
        dark: darkTheme,
        revoke: messCur.type === "Revocation",
        others: user?._id !== messCur.actedByUser?._id,
        self: user?._id === messCur.actedByUser?._id,
      })}
    >
      {messCur.type === "Revocation" && (
        <>
          {displayNameAndImage}
          <p className={cx("revoke-message-text", "message-text")}>
            Tin nhắn đã bị thu hồi
          </p>
        </>
      )}
      {messCur.type === "Sending" && (
        <>
          {displayNameAndImage}
          <div className={cx("reply-message-section")}>
            {messCur.reply && (
              <div
                className={cx("reply-message-content", {
                  revoke: messCur.reply.type === "Revocation",
                })}
              >
                <p>
                  {messCur.reply.type === "Revocation"
                    ? "Tin nhắn đã bị thu hồi"
                    : messCur.reply.text}
                </p>
              </div>
            )}
            {messCur.text && (
              <p className={cx("message-text", "send-message")}>
                {messCur.text}
              </p>
            )}
            {messCur?.files.length > 0 && (
              <div className={cx("media-file-message")}>
                {messCur.files.map((src, index) => {
                  if (src.match(/.mp4/g)?.length) {
                    return (
                      <div
                        className={cx("video")}
                        onClick={() => handleOpenMedia(src)}
                      >
                        <ReactPlayer
                          playsinline={true}
                          key={src}
                          width="200px"
                          height="200px"
                          url={src}
                          controls
                          playIcon={<CiPlay1 size={25} />}
                        />
                      </div>
                    );
                  }
                  return (
                    <img
                      key={index}
                      src={src}
                      alt=""
                      onClick={() => handleOpenMedia(src)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {messCur.type === "Notification" && (
        <>
          <p>
            {`${
              activedBy
                ? activedBy._id === user?._id
                  ? "Bạn"
                  : activedBy.displayName
                : ""
            } ${messCur.text}`}
          </p>
        </>
      )}
    </div>
  );
};

export default React.memo(MessageContent);
