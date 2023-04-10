import { useState } from "react";
import { auth } from "../../shared/firebase";
import { convertErrorCodeToMessage, getRandomAvatar } from "../../shared/utils";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import ModalNotification from "./ModalNotification";
import Loading from "../Loading/Loading";
import styles from "./SignIn.module.scss";
import classnames from "classnames/bind";
import { post } from "../../service/axiosConfig";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { getSignIn } from "../../reducer/AuthReducer";
const cx = classnames.bind(styles);
interface IFormInput {
  username: string;
  password: string;
  email: string;
}
interface SignUpWithProviderProps {
  setChangeForm: React.Dispatch<React.SetStateAction<string>>;
}
const SignInWithProvider: React.FC<SignUpWithProviderProps> = ({
  setChangeForm,
}) => {
  const dispatch = useAppDispatch();
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
      const photoRandom = getRandomAvatar();
      updateProfile(user, {
        photoURL: photoRandom,
        displayName: data.username,
      })
        .then(async () => {
          await post("auth/signup", {
            uid: user.uid,
            photoURL: photoRandom,
            displayName: data.username,
            email: data.email,
          });
          dispatch(
            getSignIn({
              ...user,
              photoURL: photoRandom,
              displayName: data.username,
            })
          );
        })
        .catch((error) => {
          setError(convertErrorCodeToMessage(error));
        })
        .finally(() => setIsLoading(false));
    }
  };
  return (
    <>
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
            <p>no more than 20 characters or less than 6 characters</p>
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
        {errors?.password?.type === "minLength" && (
          <p>Must be more than 6 characters</p>
        )}
        <div className={cx("navigate")}>
          <p>Do you already have an account?</p>
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
