import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Image,
  Text,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import DisplayUser from "../DisplayUser";
import LoadingState from "./LoadingState";
import RemovableUserBadge from "./RemovableUserBadge";
function CreateGroupChatModal({ children }) {
  const [grpChatName, setGrpChatName] = useState();
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user, selectedChat, setSelectedChat, chatsList, setChatsList } =
    ChatState();
  const handleModalClose = () => {
    setGrpChatName("");
    setUsersList([]);
    setSearchQuery("");
    setSearchRes([]);
    onClose();
  };
  const handleCreateGroupChat = async () => {
    //save grp chat with edits
    //onclose();
    if (!usersList || !grpChatName) {
      toast({
        title: "Please enter information for creating chat",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/groupcreate`,
        {
          chatName: grpChatName,
          users: JSON.stringify(usersList.map((userItem) => userItem._id)),
        },
        config
      );
      setChatsList([data, ...chatsList]);
      console.log(data, "grp chat data");
    } catch {
      toast({
        title: "Error creating new group chat.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    handleModalClose();
  };
  const handleGroupChatRemove = (removedUserId) => {
    setUsersList(usersList.filter((res) => res._id !== removedUserId));
  };
  const handleGroupAdd = (userToAdd) => {
    if (usersList.includes(userToAdd)) {
      toast({
        title: "This user is already added.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setUsersList([...usersList, userToAdd]);
    console.log("users list", usersList);
  };
  const handleSearch = async (searchTerm) => {
    //try adding debouncing to search
    setSearchQuery(searchTerm);
    setIsLoading(true);
    if (!searchTerm) {
      toast({
        title: "Please enter the search keyword",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(
          `/api/user?search=${searchTerm}`,
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
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create new group chat.
          </ModalHeader>
          <ModalCloseButton onClick={handleModalClose} />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <FormControl>
              <FormLabel>Group chat name</FormLabel>
              <Input
                mb={3}
                type="text"
                placeholder="Enter the chat name"
                onChange={(e) => setGrpChatName(e.target.value)}
                value={grpChatName}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Add users</FormLabel>
              <Input
                type="search"
                placeholder="search users here..."
                onChange={(e) => {
                  if (e.target.value.length > 0) handleSearch(e.target.value);
                  else {
                    setSearchQuery("");
                    setSearchRes([]);
                  }
                }}
              />
            </FormControl>
            <Box display={"flex"} width={"100%"} flexWrap={"wrap"} m={1}>
              {usersList?.map((user) => (
                <RemovableUserBadge
                  key={user._id}
                  handleDelete={() => handleGroupChatRemove(user._id)}
                  user={user}
                />
              ))}
            </Box>
            {searchQuery.length > 0 && loading
              ? "Loading..."
              : searchRes?.map((res) => (
                  <DisplayUser
                    displayedUser={res}
                    key={res._id}
                    handleSelection={() => handleGroupAdd(res)}
                  />
                ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateGroupChat}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateGroupChatModal;
