import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import SideBar from "../components/SideBar";
import { Box } from "@chakra-ui/react";
import ChatsList from "../components/ChatsList";
import MessageBox from "../components/MessageBox";
const ChatPage = () => {
  const [chatData, setChatData] = useState([]);
  const { user } = ChatState();
  useEffect(() => {
    console.log(localStorage.getItem("userInfo"));
  }, []);
  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideBar />}

        <Box
          display="flex"
          justifyContent={"space-between"}
          w="100%"
          h={"90vh"}
          p={"10px"}
        >
          {user && <MessageBox />}
          {user && <ChatsList />}
        </Box>
      </div>
    </>
  );
};
export default ChatPage;
