import React from "react";
import { useAppSelector } from "../../store/hook";
import classnames from "classnames/bind";
import styles from "./ProfileComp.module.scss";
const cx = classnames.bind(styles);
interface EmailProps {}
const Email: React.FC<EmailProps> = ({}) => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className={cx("email")}>
      <h4>Email</h4>
      <div>
        <p>{user?.email}</p>
      </div>
    </div>
  );
};

export default React.memo(Email);
