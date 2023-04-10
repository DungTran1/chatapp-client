import { useAppSelector } from "../../store/hook";
import AddUserToRoomForm from "./CreateRoomOrAddUser/AddUserToRoomForm";
import { Socket } from "socket.io-client";
import Overlay from "../Overlay/Overlay";
import MediaSection from "../Media/Media";
import ChangeNickName from "./ChangeNickName/ChangeNickName";
import ChangeChatRoomName from "./ChangeChatRoomName/ChangeChatRoomName";
import { useQuerySelector } from "../../service/Query/querySelector";
interface FormPopUpProps {
  socket: Socket;
}
const FormPopUp: React.FC<FormPopUpProps> = ({ socket }) => {
  const { formPopUp } = useAppSelector((state) => state.chat);
  const { currentRoom } = useQuerySelector();
  return (
    <>
      {formPopUp === "AddUserToGroupChat" && (
        <>
          <AddUserToRoomForm
            type="AddUserToGroupChat"
            socket={socket}
            usersInCurrentRoom={currentRoom?.users}
          />
          <Overlay position="absolute" />
        </>
      )}
      {formPopUp === "CreateGroupChat" && (
        <>
          <AddUserToRoomForm type="CreateGroupChat" socket={socket} />
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
