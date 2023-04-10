import { toast } from "react-toastify";
import { useAppSelector } from "../../store/hook";
import { AiOutlineEdit } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import classnames from "classnames/bind";
import styles from "./ProfileComp.module.scss";
const cx = classnames.bind(styles);
interface NameProps {
  setIsShowPromptReAuthFor: any;
  setIsRetypedPassword: any;
  displayNameValueRef: any;
}
const Name: React.FC<NameProps> = ({
  setIsShowPromptReAuthFor,
  setIsRetypedPassword,
  displayNameValueRef,
}) => {
  const user = useAppSelector((state) => state.auth.user);
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div className={cx("name")}>
      <h4>Name</h4>
      {
        <>
          <form className={cx({ dark: theme })}>
            <input
              type="text"
              ref={displayNameValueRef}
              defaultValue={user?.displayName || ""}
              autoFocus
              className=""
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!displayNameValueRef.current.value.trim().length) {
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
                setIsShowPromptReAuthFor("name");
              }}
              className=""
            >
              <BiSend size={25} color={theme ? "#dddddd" : ""} />
            </button>
          </form>
        </>
      }
    </div>
  );
};

export default Name;
