import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

function RemovableUserBadge({ user, handleDelete, isRemovable = true }) {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="teal"
      cursor={"pointer"}
      color={"white"}
    >
      {user.userName}
      {isRemovable && <CloseIcon onClick={handleDelete} pl={1}></CloseIcon>}
    </Box>
  );
}

export default RemovableUserBadge;
