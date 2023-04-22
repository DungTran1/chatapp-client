import Tippy from "@tippyjs/react/headless";
import { Socket } from "socket.io-client";
import { Message } from "../../../../shared/type";
import classnames from "classnames/bind";
import styles from "./MessageControl.module.scss";
import { BsEmojiSmile, BsThreeDotsVertical } from "react-icons/bs";
import { FaReply } from "react-icons/fa";
import { getReactionEmoji } from "../../../../shared/utils";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { setReplyMessage } from "../../../../reducer/ChatReducer";
import { useParams } from "react-router-dom";

const cx = classnames.bind(styles);
type MoreFunctionProps = {
  className: string;
  socket: Socket;
  index: number;
  message: Message;
};
const MoreFunction: React.FC<MoreFunctionProps> = ({
  className,
  socket,
  index,
  message,
}) => {
  const dispatch = useAppDispatch();
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  const user = useAppSelector((state) => state.auth.user);
  const { roomId } = useParams();
  const handleRevokeMessage = () => {
    socket.emit("revoke_message", {
      userRevoke: user,
      messageId: message._id,
      type: "Revocation",
      roomId,
      lastMessage: index === 0 ? message : null,
    });
  };
  const handleReaction = (name: string) => {
    socket.emit("send_reaction", {
      name,
      user,
      roomId,
      messageId: message._id,
    });
  };
  return (
    <div
      className={cx({
        [className]: cx(className),
        more: true,
        dark: darkTheme,
      })}
    >
      <div className={cx("see-more-list")}>
        {message.actedByUser?._id === user?._id && (
          <Tippy
            arrow
            interactive
            hideOnClick={"toggle"}
            placement={
              message?.actedByUser?._id === user?._id
                ? "left-start"
                : "right-start"
            }
            zIndex={999}
            render={(attrs) => {
              return (
                <div className={cx("revoke-message")} tabIndex={-1} {...attrs}>
                  <div onClick={handleRevokeMessage}>Gỡ tin nhắn</div>
                </div>
              );
            }}
          >
            <button>
              <BsThreeDotsVertical size={15} color="#7e7e7e" />
            </button>
          </Tippy>
        )}
        <button onClick={() => dispatch(setReplyMessage(message))}>
          <FaReply size={15} color="#7e7e7e" />
        </button>
        <Tippy
          interactive
          trigger="click"
          render={() => {
            const listReactEmo = [
              "love",
              "like",
              "haha",
              "care",
              "wow",
              "sad",
              "angry",
            ];
            return (
              <ul className={cx("list-emoji-reaction")}>
                {listReactEmo.map((name) => (
                  <li onClick={() => handleReaction(name)} key={name}>
                    <img src={getReactionEmoji(name)} alt="" />
                  </li>
                ))}
              </ul>
            );
          }}
        >
          <button>
            <BsEmojiSmile size={15} color="#7e7e7e" />
          </button>
        </Tippy>
      </div>
    </div>
  );
};

export default MoreFunction;
