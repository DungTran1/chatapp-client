import classnames from "classnames/bind";
import styles from "./NotFound.module.scss";
import { Link } from "react-router-dom";
import Astronaut from "../../assets/image/astronaut.svg";
import FourZeroFour from "../../assets/image/404.svg";
import Meteor from "../../assets/image/meteor.svg";
import Spaceship from "../../assets/image/spaceship.svg";
const cx = classnames.bind(styles);
const NotFound = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("mars")}></div>
      <img src={FourZeroFour} className={cx("logo-404")} alt="" />
      <img src={Meteor} className={cx("meteor")} alt="" />
      <p className={cx("title")}>Oh no!!</p>
      <p className={cx("subtitle")}>
        Đường dẫn không hợp lệ <br /> hoặc yêu cầu trang không còn nữa.
      </p>
      <div className={cx("back")}>
        <Link className={cx("btn-back")} to="/chat">
          Trở về
        </Link>
      </div>
      <img src={Astronaut} className={cx("astronaut")} alt="" />
      <img src={Spaceship} className={cx("spaceship")} alt="" />
    </div>
  );
};

export default NotFound;
