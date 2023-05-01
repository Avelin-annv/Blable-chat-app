import React from "react";
import {
  Box,
  Container,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";

export const ChatDashboardPage = () => {
  return (
    <Container maxW={"xl"} centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        w={"100%"}
        bg="white"
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text fontFamily="Work sans" fontSize="4xl" color="black">
          Get started with Blable!
        </Text>
      </Box>
      <Box p={3} w={"100%"} bg="white" borderRadius={"lg"} borderWidth={"1px"}>
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList mb={"1em"}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
