import { useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";
import { Message, User } from "../../../../shared/type";
import { getReactionEmoji } from "../../../../shared/utils";
import { useAppSelector } from "../../../../store/hook";
import DetailUserReact from "./DetailUserReact";
import { useActionQuery } from "../../../../service/Query/ActionQuery";
import { useReactionQuery } from "../../../../service/Query/UseQuery";
import { useParams } from "react-router-dom";
import styles from "./UserReaction.module.scss";
import classnames from "classnames/bind";
const cx = classnames.bind(styles);
interface UserReactedProps {
  socket: Socket;
  message: Message;
}
const UserReacted: React.FC<UserReactedProps> = ({ message, socket }) => {
  const { roomId } = useParams();
  const theme = useAppSelector((state) => state.theme.theme);
  const { chatNotificationSound } = useAppSelector((state) => state.chat);
  const [isShowUserReaction, setIsShowUserReaction] = useState(false);
  const { UpdateReaction } = useActionQuery();
  useEffect(() => {
    socket.on(
      "receive_send_reaction",
      async (data: {
        user: User;
        name: string;
        messageId: string;
        roomId: string;
      }) => {
        if (data.messageId === message._id) {
          UpdateReaction(data.messageId, data.user, data.name);
          chatNotificationSound.play();
        }
      }
    );

    return () => {
      socket.off("receive_send_reaction");
    };
  }, []);
  const { data } = useReactionQuery(roomId || "", message._id);

  const renderIcons = useMemo(() => {
    let renderIcons: string[] = [];
    data?.forEach((e) => {
      if (!renderIcons.includes(e.name)) {
        renderIcons.push(e.name);
      }
    });
    return renderIcons;
  }, [data]);

  return (
    <>
      {isShowUserReaction && (
        <DetailUserReact
          data={data}
          setIsShowUserReaction={setIsShowUserReaction}
        />
      )}
      <div
        className={cx("user-reaction-wrapper", { dark: theme })}
        onClick={() => setIsShowUserReaction(!isShowUserReaction)}
      >
        <ul>
          {renderIcons?.map((reaction, index) => {
            return (
              <li key={index}>
                <img src={getReactionEmoji(reaction)} alt="" />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default UserReacted;
