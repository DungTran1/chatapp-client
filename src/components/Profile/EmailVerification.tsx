import classnames from "classnames/bind";
import styles from "./ProfileComp.module.scss";
const cx = classnames.bind(styles);
const EmailVerification = () => {
  return (
    <div className={cx("verified")}>
      <h4>Your account is verified</h4>
    </div>
  );
};

export default EmailVerification;
