import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const chatContext = createContext();

export const ChatState = () => {
  return useContext(chatContext);
};

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chatsList, setChatsList] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    var userData = localStorage.getItem("userInfo");

    if (userData !== "undefined") {
      userData = JSON.parse(userData);
      //warning here
      setUser(userData);
    }

    if (!userData) {
      navigate("/");
    }
  }, [location]);

  return (
    <chatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chatsList,
        setChatsList,
        notification,
        setNotification,
      }}
    >
      {children}
    </chatContext.Provider>
  );
};
export default ChatProvider;
