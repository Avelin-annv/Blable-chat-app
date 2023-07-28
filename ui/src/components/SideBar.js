import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
  Box,
  Text,
  Button,
  Avatar,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import {
  SearchIcon,
  ChevronDownIcon,
  WarningIcon,
  BellIcon,
} from "@chakra-ui/icons";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./common/ProfileModal";
import LoadingState from "./common/LoadingState";
import DisplayUser from "./DisplayUser";
import { getSenderName } from "../config/ChatUtils";
function SideBar() {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chatsList,
    setChatsList,
    notification,
    setNotification,
  } = ChatState();
  const [loading, setIsLoading] = useState(false);
  const [loadingChat, setIsLoadingChat] = useState(false);
  const [searchParam, setSearchParam] = useState();
  const [searchRes, setSearchRes] = useState();

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const handleAccessChat = async (userId) => {
    //to create chat /access chat when clicked on a particular contact.
    setIsLoadingChat(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      console.log("ress", data);
      if (!chatsList.find((chat) => chat._id === data._id)) {
        setChatsList([data, ...chatsList]);
      }

      setSelectedChat(data);
      onClose();
    } catch (e) {
      toast({
        title: "Error fetching chat details",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    setIsLoadingChat(false);
  };
  const handleSearch = async () => {
    setIsLoading(true);
    if (!searchParam) {
      toast({
        title: "Please enter the search keyword",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `/api/user?search=${searchParam}`,
          config
        );
        setSearchRes(data);
      } catch (e) {
        toast({
          title: "Something went wrong",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
    setIsLoading(false);
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        p={"5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search your contacts" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work-sans"}>
          Get connected with Blable!!!
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize={"2xl"} m={1}></BellIcon>
              {notification.length > 0 && (
                <Badge mb={"14px"} colorScheme="red" variant="solid">
                  {`+${notification.length}`}
                </Badge>
              )}
            </MenuButton>
            <MenuList>
              {notification.length === 0 && "No new messages"}
              {notification &&
                notification.map((notif) => {
                  return (
                    <MenuItem
                      m={1}
                      onClick={() => {
                        setSelectedChat(notif.chat);
                        setNotification(
                          notification.filter((elem) => elem._id !== notif._id)
                        );
                      }}
                    >
                      {notif.chat.isGroupChat
                        ? `New message for ${notif.chat.chatName}`
                        : `new message from ${getSenderName(
                            notif.chat.users,
                            user
                          )}`}
                    </MenuItem>
                  );
                })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.userName}
                src={user.profilePic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={"1px"}>Search users</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} pb={"3"}>
              <Input
                placeholder="Type here..."
                onChange={(e) => {
                  setSearchParam(e.target.value);
                }}
              />
              <Button
                variant="outline"
                colorScheme="blue"
                mr={1}
                ml={3}
                value={"search"}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Box>
            {loading ? (
              <LoadingState />
            ) : (
              searchRes?.map((res) => (
                <DisplayUser
                  displayedUser={res}
                  key={res._id}
                  handleSelection={() => handleAccessChat(res._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>

          <DrawerFooter></DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideBar;
