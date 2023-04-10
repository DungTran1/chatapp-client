import { useAppSelector } from "../../../../store/hook";
import { Comment, LineWave } from "react-loader-spinner";

import classnames from "classnames/bind";
import styles from "./MessageTyping.module.scss";
import { LazyLoadImage } from "react-lazy-load-image-component";
const cx = classnames.bind(styles);
const MessageTyping = () => {
  const { usersTyping } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
      {usersTyping.length > 0 &&
        !usersTyping.some((e) => e.user._id === user?._id) &&
        usersTyping.map((userTyping) => {
          return (
            <div
              key={userTyping.user._id}
              className={cx({
                typing: true,
                "display-typing": userTyping.user._id !== user?._id,
              })}
            >
              <LazyLoadImage
                effect="blur"
                width={40}
                height={40}
                src={userTyping.user.photoURL}
                alt=""
              />

              <Comment
                visible={true}
                height="40"
                width="40"
                ariaLabel="comment-loading"
                wrapperStyle={{}}
                wrapperClass="comment-wrapper"
                color="#fff"
                backgroundColor="#F4442E"
              />
            </div>
          );
        })}
    </>
  );
};

export default MessageTyping;
