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
import { useQuerySelector } from "../service/Query/querySelector";
import { useMediaQuery } from "react-responsive";

const cx = classnames.bind(styles);
interface HeaderMainLayoutProps {
  // navBar: string;
  // setNavBar: React.Dispatch<React.SetStateAction<string>>;
}
const HeaderMainLayout: React.FC<HeaderMainLayoutProps> = ({}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const { currentRoom } = useQuerySelector();
  const { roomId } = useParams();
  const isMobile = useMediaQuery({ maxWidth: "40em" });
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLLIElement>(null);
  const handleSignOut = () => {
    signOut(auth).then(() => {
      dispatch(signOutCur());
    });
  };
  const handleChangeTheme = () => {
    localStorage.setItem(
      "theme",
      ref.current?.id === "light" ? "dark" : "light"
    );

    dispatch(changeTheme());
  };
  return (
    <>
      {(!isMobile || (isMobile && !roomId)) && (
        <nav className="">
          <ul>
            <li
              onClick={handleChangeTheme}
              ref={ref}
              id={theme ? "dark" : "light"}
              value={theme ? "dark" : "light"}
            >
              {!theme && <BsMoonStarsFill size={25} color="#4c4c4c" />}
              {theme && <BsMoonStars size={25} color="#fff" />}
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
              <NavLink to={"/chat"}>
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
                  color={!theme ? "#4c4c4c" : "#a8a8ab"}
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
