import React from "react";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SingleChatBox from "./common/SingleChatBox";
function MessageBox({ fetchChats, setFetchChats }) {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={"center"}
      flexDirection={"column"}
      p={3}
      bg="white"
      w={{ base: "100%", md: "70%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
      ml={"5px"}
    >
      <SingleChatBox fetchChats={fetchChats} setFetchChats={setFetchChats} />
    </Box>
  );
}

export default MessageBox;
