import { toast, ToastOptions } from "react-toastify";
import { Socket } from "socket.io-client";

export const defaultPhoto = (name: string) => {
  return require(`../assets/image/${name}`);
};
export const getReactionEmoji = (name: string) => {
  return require(`../assets/image/emoji/${name}.png`);
};
// export const getRandomAvatar = (): string => {
//   const avatars = [
//     "https://i.ibb.co/8cZYmhn/catface.jpg",
//     "https://i.ibb.co/Qr5nS22/catface-5.jpg",
//     "https://i.ibb.co/nwwPfcG/catface-6.jpg",
//     "https://i.ibb.co/gR4G4Q9/catface-3.jpg",
//     "https://i.ibb.co/51ZQTGW/dogface-8.png",
//     "https://i.ibb.co/2gPWqs8/dogface-9.png",
//   ];

//   return avatars[Math.floor(Math.random() * avatars.length)];
// };
export const convertErrorCodeToMessage = (errorCode: string) => {
  if (errorCode === "auth/email-already-in-use")
    return "Your email is already in use.";
  else if (errorCode === "auth/user-not-found")
    return "Your email may be incorrect.";
  else if (errorCode === "auth/wrong-password")
    return "Your password is incorrect.";
  else if (errorCode === "auth/invalid-email") return "Your email is invalid";
  else if (errorCode === "auth/too-many-requests")
    return "You request too many times!";
  else return "Something weird happened.";
};
export const displayLastTimeUserChat = (time: Date) => {
  if (!time) return null;
  const unit = {
    năm: 12 * 30 * 7 * 24 * 60 * 60 * 1000,
    tháng: 30 * 7 * 24 * 60 * 60 * 1000,
    tuần: 7 * 24 * 60 * 60 * 1000,
    ngày: 24 * 60 * 60 * 1000,
    giờ: 60 * 60 * 1000,
  };
  let timeDisplay;
  const diff = new Date().getTime() - new Date(time).getTime();
  for (const key in unit) {
    if (diff > unit[key as keyof typeof unit]) {
      timeDisplay = `${Math.floor(
        diff / unit[key as keyof typeof unit]
      )} ${key}`;
      return timeDisplay;
    }
  }
  return "";
};

const POSITIONTOAST: ToastOptions = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
  progress: undefined,
};
export const toastMessage = (type: string, message: string) => {
  if (type === "error") {
    return toast[type](message, POSITIONTOAST);
  } else if (type === "success") {
    return toast[type](message, POSITIONTOAST);
  }
  return;
};
export const addSocketEventListener = (
  listEvent: Array<Array<string | Function>>,
  socket: Socket
) => {
  for (let i = 0; i < listEvent.length; i++) {
    socket.on(
      listEvent[i][0] as string,
      listEvent[i][1] as (...arg: any[]) => void
    );
  }
};
export const removeSocketEventListener = (
  listEvent: Array<Array<string | Function>>,
  socket: Socket
) => {
  for (let i = 0; i < listEvent.length; i++) {
    socket.removeListener(
      listEvent[i][0] as string,
      listEvent[i][1] as (...arg: any[]) => void
    );
  }
};
