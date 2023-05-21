import React from "react";
import ChatState from "../context/ChatProvider";
import { Box, Avatar, Text } from "@chakra-ui/react";

const DisplayUser = ({ displayedUser, handleAccessChat }) => {
  return (
    <Box
      onClick={handleAccessChat}
      cursor={"pointer"}
      bg={"#E8E8E8"}
      _hover={{ background: "#38B2AC", color: "white" }}
      w={"100%"}
      display={"flex"}
      alignItems={"center"}
      color={"black"}
      px={3}
      py={2}
      mb={2}
      borderRadius={"lg"}
    >
      <Avatar
        size={"sm"}
        mr={2}
        cursor={"pointer"}
        name={displayedUser.userName}
        src={displayedUser.profilePic}
      />
      <Text>{displayedUser.userName}</Text>
      <Text m={3}>{displayedUser.email}</Text>
    </Box>
  );
};

export default DisplayUser;
