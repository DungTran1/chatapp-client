import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { useEffect, useRef } from "react";

type ProtectedProps = {
  children: React.ReactNode;
};

const AuthProtect: React.FC<ProtectedProps> = ({ children }) => {
  const ref = useRef(0) as any;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    ref.current = setTimeout(() => {
      navigate(`/?p=${pathname}`);
    }, 4000);
    return () => clearTimeout(ref.current);
  }, []);
  useEffect(() => {
    if (currentUser) clearTimeout(ref.current);
  }, [currentUser]);

  return <>{children}</>;
};

export default AuthProtect;
