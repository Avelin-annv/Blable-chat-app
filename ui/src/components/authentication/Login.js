import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
function Login() {
  const [password, setPassWord] = useState("");

  const [userEmail, setUserEmail] = useState("");

  const [showPswd, setShowPswd] = useState(false);
  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setUserEmail(e.target.value)}
          value={userEmail}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showPswd ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassWord(e.target.value)}
            value={password}
          />
          <InputRightElement>
            <Button
              size="sm"
              h={"1.75rem"}
              variant="ghost"
              onClick={() => setShowPswd(!showPswd)}
            >
              {showPswd ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        style={{ marginTop: 15 }}
        colorScheme="blue"
        onClick={() => {}}
        width="100%"
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setPassWord("guestUsr123");
          setUserEmail("guestUser@test.com");
        }}
      >
        Get guest credentials
      </Button>
    </VStack>
  );
}

export default Login;
