import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import SignInWithProvider from "../../components/Auth/SignInWithProvider";
import SignUpWithProvider from "../../components/Auth/SignUpWithProvider";
import styles from "./Login.module.scss";
import classnames from "classnames/bind";

const cx = classnames.bind(styles);
const Home = () => {
  const [changeForm, setChangeForm] = useState("signin");
  const curUser = useAppSelector((state) => state.auth.user);

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
      <video autoPlay muted loop id="myVideo" className={cx("background")}>
        <source
          src="https://giant.gfycat.com/FloweryPastelAsianpiedstarling.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default Home;
