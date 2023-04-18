import { useState } from "react";
import { auth } from "../../shared/firebase";
import { convertErrorCodeToMessage } from "../../shared/utils";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import ModalNotification from "./ModalNotification";
import Loading from "../Common/Loading/Loading";
import styles from "./SignIn.module.scss";
import classnames from "classnames/bind";
import { post } from "../../service/axiosConfig";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getSignIn } from "../../reducer/AuthReducer";
import Title from "../Common/Title";
import { useActionQuery } from "../../service/Query/ActionQuery";
const cx = classnames.bind(styles);
type IFormInput = {
  username: string;
  password: string;
  email: string;
};
type SignUpWithProviderProps = {
  setChangeForm: React.Dispatch<React.SetStateAction<string>>;
};
const SignInWithProvider: React.FC<SignUpWithProviderProps> = ({
  setChangeForm,
}) => {
  const dispatch = useAppDispatch();
  const { resetRoom } = useActionQuery();
  const curUser = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true);
    if (!data.email.trim() || !data.password.trim() || !data.username.trim()) {
      return;
    }
    const user = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )
      .then((res) => res.user)
      .catch((error) => {
        setError(convertErrorCodeToMessage(error));
        console.log(convertErrorCodeToMessage(error));
      });
    if (user) {
      console.log(user);
      const userInfo = {
        _id: user.uid,
        photoURL: "",
        displayName: data.username,
        email: data.email,
      };
      await post("auth/signup", userInfo)
        .then((res) => {
          resetRoom(user.uid);
          return dispatch(getSignIn(userInfo));
        })
        .catch((error) => {
          setError(convertErrorCodeToMessage(error));
        })
        .finally(() => setIsLoading(false));
    }
  };
  return (
    <>
      <Title value={"Sign Up"} />
      {isLoading && <Loading />}
      {curUser && !isLoading && (
        <ModalNotification type="success" message="Sign in successfully" />
      )}
      {error && !isLoading && (
        <ModalNotification type="error" message={error} setError={setError} />
      )}
      <h4>Welcom to Chatroom</h4>
      <form onSubmit={handleSubmit(onSubmit)} className={cx("form")}>
        <div className={cx("username")}>
          <input
            type="text"
            placeholder="User Name"
            {...register("username", {
              required: true,
              maxLength: 20,
              minLength: 6,
            })}
          />
        </div>

        {errors?.username?.type === "minLength" ||
          (errors.username?.type === "maxLength" && (
            <p>Phải dài hơn 6 ký tự và ngắn hơn 20 ký tự</p>
          ))}
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
          <p>Bạn đã có tài khoản?</p>
          <nav onClick={() => setChangeForm("signin")}>Sign In</nav>
        </div>
        <div className={cx("submit")}>
          <input type="submit" value="Sign Up" />
        </div>
      </form>
    </>
  );
};

export default SignInWithProvider;
