import React from "react";
import HeaderMainLayout from "./HeaderMainLayout";
import { useAppSelector } from "../store/hook";

import styles from "./MainLayout.module.scss";
import classnames from "classnames/bind";
import { ToastContainer } from "react-toastify";

import { Socket } from "socket.io-client";
import FormPopUp from "../components/FormPopUp/FormPopUp";
const cx = classnames.bind(styles);
type LayoutProps = {
  children: React.ReactNode;
  socket: Socket;
};
const Layout: React.FC<LayoutProps> = ({ children, socket }) => {
  const darkTheme = useAppSelector((state) => state.theme.darkTheme);

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("container", { dark: darkTheme })}>
          <ToastContainer />
          <FormPopUp socket={socket} />
          <HeaderMainLayout socket={socket} />
          <div className={cx("children")}>{children}</div>
        </div>
      </div>
    </>
  );
};
export default Layout;
