import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { defaultPhoto } from "../../shared/utils";
import { Socket } from "socket.io-client";
import Loading from "../../components/Loading/Loading";
import { useUserJoinLink } from "../../service/Query/UseQuery";

import classnames from "classnames/bind";
import styles from "./JoinLink.module.scss";
const cx = classnames.bind(styles);

interface JoinLinkProps {
  socket: Socket;
}
const JoinLink: React.FC<JoinLinkProps> = ({ socket }) => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { roomId } = useParams();
  const { data, isLoading } = useUserJoinLink(roomId || "");

  const userExist = data?.userExist;
  const isAcceptLink = data?.isAcceptLink;
  const handleJoinRoom = () => {
    socket.emit("join_room_with_link", {
      userJoin: user,
      roomId,
    });
    navigate(`/chat/${roomId}`);
  };
  if (isLoading) return <Loading />;
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("photo")}>
          <img
            src={defaultPhoto(
              userExist || (!userExist && isAcceptLink)
                ? "user.png"
                : "errorJoinLink.png"
            )}
            alt=""
          />
        </div>
        <div className={cx("content")}>
          <div className={cx("status")}>
            {!userExist ? (
              !isAcceptLink ? (
                <div>
                  <h5>
                    "😵‍💫 Oops! Bạn không được cấp quyền tham gia phòng chat này"
                  </h5>
                  <p>
                    Liên hệ với quản trị viên phòng chat để bật chức năng này:
                  </p>
                </div>
              ) : (
                "Bạn có thể tham gia phòng chat"
              )
            ) : (
              "Bạn đã tham gia phòng chat"
            )}
          </div>
          {(userExist || (!userExist && isAcceptLink)) && (
            <>
              <button className={cx("join-btn")} onClick={handleJoinRoom}>
                Vào phòng chat
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinLink;
