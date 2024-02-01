import React,{ useState } from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure,
  FormControl, Input, useToast, Box, IconButton,   Spinner,} from "@chakra-ui/react";
import axios from "axios";

import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
 const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();  //
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  
  const { selectedChat, setSelectedChat, user,baseUrl } = ChatState();

  const handleRemove=async(user1)=>{
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins or user itself can remove!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}`, },  };
        const {data}=await axios.put(`${baseUrl}/removeGroup`,{chatId:selectedChat._id,userId: user1._id,},config)
        console.log(data);
        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);        
    } catch (error) {
        toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  }
  const handleRename=async()=>
  {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`${baseUrl}/rename`, {
          chatId: selectedChat._id, chatName: groupChatName,
        }, config );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch=async(query)=>{
    setSearch(query);
    if(!query){
        return;
    }
    try {
        setLoading(true)
        const config = {
            headers: { Authorization: `Bearer ${user.token}`, },
        }; 
        const {data}=await axios.get(`${baseUrl}/registerUser?search=${search}`,config)
        console.log(data)
        setLoading(false)
        setSearchResult(data)
    } catch (error) {
        toast({
        title: 'Error occured.',
        description: "Errored Occured in loding the search",
        status:"error",
        duration: 3000,
        isClosable: true,
        position:"bottom-left"
        })
    }
}

  const handleAddUser=async(user1)=>{
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}`, },  };
      const {data}=await axios.put(`${baseUrl}/groupAdd`,{chatId:selectedChat._id,userId: user1._id,},config)
      console.log(data)
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);

    } catch (error) {
        toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  }

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box width="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex" marginBottom={3}>
            <Input
                placeholder="Chat Name"
                marginBottom={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
                variant="solid"
                colorScheme="teal"
                marginLeft={1}
                isLoading={renameloading}
                onClick={handleRename}
            > Update </Button>
            </FormControl>
            <FormControl>
            <Input
                placeholder="Add User to group"
                marginBottom={1}
                onChange={(e) => handleSearch(e.target.value)}
            />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red" marginRight={2}>
              Leave Group
            </Button>
            <Button colorScheme='blue' marginRight={2} onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal

