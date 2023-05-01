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
function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassWord] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userImg, setUserImg] = useState("");
  const [showPswd, setShowPswd] = useState({ pswd: false, confPswd: false });
  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
      </FormControl>
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
            type={showPswd.pswd ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassWord(e.target.value)}
            value={password}
          />
          <InputRightElement>
            <Button
              size="sm"
              h={"1.75rem"}
              variant="ghost"
              onClick={() => setShowPswd({ ...showPswd, pswd: !showPswd.pswd })}
            >
              {showPswd.pswd ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showPswd.confPswd ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <InputRightElement>
            <Button
              size="sm"
              h={"1.75rem"}
              variant="ghost"
              onClick={() =>
                setShowPswd({
                  ...showPswd,
                  confPswd: !showPswd.confPswd,
                })
              }
            >
              {showPswd.confPswd ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload your profile picture</FormLabel>
        <Input
          type="file"
          placeholder="upload "
          p={1.5}
          accept="image/*"
          onChange={() => {}}
        />
      </FormControl>
      <Button
        style={{ marginTop: 15 }}
        colorScheme="blue"
        onClick={() => {}}
        width="100%"
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default SignUp;
