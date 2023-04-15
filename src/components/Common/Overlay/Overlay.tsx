import { useAppSelector } from "../../../store/hook";
import classnames from "classnames/bind";
import styles from "./Overlay.module.scss";
const cx = classnames.bind(styles);
interface OverlayProps {
  isTheme?: boolean;
  position: "absolute" | "fixed";
}
const Overlay: React.FC<OverlayProps> = ({ position, isTheme = true }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div
      style={{ position }}
      className={cx({
        overlay: true,
        dark: theme,
        isTheme: isTheme,
      })}
    ></div>
  );
};

export default Overlay;
