import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Player } from "@lottiefiles/react-lottie-player";

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
import typingAnimation from "../../animations/typing.json";
const ENDPOINT = "http://localhost:5000";
var selectedChatCompare, socket;

const SingleChatBox = ({ fetchChats, setFetchChats }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [socketConneted, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const config = getConfig(user);
  const toast = useToast();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, []);
  useEffect(() => {
    //if we recieve anythhing from socket->put it to chat.
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stopped typing", () => {
      setIsTyping(false);
    });
    socket.on("message recieved", (newMessageRecvd) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecvd.chat._id
      ) {
        if (!notification.includes(newMessageRecvd)) {
          setNotification([newMessageRecvd, ...notification]);
          setFetchChats(!fetchChats);
        }
      } else {
        setAllMessages([...allMessages, newMessageRecvd]);
      }
    });
  });
  console.log("notification,", notification);
  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setAllMessages(data);

      setIsLoading(false);
      socket.emit("join chat", selectedChat._id);
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
      socket.emit("stopped typing", selectedChat._id);
      try {
        setNewMessage("");
        const { data } = await axios.post(
          `/api/message`,
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        socket.emit("new message", data);

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
    if (!socketConneted) return;
    if (!typing && e.target.value.length > 0) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    var lasMsgTime = new Date().getTime();
    var timer = 3000;
    setTimeout(() => {
      var currentTime = new Date().getTime();
      if (currentTime - lasMsgTime >= timer && typing) {
        socket.emit("stopped typing", selectedChat._id);
        setTyping(false);
      }
    }, timer);
  };

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
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
              <div>
                <ScrollableMessageCard messages={allMessages} />
              </div>
            )}
            <div>
              {isTyping && (
                <Player
                  src="https://assets5.lottiefiles.com/packages/lf20_SCdC0F.json"
                  className="player"
                  loop
                  autoplay
                  style={{
                    height: "20px",
                    width: "100px",
                    marginBottom: 15,
                    marginLeft: 0,
                  }}
                />
              )}
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
