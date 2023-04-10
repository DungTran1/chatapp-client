import React from "react";
import HeaderMainLayout from "./HeaderMainLayout";
import { useAppSelector } from "../store/hook";

import styles from "./MainLayout.module.scss";
import classnames from "classnames/bind";
import { ToastContainer } from "react-toastify";

import { Socket } from "socket.io-client";
import FormPopUp from "../components/FormPopUp/FormPopUp";
const cx = classnames.bind(styles);
interface LayoutProps {
  children: React.ReactNode;
  socket: Socket;
}
const Layout: React.FC<LayoutProps> = ({ children, socket }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("container", { dark: theme })}>
          <ToastContainer />
          <FormPopUp socket={socket} />
          <HeaderMainLayout />
          <div className={cx("children")}>{children}</div>
        </div>
      </div>
    </>
  );
};
export default Layout;
