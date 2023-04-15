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
        You’re either misspelling the URL <br /> or requesting a page that's no
        longer here.
      </p>
      <div className={cx("back")}>
        <Link className={cx("btn-back")} to="/chat">
          Back to previous page
        </Link>
      </div>
      <img src={Astronaut} className={cx("astronaut")} alt="" />
      <img src={Spaceship} className={cx("spaceship")} alt="" />
    </div>
  );
};

export default NotFound;
