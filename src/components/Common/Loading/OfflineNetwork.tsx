import { Bars } from "react-loader-spinner";
import Overlay from "../Overlay/Overlay";
import { useAppSelector } from "../../../store/hook";

const OfflineNetwork = () => {
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  return (
    <>
      <Bars
        height="100"
        width="100"
        color="#4fa94d"
        wrapperStyle={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: "9999",
        }}
        visible={true}
        ariaLabel="bars-loading"
        // wrapperClass={cx("progress-bar-wrapper")}
      />
      <h3
        style={{
          position: "absolute",
          top: " 15%",
          left: " 50%",
          transform: "translate(-50%)",
          width: "80%",
          zIndex: "99999",
          color: "red",
          fontSize: "2.8rem",
        }}
      >
        Mạng không ổn định
      </h3>
      <Overlay position="fixed" />
    </>
  );
};

export default OfflineNetwork;
