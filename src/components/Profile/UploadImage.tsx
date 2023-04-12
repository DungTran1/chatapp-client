import { useState } from "react";
import { useDispatch } from "react-redux";

import axios from "axios";

import { updateProfile } from "firebase/auth";

import { auth } from "../../shared/firebase";

import { useAppSelector } from "../../store/hook";

import { HiOutlineUpload } from "react-icons/hi";

import { updateAvatar } from "../../reducer/AuthReducer";

import Loading from "../Common/Loading/Loading";
import { post } from "../../service/axiosConfig";
import { uploadImage } from "../../service/saveImage";

const ProfileImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;
  const user = useAppSelector((state) => state.auth.user);
  const changeProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files?.length) {
        return;
      }
      setIsLoading(true);
      const result = await uploadImage(e.target.files[0]);
      if (result) {
        if (currentUser) {
          updateProfile(currentUser, {
            photoURL: result,
          })
            .then(() => {
              post("auth/updateProfile", {
                uid: currentUser.uid,
                photoURL: result,
              }).then((res) => {
                console.log(res);
                dispatch(updateAvatar(result));
                setIsLoading(false);
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <h4>Profile photo</h4>
      <div>
        <div>
          <img src={user?.photoURL} alt="" />
        </div>
        <label htmlFor="upload-img">
          <HiOutlineUpload color="rgb(81 121 255)" />
          <span>Upload new photo </span>
        </label>
        <input
          hidden
          id="upload-img"
          type="file"
          accept="image/*"
          onChange={changeProfileImage}
        />
      </div>
    </>
  );
};

export default ProfileImage;
