import { useState } from "react";
import SignInWithProvider from "../../components/Auth/SignInWithProvider";
import SignUpWithProvider from "../../components/Auth/SignUpWithProvider";
import styles from "./Login.module.scss";
import classnames from "classnames/bind";
import Astronaut from "../../assets/image/astronaut.svg";
import Spaceship from "../../assets/image/spaceship.svg";
const cx = classnames.bind(styles);
const Home = () => {
  const [changeForm, setChangeForm] = useState("signin");

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        {changeForm === "signin" && (
          <SignInWithProvider setChangeForm={setChangeForm} />
        )}
        {changeForm === "signup" && (
          <SignUpWithProvider setChangeForm={setChangeForm} />
        )}
      </div>
      <div className={cx("mars")}></div>
      <img src={Astronaut} className={cx("astronaut")} alt="" />
      <img src={Spaceship} className={cx("spaceship")} alt="" />
    </div>
  );
};

export default Home;
