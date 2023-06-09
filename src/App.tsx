import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "firebase/compat/auth";
import { auth } from "./shared/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import io from "socket.io-client";
import "./App.scss";
import "./scss/Grid.scss";
import Login from "./pages/Login/Login";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { getSignIn } from "./reducer/AuthReducer";
import AuthProtect from "./components/AuthProtect/AuthProtect";
import MainLayout from "./Layout/MainLayout";
import Profile from "./pages/Profile/Profile";

import { getUserOnline } from "./reducer/ChatReducer";
import Chat from "./pages/Chat/Chat";
import JoinLink from "./pages/JoinLink/JoinLink";
import Message from "./components/Message/Message";
import NotFound from "./components/NotFound/NotFound";
import { signIn } from "./service/api";
import OfflineNetwork from "./components/Common/Loading/OfflineNetwork";
import { addSocketEventListener } from "./shared/utils";

const socket = io(process.env.REACT_APP_API_URL as string);

const App = () => {
  const dispatch = useAppDispatch();
  const curUser = useAppSelector((state) => state.auth.user);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("not logged");
        return;
      } else {
        if (!curUser) {
          const res = await signIn(user.uid);
          dispatch(getSignIn(res));
        }
      }
    });
    return () => {
      unregisterAuthObserver();
    }; // Make sure we un-register Firebase observers when the component unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      socket.connect();
    };
    const handleOffline = () => {
      setIsOnline(false);
      socket.disconnect();
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  useEffect(() => {
    const connected = () => {
      console.log("connected");
    };
    const receiveUserOnline = (data: { userOnline: string[] }) => {
      dispatch(getUserOnline(data.userOnline));
    };
    const listEvent = [
      ["receive_user_online", receiveUserOnline],
      ["connected", connected],
    ];
    addSocketEventListener(listEvent, socket);
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);
  if (navigator.onLine === true && curUser) {
    socket.emit("user_online", { userId: curUser?._id });
  }

  return (
    <>
      {!isOnline && <OfflineNetwork />}

      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ToastContainer />
                <Login />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthProtect>
                <MainLayout socket={socket}>
                  <Profile />
                </MainLayout>
              </AuthProtect>
            }
          />
          <Route
            path="/chat"
            element={
              <AuthProtect>
                <MainLayout socket={socket}>
                  <Chat socket={socket} />
                </MainLayout>
              </AuthProtect>
            }
          >
            <Route path=":roomId" element={<Message socket={socket} />} />
          </Route>

          <Route
            path="/r/:roomId"
            element={
              <AuthProtect>
                <JoinLink socket={socket} />
              </AuthProtect>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
