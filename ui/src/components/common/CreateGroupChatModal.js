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
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
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
  const handleSearch = async (searchTerm) => {
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
          icon={ViewIcon}
          onClick={onOpen}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
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
          <ModalCloseButton />
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
                onChange={handleSearch}
                //value={usersList}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateGroupChatModal;
