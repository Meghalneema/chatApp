import React, { useState } from 'react'
import {ChatState} from  '../context/ChatProvider'
import {Box, Center} from "@chakra-ui/react"
import SingleChat from "../components/SingleChat"
// import "./SingleChat.css";

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const { selectedChat } = ChatState();
 
  return (
      <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems='center'
      flexDir="column"
      padding={3}
      bg="white"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      justifyContent='center'
      overflowX="hidden"
    >

      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox

