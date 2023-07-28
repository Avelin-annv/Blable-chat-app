import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";

import { Box, useToast, Button, Text, Stack, Spinner } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import LoadingState from "./common/LoadingState";
import { getSenderName } from "../config/ChatUtils";
import CreateGroupChatModal from "./common/CreateGroupChatModal";

function ChatsList({ fetchChats }) {
  const [loggeInUser, setLoggedInUser] = useState();
  const { user, selectedChat, setSelectedChat, chatsList, setChatsList } =
    ChatState();
  const toast = useToast();

  const getAllChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/chat`, config);
      console.log("data all.", data);
      setChatsList(data);
    } catch (error) {
      toast({
        title: "Failed to load chats.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("userInfo")));
    getAllChats();
  }, [fetchChats]);

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection={"column"}
        alignItems={"center"}
        bg={"white"}
        w={{ base: "100%", md: "31%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Box
          pb={3}
          px={3}
          pt={1}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily={"Work sans"}
          display={{ base: "column", lg: "column" }}
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          {" "}
          My chats
          <CreateGroupChatModal>
            <Button
              size={{ base: "sm", lg: "md" }}
              mr={3}
              ml={{ md: "1rem" }}
              rightIcon={<AddIcon />}
            >
              Create new group chat
            </Button>
          </CreateGroupChatModal>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          p={3}
          bg={"#F8F8F8"}
          h="100%"
          w="100%"
          borderRadius={"lg"}
          overflowY={"hidden"}
        >
          {chatsList && chatsList.length > 0 ? (
            <Stack overflowY="scroll">
              {chatsList.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat?._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat?._id === chat._id ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  <Text>
                    {chat.isGroupChat
                      ? chat.chatName
                      : getSenderName(chat.users, loggeInUser)}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <Spinner
              size={"xl"}
              w={20}
              h={20}
              justifySelf={"center"}
              margin={"auto"}
            />
          )}
        </Box>
      </Box>
    </>
  );
}

export default ChatsList;
