import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
  updateProfile,
} from "firebase/auth";

import { auth } from "../../shared/firebase";
import { convertErrorCodeToMessage, toastMessage } from "../../shared/utils";
import { useAppDispatch, useAppSelector } from "../../store/hook";

import { updateDisplayName, signOutCur } from "../../reducer/AuthReducer";

import ProfileImage from "../../components/Profile/UploadImage";
import Name from "../../components/Profile/Name";
import EmailVerification from "../../components/Profile/EmailVerification";
import Password from "../../components/Profile/Password";
import Delete from "../../components/Profile/Delete";
import Email from "../../components/Profile/Email";
import ConfirmPassword from "../../components/Profile/ConfirmPassword";
import { post } from "../../service/axiosConfig";

import classnames from "classnames/bind";
import styles from "./Profile.module.scss";
const cx = classnames.bind(styles);

const Profile = () => {
  const navigate = useNavigate();
  const isTabletMobile = useMediaQuery({ query: "(max-width:64em)" });
  const firebaseUser = auth.currentUser;
  const user = useAppSelector((state) => state.auth.user);
  const [isUpdatedPassword, setIsUpdatedPassword] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isShowPromptReAuthFor, setIsShowPromptReAuthFor] = useState<
    string | undefined
  >();
  const [isRetypedPassword, setIsRetypedPassword] = useState(false);
  const dispatch = useAppDispatch();
  const oldPasswordValueRef = useRef<HTMLInputElement>(null!);
  const newPasswordValueRef = useRef<HTMLInputElement>(null!);

  const displayNameValueRef = useRef<HTMLInputElement>(null!);
  useEffect(() => {
    const clickOutside = (e: any) => {
      setIsRetypedPassword(false);
    };
    window.addEventListener("click", clickOutside);
    return () => window.removeEventListener("click", clickOutside);
  }, []);

  const reAuthentication = async (type: string) => {
    const oldPassword = oldPasswordValueRef.current.value;
    if (!oldPassword.trim().length) {
      toastMessage("error", "You must type something!");
      return;
    }

    const credential = EmailAuthProvider.credential(
      // @ts-ignore
      currentUser.email,
      oldPassword
    );

    reauthenticateWithCredential(
      // @ts-ignore
      firebaseUser,
      credential
    )
      .then(() => {
        if (type === "password") {
          changePassword();
        } else if (type === "delete") {
          deleteAccount();
        } else if (type === "name") {
          changeName();
        }
      })
      .catch((error) => {
        toastMessage("error", convertErrorCodeToMessage(error.code));
      });
  };
  const changeName = async () => {
    const newDisplayName = displayNameValueRef.current.value;

    if (!newDisplayName.trim().length) {
      toastMessage("error", "You gotta type something");
      return;
    }
    if (firebaseUser) {
      updateProfile(firebaseUser, {
        displayName: newDisplayName,
      })
        .then(() => {
          post("auth/updateProfile", {
            uid: user?._id,
            displayName: newDisplayName,
          }).then(() => {
            toastMessage("success", "Change name successfully");
            dispatch(updateDisplayName(newDisplayName));
          });
        })
        .catch((error: any) =>
          toastMessage("error", convertErrorCodeToMessage(error.code))
        )
        .finally(() => {
          setIsRetypedPassword(false);
        });
    }
  };
  const changePassword = () => {
    const newPassword = newPasswordValueRef.current.value;
    if (!newPassword.trim().length) {
      toastMessage("error", "You gotta type something");
      return;
    }
    // @ts-ignore
    updatePassword(firebaseUser, newPassword)
      .then(async () => {
        toastMessage("success", "Change password successfully");
        newPasswordValueRef.current.value = "";
      })
      .catch((error: any) => {
        toastMessage("error", convertErrorCodeToMessage(error.code));
      })
      .finally(() => {
        setIsRetypedPassword(false);
        setIsUpdatedPassword(false);
      });
  };
  const deleteAccount = () => {
    // @ts-ignore
    deleteUser(firebaseUser)
      .then(() => {
        toastMessage("success", "Delete successfully");
        dispatch(signOutCur());
        navigate("/");
      })
      .catch((error: any) => {
        toastMessage("error", convertErrorCodeToMessage(error.code));
      });
  };

  return (
    <div className={cx("profile")}>
      <h1>ACCOUNT SETTINGS</h1>
      <div className={`${cx("information")} row`}>
        <div className={`${cx("user__info")} l-8 md-12 sm-12`}>
          {isTabletMobile && (
            <div className={cx("profile__photo")}>
              <ProfileImage />
            </div>
          )}
          <Email />
          <Name
            displayNameValueRef={displayNameValueRef}
            setIsRetypedPassword={setIsRetypedPassword}
            setIsShowPromptReAuthFor={setIsShowPromptReAuthFor}
          />
          <EmailVerification />
          <Password
            isUpdatedPassword={isUpdatedPassword}
            setIsUpdatedPassword={setIsUpdatedPassword}
            setIsRetypedPassword={setIsRetypedPassword}
            setIsShowPromptReAuthFor={setIsShowPromptReAuthFor}
            newPasswordValueRef={newPasswordValueRef}
          />
          <Delete
            isDeleted={isDeleted}
            setIsDeleted={setIsDeleted}
            setIsRetypedPassword={setIsRetypedPassword}
            setIsShowPromptReAuthFor={setIsShowPromptReAuthFor}
          />
        </div>
        {!isTabletMobile && (
          <div className={`${cx("profile__photo")} l-4 md-12 sm-12`}>
            <ProfileImage />
          </div>
        )}
      </div>
      {isRetypedPassword && (
        <ConfirmPassword
          isShowPromptReAuthFor={isShowPromptReAuthFor}
          oldPasswordValueRef={oldPasswordValueRef}
          reAuthentication={reAuthentication}
        />
      )}
    </div>
  );
};

export default Profile;
