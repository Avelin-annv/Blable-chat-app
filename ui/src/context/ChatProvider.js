import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const chatContext = createContext();

export const ChatState = () => {
  return useContext(chatContext);
};

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    var userData = localStorage.getItem("userInfo");

    if (userData !== "undefined") {
      userData = JSON.parse(userData);
      setUser(userData);
    }

    if (!userData) {
      navigate("/");
    }
  }, [location]);

  return (
    <chatContext.Provider value={{ user, setUser }}>
      {children}
    </chatContext.Provider>
  );
};
export default ChatProvider;
