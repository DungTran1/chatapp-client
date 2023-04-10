import { useAppSelector } from "../../store/hook";
import classnames from "classnames/bind";
import styles from "./Overlay.module.scss";
const cx = classnames.bind(styles);
interface OverlayProps {
  position: "absolute" | "fixed";
}
const Overlay: React.FC<OverlayProps> = ({ position }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div
      style={{ position }}
      className={cx({
        overlay: true,
        dark: theme,
      })}
    ></div>
  );
};

export default Overlay;
