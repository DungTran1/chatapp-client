import { MdAccountCircle, MdGroups } from "react-icons/md";
import { BiLogOutCircle } from "react-icons/bi";
import { signOut } from "@firebase/auth";
import { auth } from "../shared/firebase";
import { NavLink, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { signOutCur } from "../reducer/AuthReducer";
import { BsMoonStars, BsMoonStarsFill } from "react-icons/bs";
import { changeTheme } from "../reducer/ThemeReducer";
import styles from "./MainLayout.module.scss";
import classnames from "classnames/bind";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useQuerySelector } from "../service/Query/querySelector";

const cx = classnames.bind(styles);
type HeaderMainLayoutProps = {};
const HeaderMainLayout: React.FC<HeaderMainLayoutProps> = ({}) => {
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);
  const { currentRoom } = useQuerySelector();
  const { roomId } = useParams();
  const isTablet = useMediaQuery({ maxWidth: "46.25em" });
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLLIElement>(null);
  const handleSignOut = () => {
    signOut(auth).then(() => {
      dispatch(signOutCur());
    });
  };
  const handleChangeTheme = () => {
    localStorage.setItem(
      "darkTheme",
      ref.current?.id === "light" ? "dark" : "light"
    );

    dispatch(changeTheme());
  };
  return (
    <>
      {(!isTablet || (isTablet && !roomId)) && (
        <nav className={cx("navbar")}>
          <ul>
            <li
              onClick={handleChangeTheme}
              ref={ref}
              id={darkTheme ? "dark" : "light"}
              value={darkTheme ? "dark" : "light"}
            >
              {!darkTheme && <BsMoonStarsFill size={25} color="#4c4c4c" />}
              {darkTheme && <BsMoonStars size={25} color="#fff" />}
            </li>
            <li>
              <NavLink to="/profile">
                {({ isActive }) => {
                  return (
                    <MdAccountCircle
                      size={30}
                      color={(isActive && "#647fd7") || "#a8a8ab"}
                    />
                  );
                }}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={currentRoom?._id ? `/chat/${currentRoom._id}` : "/chat"}
              >
                {({ isActive }) => (
                  <MdGroups
                    size={30}
                    color={(isActive && "#647fd7") || "#a8a8ab"}
                  />
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to="/" onClick={handleSignOut}>
                <BiLogOutCircle
                  size={30}
                  color={!darkTheme ? "#4c4c4c" : "#a8a8ab"}
                />
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default HeaderMainLayout;
