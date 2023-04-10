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
import { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./store/hook";
import { getSignIn } from "./reducer/AuthReducer";
import AuthProtect from "./components/AuthProtect/AuthProtect";
import MainLayout from "./Layout/MainLayout";
import Profile from "./pages/Profile/Profile";

import { getUserOnline, updateUsersTyping } from "./reducer/ChatReducer";
import { Room, User, UserInRoom } from "./shared/type";
import Chat from "./pages/Chat/Chat";
import { get } from "./service/axiosConfig";
import JoinLink from "./pages/JoinLink/JoinLink";
import { useCurrentRoomQuery } from "./service/Query/UseQuery";
import Message from "./components/Message/Message";
import { useActionQuery } from "./service/Query/ActionQuery";

const socket = io("http://localhost:8000");

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data, isSuccess } = useCurrentRoomQuery();

  if (data) {
    socket.emit("connect_to_room", { newRoom: data._id });
  }

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("not logged");
        return;
      } else {
        dispatch(getSignIn(user));
      }
    });
    return () => {
      unregisterAuthObserver();
    }; // Make sure we un-register Firebase observers when the component unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(()=>{
  //   const handleOffline=()=>{

  //   }
  //   window.addEventListener("offline",handleOffline)
  // },[])
  useEffect(() => {
    socket.on("receive_user_online", (data: { userOnline: string[] }) => {
      dispatch(getUserOnline(data.userOnline));
    });
  }, []);
  if (navigator.onLine === true) {
    socket.emit("user_online", { userId: user?._id });
  } else {
    socket.disconnect();
  }

  return (
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
          path="/p/:roomId"
          element={
            <AuthProtect>
              <JoinLink socket={socket} />
            </AuthProtect>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
