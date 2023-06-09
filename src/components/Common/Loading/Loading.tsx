import { BallTriangle } from "react-loader-spinner";
import Overlay from "../Overlay/Overlay";
type LoadingType = {};
const Loading: React.FC<LoadingType> = ({}) => {
  return (
    <>
      <BallTriangle
        height="100"
        width="100"
        color="#4fa94d"
        radius={5}
        wrapperStyle={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: "9999",
        }}
        visible={true}
        ariaLabel="ball-triangle-loading"
        // wrapperClass={cx("progress-bar-wrapper")}
      />
      <Overlay position="fixed" />
    </>
  );
};

export default Loading;
