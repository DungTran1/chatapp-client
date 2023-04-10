import classnames from "classnames/bind";
import styles from "./ProfileComp.module.scss";
const cx = classnames.bind(styles);

interface Props {
  isShowPromptReAuthFor: string | undefined;
  oldPasswordValueRef: any;
  reAuthentication: any;
}
const ComfirmPassword: React.FC<Props> = ({
  isShowPromptReAuthFor,
  oldPasswordValueRef,
  reAuthentication,
}) => {
  return (
    <>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          reAuthentication(isShowPromptReAuthFor);
        }}
        className={cx("update__password")}
      >
        <p className="">Type your old password again to reauthenticate</p>
        <input
          ref={oldPasswordValueRef}
          type="password"
          autoFocus
          className=""
          placeholder="Type your old password..."
        />
        <button className="">Continue</button>
      </form>
      <div className={cx("overlay")}></div>
    </>
  );
};

export default ComfirmPassword;
