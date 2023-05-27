import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import SideBar from "../components/SideBar";
import { Box, useToast } from "@chakra-ui/react";
import ChatsList from "../components/ChatsList";
import MessageBox from "../components/MessageBox";

const ChatPage = () => {
  const { user } = ChatState();
  const toast = useToast();

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
          {user && <ChatsList />}
          {user && <MessageBox />}
        </Box>
      </div>
    </>
  );
};
export default ChatPage;
