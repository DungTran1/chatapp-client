import { useAppSelector } from "../../../store/hook";
import classnames from "classnames/bind";
import styles from "./Overlay.module.scss";
const cx = classnames.bind(styles);
type OverlayProps = {
  isNoTheme?: boolean;
  position: "absolute" | "fixed";
};
const Overlay: React.FC<OverlayProps> = ({ position, isNoTheme = false }) => {
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  return (
    <div
      style={{ position }}
      className={cx({
        overlay: true,
        dark: darkTheme,
        isNoTheme: isNoTheme,
      })}
    ></div>
  );
};

export default Overlay;
