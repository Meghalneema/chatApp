import React, { useEffect, useState } from 'react'
import { Box, Text } from "@chakra-ui/react"
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from "axios";
const ENDPOINT = "http://localhost:5001";
// const ENDPOINT="https://chatapp-socketio-iuu9.onrender.com";

var socket, selectedChatCompare;

// import Lottie2 from "react-lottie";
import Lottie from "lottie-react";  //npm lottie-react -v   10.4.0

import io from "socket.io-client";
import animationData from "../../src/animinations/typing.json"
import { ChatState } from '../context/ChatProvider'
import ProfileModal from "./miscellaneous/ProfileModal";
import { getSender, getSenderFull } from "../config/ChatLogics";
import "./singleChat.css";

import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ScrollableChat from './ScrollableChat';

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, setSelectedChat, selectedChat, notification, setNotification, baseUrl } = ChatState();

  const [Messages, setMessage] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [NewMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [isChatGpt, setIsChatGpt]=useState(false);


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async (e) => {
    if (!selectedChat) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}`, }, };
      setLoading(true)
      console.log("selectedChat._id", selectedChat._id, "config", config.headers)
      const { data } = await axios.get(`${baseUrl}/allMessages/${selectedChat._id}`, config);


      console.log("singleChat  fetchMessages", data);
      setMessage(data)
      setLoading(false)

      socket.emit("join chat", selectedChat._id)              ///
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages " + error,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  //prajwal id  65b8b358b79ca009f82b670f
  //meghal id  65b8b331b79ca009f82b6708
  //chat id 65b9daf4e2c2af4f592be0bd


  const sendMessage = async (event) => {
    // const [isChatGpt, setIsChatGpt]=useState(false);

    if (event.key === "Enter" && NewMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        if (NewMessage.includes("@chatGpt")) {
          console.log("isChatgpt true-------------------------------------------");
          setIsChatGpt(true); // Set isChatGpt to true here
        }
        setNewMessage("")
        const { data } = await axios.post(`${baseUrl}/sendMessage`, { content: NewMessage, chatId: selectedChat }, config); ////
        socket.emit("new message", data);//////
        setMessage([...Messages, data]);
        
        if (setIsChatGpt) {
        setTimeout(() => {
          fetchMessages();
          setFetchAgain(true);
          setIsChatGpt(false);
          setFetchAgain(false);
        }, 5000);
      }
        
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message" + error,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);


  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // console.log(notification,"notification---------------------------------------")

  useEffect(() => {

    socket.on("message recieved", (newMessageRecieved) => {
      if (!selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
      else {
        setMessage([...Messages, newMessageRecieved]);
      }
    });
  });

//   useEffect(() => {
//   if (isChatGpt) {
//     console.log("hello ------------------------------------------------------");
//     fetchMessages();
//     setIsChatGpt(false); 
//   }
// }, [isChatGpt]);


  const typingHandler = (e) => {
    setNewMessage(e.target.value)
    //typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }


  return (
    <div >
      {selectedChat ? (
        <div >
          <Text fontSize={{ base: "28px", md: "30px" }}
            paddingBottom={3}
            paddingLeft={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center">
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {Messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            width={{ base: "100%", lg: "10%" }} /* Adjust width for responsiveness */
            minWidth={{ base: "300px", md: "900px" }} // Example minimum width
            height="76vh"
            borderRadius="lg"
            overflowY='hidden'
            margin="auto"
          >
            {/* message box */}
            {Loading ? (<Spinner size="xl"
              width={20}
              height={20}
              alignSelf="center"
              margin="auto" />) : (
              <div className='Messages' >
                <ScrollableChat Messages={Messages} />
              </div>
            )
            }

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>

              {istyping ? (<div><Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} /></div>) : (<></>)}

              {/* <Lottie animationData={animationData} loop={true} autoplay={true} style={{ marginBottom: 15, marginLeft: 0 }} /> */}


              <Input variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={NewMessage}
                borderColor="lightblue"
                borderWidth={3}
                onChange={typingHandler}>
              </Input>
            </FormControl>

          </Box>
        </div>
      ) :
        (<Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans" textAlign="center">
            Click on a user to start chatting
          </Text>
        </Box>
        )
      }
    </div>
  );
};

export default SingleChat;

