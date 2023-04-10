import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../store/hook";
import { useEffect } from "react";

interface ProtectedProps {
  children: React.ReactNode;
}

const AuthProtect: React.FC<ProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (!currentUser) navigate("/");
  }, []);
  return <>{children}</>;
};

export default AuthProtect;
