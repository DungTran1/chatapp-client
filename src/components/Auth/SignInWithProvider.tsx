import { useState } from "react";
import { auth } from "../../shared/firebase";
import { convertErrorCodeToMessage } from "../../shared/utils";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import ModalNotification from "./ModalNotification";
import Loading from "../Common/Loading/Loading";

import styles from "./SignIn.module.scss";
import classnames from "classnames/bind";
import { useAppSelector } from "../../store/hook";
import Title from "../Common/Title";
import { FirebaseError } from "firebase/app";
const cx = classnames.bind(styles);
type IFormInput = {
  username: string;
  password: string;
  email: string;
};
type SignInWithProviderProps = {
  setChangeForm: React.Dispatch<React.SetStateAction<string>>;
};
const SignInWithProvider: React.FC<SignInWithProviderProps> = ({
  setChangeForm,
}) => {
  const curUser = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit = async (data: IFormInput) => {
    if (!data.email.trim() || !data.password.trim()) {
      return;
    }
    setIsLoading(true);
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {})
      .catch((error: FirebaseError) => {
        setError(convertErrorCodeToMessage(error.code));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Title value={"Sign In"} />
      {curUser && !isLoading && (
        <ModalNotification type="success" message="Sign in successfully" />
      )}
      {isLoading && <Loading />}
      {error && (
        <ModalNotification type="error" message={error} setError={setError} />
      )}
      <h4>Welcom to Chatroom</h4>

      <form onSubmit={handleSubmit(onSubmit)} className={cx("form")}>
        <div className={cx("email")}>
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: true,
            })}
          />
        </div>
        <div className={cx("password")}>
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: true,
              minLength: 6,
            })}
          />
        </div>
        {errors?.password?.type === "minLength" && <p>Phải dài hơn 6 ký tự</p>}
        <div className={cx("navigate")}>
          <span>Bạn chưa có tài khoản?</span>
          <nav onClick={() => setChangeForm("signup")}>Sign Up</nav>
        </div>
        <div className={cx("submit")}>
          <input type="submit" value="Sign In" />
        </div>
      </form>
    </>
  );
};

export default SignInWithProvider;
