import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
function Login() {
  const [password, setPassWord] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [showPswd, setShowPswd] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handleLogin = async () => {
    setIsLoading(true);
    if (!email || !password) {
      toast({
        title: "Please enter required fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        {
          email,
          password,
        },
        config
      );

      toast({
        title: "You have successfully logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setIsLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
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
        onClick={handleLogin}
        width="100%"
        isDisabled={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setPassWord("guestUsr123");
          setEmail("guestUser@test.com");
        }}
      >
        Get guest credentials
      </Button>
    </VStack>
  );
}

export default Login;
