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
function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassWord] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState();
  const [showPswd, setShowPswd] = useState({ pswd: false, confPswd: false });
  const [loading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handlePictureUpload = (pic) => {
    setIsLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    //upload picture
    if (pic.type === "image/jpeg" || pic === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      console.log("pic.type", pic.type);
      data.append("cloud_name", "dvmlr8uhc");
      data.append("upload_preset", "blable-chat-app");
      fetch("https://api.cloudinary.com/v1_1/dvmlr8uhc/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setProfilePic(data.url.toString());
          setIsLoading(false);
          console.log("sucessss", data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsLoading(false);
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!userName || !email || !password || !confirmPassword) {
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
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not  match",
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
      const { result } = await axios.post(
        "/api/user",
        {
          userName,
          email,
          password,
          profilePic,
        },
        config
      );
      toast({
        title: "You have successfully signed up.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(result));
      setIsLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: error.message,
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
          onChange={(e) => setEmail(e.target.value)}
          value={email}
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
          onChange={(e) => {
            handlePictureUpload(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        style={{ marginTop: 15 }}
        colorScheme="blue"
        onClick={handleSubmit}
        width="100%"
        isDisabled={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default SignUp;
