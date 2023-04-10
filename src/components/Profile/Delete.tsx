import classnames from "classnames/bind";
import styles from "./ProfileComp.module.scss";
const cx = classnames.bind(styles);
interface DeletedProps {
  isDeleted: boolean;
  setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRetypedPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowPromptReAuthFor: any;
}
const Delete: React.FC<DeletedProps> = ({
  setIsDeleted,
  isDeleted,
  setIsRetypedPassword,
  setIsShowPromptReAuthFor,
}) => {
  return (
    <>
      <div className={cx("delete__btn")}>
        <button onClick={() => setIsDeleted(true)}>Delete Account</button>
      </div>
      {isDeleted && (
        <>
          <div className={cx("confirm_delete")}>
            <h5> Are you sure you want to delete this account?</h5>
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleted(false);
                  setIsRetypedPassword(true);
                  setIsShowPromptReAuthFor("delete");
                }}
              >
                Yes
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleted(false);
                  setIsRetypedPassword(false);
                }}
              >
                No
              </button>
            </div>
          </div>
          <div className={cx("overlay")}></div>
        </>
      )}
    </>
  );
};

export default Delete;
