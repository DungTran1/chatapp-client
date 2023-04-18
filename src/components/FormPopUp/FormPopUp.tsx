import { useAppSelector } from "../../store/hook";
import CreateRoomOrAddUser from "./CreateRoomOrAddUser/CreateRoomOrAddUser";
import { Socket } from "socket.io-client";
import Overlay from "../Common/Overlay/Overlay";
import MediaSection from "../MediaFile/MediaFile";
import ChangeNickName from "./ChangeNickName/ChangeNickName";
import ChangeChatRoomName from "./ChangeChatRoomName/ChangeChatRoomName";
import { useQuerySelector } from "../../service/Query/querySelector";
type FormPopUpProps = {
  socket: Socket;
};
const FormPopUp: React.FC<FormPopUpProps> = ({ socket }) => {
  const { formPopUp } = useAppSelector((state) => state.chat);
  const { currentRoom } = useQuerySelector();
  return (
    <>
      {formPopUp === "AddUserToGroupChat" && (
        <>
          <CreateRoomOrAddUser
            type="AddUserToGroupChat"
            socket={socket}
            usersInCurrentRoom={currentRoom?.users}
          />
          <Overlay position="absolute" />
        </>
      )}
      {formPopUp === "CreateGroupChat" && (
        <>
          <CreateRoomOrAddUser type="CreateGroupChat" socket={socket} />
          <Overlay position="absolute" />
        </>
      )}
      {formPopUp === "ChangeNickName" && <ChangeNickName socket={socket} />}
      {formPopUp === "ChangeRoomName" && <ChangeChatRoomName socket={socket} />}
      {formPopUp === "WatchMediaFile" && <MediaSection />}
    </>
  );
};

export default FormPopUp;
