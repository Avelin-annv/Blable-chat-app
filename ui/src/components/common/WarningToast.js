import { useDisclosure, useToast } from "@chakra-ui/react";
import React from "react";

const WarningToast = ({ message, position }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  return toast({
    title: message,
    status: "warning",
    duration: 5000,
    isClosable: true,
    position: position,
  });
};

export default WarningToast;
