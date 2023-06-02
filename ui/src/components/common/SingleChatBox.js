import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  getSenderName,
  getSenderInfo,
  getConfig,
} from "../../config/ChatUtils";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import ScrollableMessageCard from "./ScrollableMessageCard";

const SingleChatBox = ({ fetchChats, setFetchChats }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setIsLoading] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const config = getConfig(user);
  const toast = useToast();
  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setAllMessages(data);
      console.log("datadatav", data);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const sendNewMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const { data } = await axios.post(
          `/api/message`,
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        setAllMessages([...allMessages, data]);
      } catch (error) {
        toast({
          title: error.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
  useEffect(() => {
    fetchAllMessages();
  }, [selectedChat]);
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <ArrowBackIcon
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            ></ArrowBackIcon>
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : getSenderName(selectedChat.users, user)}
            {selectedChat.isGroupChat ? (
              <UpdateGroupChatModal
                fetchChats={fetchChats}
                setFetchChats={setFetchChats}
                fetchAllMessages={fetchAllMessages}
              />
            ) : (
              <ProfileModal user={getSenderInfo(selectedChat.users, user)} />
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl0"}
                w={20}
                h={20}
                justifySelf={"center"}
                margin={"auto"}
              />
            ) : (
              <ScrollableMessageCard messages={allMessages} />
            )}
            <div>
              <FormControl onKeyDown={sendNewMessage} isRequired>
                <Input
                  variant={"filled"}
                  bg={"#E0E0E0"}
                  placeholder="Enter a message..."
                  onChange={typingHandler}
                  value={newMessage}
                />
              </FormControl>
            </div>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3}>
            Select a chat to start talking!
          </Text>
        </Box>
      )}
    </>
  );
};
export default SingleChatBox;
