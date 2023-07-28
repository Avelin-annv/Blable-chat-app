import React, { useEffect, useState } from "react";
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
  Text,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import axios from "axios";
import DisplayUser from "../DisplayUser";

import RemovableUserBadge from "./RemovableUserBadge";
import { getConfig } from "../../config/ChatUtils";

function UpdateGroupChatModal({
  children,
  fetchChats,
  setFetchChats,
  fetchAllMessages,
}) {
  const { user, selectedChat, setSelectedChat, chatsList, setChatsList } =
    ChatState();
  const config = getConfig(user);
  const [grpChatName, setGrpChatName] = useState(selectedChat.chatName);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  const [renameloading, setRenameLoading] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleModalClose = () => {
    setSearchQuery("");
    setSearchRes([]);
    onClose();
  };
  const handleGroupChatUserRemove = async (removedUserId) => {
    try {
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        { userId: removedUserId, chatId: selectedChat._id },
        config
      );
      setSelectedChat(removedUserId === user._id ? null : data);

      setFetchChats(!fetchChats);
      fetchAllMessages();
    } catch (e) {
      toast({
        title: "Error adding users",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAddUserToGroup = async (userToAdd) => {
    if (selectedChat.users.includes(userToAdd)) {
      toast({
        title: "This user is already added.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/chat/addtogroup`,
        { userId: userToAdd._id, chatId: selectedChat._id },
        config
      );
      setSelectedChat(data);
      setFetchChats(!fetchChats);
    } catch (e) {
      toast({
        title: "Error adding users",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleGroupChatRename = async () => {
    setRenameLoading(true);
    if (!grpChatName) {
      toast({
        title: "Group chat name cannot be empty.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const { data } = await axios.put(
        `/api/chat/renamegroup`,
        { chatId: selectedChat._id, chatName: grpChatName },
        config
      );
      setSelectedChat(data);
      setFetchChats(!fetchChats);
    } catch (e) {
      toast({
        title: "Error updating group chat.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setRenameLoading(false);
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
        position: "center",
      });
    } else {
      try {
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
          icon={<InfoIcon />}
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
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton onClick={handleModalClose} />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            {" "}
            <FormControl display={"flex"}>
              <Input
                mb={3}
                type="text"
                placeholder="Group chat name"
                onChange={(e) => setGrpChatName(e.target.value)}
                value={grpChatName}
              />

              <Button
                colorScheme="teal"
                ml={1}
                onClick={handleGroupChatRename}
                disabled={renameloading}
              >
                update
              </Button>
            </FormControl>
            {/* </Box> */}
            {/* only admins can add/remove user */}
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
              {selectedChat.users?.map((userItem) => (
                <RemovableUserBadge
                  key={userItem._id}
                  handleDelete={() => handleGroupChatUserRemove(userItem._id)}
                  user={userItem}
                  isRemovable={selectedChat.groupAdmin._id === user._id}
                />
              ))}
            </Box>
            {searchQuery.length > 0 && loading ? (
              <Spinner display="flex" />
            ) : (
              searchRes?.map((res) => (
                <DisplayUser
                  displayedUser={res}
                  key={res._id}
                  handleSelection={() => handleAddUserToGroup(res)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => handleGroupChatUserRemove(user._id)}
            >
              Exit group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
