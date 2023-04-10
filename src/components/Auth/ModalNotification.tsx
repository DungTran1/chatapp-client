import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import classnames from "classnames/bind";
import styles from "./SignIn.module.scss";
import { useAppSelector } from "../../store/hook";
import { useQuerySelector } from "../../service/Query/querySelector";

const cx = classnames.bind(styles);

interface ModalNotificationProps {
  type: string;
  message: string;
  setError?: any;
}
const TIMEOUT_AUTO_CLOSE_ERROR = 5;
const TIMEOUT_AUTO_CLOSE_SUCCESS = 2;
const ModalNotification: React.FC<ModalNotificationProps> = ({
  type,
  message,
  setError,
}) => {
  const [timeLeft, setTimeLeft] = useState(
    type === "success" ? TIMEOUT_AUTO_CLOSE_SUCCESS : TIMEOUT_AUTO_CLOSE_ERROR
  );
  const navigate = useNavigate();

  const isCloseModalAutomatically = timeLeft === 0;

  useEffect(() => {
    if (isCloseModalAutomatically) {
      if (type === "success") {
        navigate("/chat");
      } else {
        setError("");
      }
    }
    // eslint-disable-next-line
  }, [isCloseModalAutomatically]);

  useEffect(() => {
    const timeout = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timeout); // => so when "error" is set empty, the component unmount, this interval timer is clear
    // eslint-disable-next-line
  }, []);
  // if (currentUser) return <Navigate to="/" replace />;
  return (
    <div className={cx("noti__login__status")}>
      <div className={cx("noti")}>
        <div>
          <h2>
            {(type === "error" && "Oh No!") ||
              (type === "success" && "Oh Yeah!")}
          </h2>
          {type === "error" && <p>{message}</p>}
          {type === "success" && <p>Successfully logged.</p>}
          <button
            style={{
              backgroundColor: `${type === "success" ? "blue" : "red"}`,
            }}
            onClick={() => {
              if (type === "success") {
                navigate("/chat");
              } else {
                setError("");
              }
            }}
          >
            <span>
              {(type === "error" && "TRY AGAIN") ||
                (type === "success" && "CONTINUE")}
            </span>
            <i> ({timeLeft})</i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNotification;