import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDropzone, FileWithPath } from "react-dropzone";
import { Socket } from "socket.io-client";
import { Message } from "../../../../shared/type";
import { uploadMultiFile } from "../../../../service/saveImage";
import { BsEmojiSmileFill, BsImage } from "react-icons/bs";
import { RiFileGifFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaPaperPlane } from "react-icons/fa";
import { setReplyMessage } from "../../../../reducer/ChatReducer";
import { IoMdClose } from "react-icons/io";
import Tippy from "@tippyjs/react/headless";

import classnames from "classnames/bind";
import styles from "./MessageSubmit.module.scss";
import { useQuerySelector } from "../../../../service/Query/querySelector";
import { toastMessage } from "../../../../shared/utils";
const cx = classnames.bind(styles);

type MessageSubmitProps = {
  socket: Socket;
};
const MessageSubmit: React.FC<MessageSubmitProps> = ({ socket }) => {
  const dispatch = useAppDispatch();
  const { roomId } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const { currentRoom } = useQuerySelector();
  const { replyMessage } = useAppSelector((state) => state.chat);
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  const sendMessageRef = useRef() as any;
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
      "video/*": [],
    },

    onDrop: (acceptedFiles) => {
      const sizeTotal = acceptedFiles.reduce((total, file) => file.size, 0);
      const maxSize = 10 * 1024 * 1024;
      if (sizeTotal > maxSize) {
        toastMessage("error", "File không được vượt quá 10MB");
        return;
      }
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });
  useEffect(() => {
    if (inputValue.trim()) {
      socket.emit("typing", { status: true, user, roomId: roomId });
    }
    if (!inputValue.trim()) {
      socket.emit("typing", { status: false, user, roomId: roomId });
    }
  }, [inputValue]);
  const handleSendMessage = async () => {
    const sendMessage = sendMessageRef.current.value;
    if (!inputValue.trim() && files.length <= 0) {
      return;
    }
    setFiles([]);
    setInputValue("");
    dispatch(setReplyMessage(null));
    sendMessageRef.current.focus();
    let fileMedia;
    fileMedia = await uploadMultiFile(files);
    socket.emit("typing", {
      status: false,
      roomId: roomId,
      user: user,
    });
    if (!currentRoom?.users.find((u) => u.user._id === user?._id)) {
      return window.alert("Hiện tại bạn không ở trong phòng này");
    }
    socket.emit("send_message", {
      now: new Date().toLocaleString(),
      message: sendMessage,
      files: fileMedia,
      reply: replyMessage,
      roomId: roomId,
      user: user,
    });
  };
  const handleOnchangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const displayNicknameOrDefaultName = (mess: Message) => {
    if (mess.actedByUser?._id === user?._id) return "Mình";
    return (
      currentRoom?.users.find((u) => u.user._id === mess.actedByUser?._id)
        ?.nickname || mess.actedByUser?.displayName
    );
  };
  return (
    <div className={cx("send-mess", { dark: darkTheme })}>
      <div className={cx("upload-file")}>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <button>
            <BsImage size={20} color="#ff6565" />
          </button>
          <button>
            <RiFileGifFill size={20} color="#ff6565" />
          </button>
        </div>
        <Tippy
          arrow
          trigger="click"
          interactive
          zIndex={999}
          render={(attrs) => <></>}
        >
          <button type="button">
            <BsEmojiSmileFill size={20} color="#ff6565" />
          </button>
        </Tippy>
      </div>
      {replyMessage && (
        <div className={cx("reply-message")}>
          <div className={cx("user-replied")}>
            <span>Bạn đang trả lời 1 tin nhắn của </span>
            <span className={cx("user-name-replied")}>
              {displayNicknameOrDefaultName(replyMessage)}
            </span>
          </div>
          <div>
            <p className={cx("message-replied")}>{replyMessage.text}</p>
          </div>
          <button
            className={cx("close-reply-btn")}
            onClick={() => dispatch(setReplyMessage(null))}
          >
            <IoMdClose size="20" color={darkTheme ? "#fff" : ""} />
          </button>
        </div>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onKeyDown={async (e) => {
          if (e.key === "Enter") await handleSendMessage();
        }}
      >
        {files.length > 0 && (
          <div className={cx("message-in-image")}>
            {files.map((file: any) => (
              <div className={cx("img-preview")} key={file.preview}>
                {file.type.includes("image") && (
                  <img src={file.preview} alt="" />
                )}
                {file.type.includes("video/mp4") && (
                  <video src={file.preview} width="80" height="80"></video>
                )}
                <button
                  onClick={() => {
                    setFiles((prev) =>
                      prev.filter((p: any) => p.preview !== file.preview)
                    );
                  }}
                >
                  <AiFillCloseCircle size="30" color={"#fff"} />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="type"
          className={cx({ isActive: files.length > 0 })}
          ref={sendMessageRef}
          value={inputValue}
          onChange={handleOnchangeInput}
        />
        <button className={cx("submit-btn")} onClick={handleSendMessage}>
          <FaPaperPlane size="25" color={"#fb5a5a"} />
        </button>
      </form>
    </div>
  );
};

export default MessageSubmit;
