import { toast } from "react-toastify";
import classnames from "classnames/bind";
import styles from "./ProfileComp.module.scss";
import React from "react";
import { useAppSelector } from "../../store/hook";
const cx = classnames.bind(styles);

type PasswordProps = {
  isUpdatedPassword: boolean;
  setIsUpdatedPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRetypedPassword: any;
  setIsShowPromptReAuthFor: any;
  newPasswordValueRef: any;
};
const Password: React.FC<PasswordProps> = ({
  isUpdatedPassword,
  setIsUpdatedPassword,
  setIsRetypedPassword,
  setIsShowPromptReAuthFor,
  newPasswordValueRef,
}) => {
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  return (
    <div className={cx("change__password")}>
      <h4>Change Password</h4>
      {isUpdatedPassword && (
        <>
          <div>
            <p>Updating password successfully</p>
            <button onClick={() => setIsUpdatedPassword(false)}>OK</button>
          </div>
          <div onClick={() => setIsUpdatedPassword(false)}></div>
        </>
      )}
      <div>
        <form
          className={cx({ dark: darkTheme })}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!newPasswordValueRef.current.value.trim().length) {
              // alert();
              toast.error("You gotta type something", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              return;
            }
            setIsRetypedPassword(true);
            setIsShowPromptReAuthFor("password");
          }}
        >
          <input
            placeholder="New Password"
            ref={newPasswordValueRef}
            type="password"
          />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(Password);
