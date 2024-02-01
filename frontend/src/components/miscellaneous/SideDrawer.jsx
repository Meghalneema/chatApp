import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import {Menu, MenuButton, MenuList, MenuItem, MenuDivider, } from "@chakra-ui/menu";
import {Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/spinner";

// import NotificationBadge from "react-notification-badge";
// import { Effect } from "react-notification-badge";
// import { Badge } from "react-badge";
import "../../components/singleChat.css";

import Badge from '@mui/material-next/Badge';


import {useNavigate} from "react-router-dom"
import {Flex} from '@chakra-ui/react'
// ===================
import ProfileModal from './ProfileModal'
import { getSender } from '../../config/ChatLogics'
import ChatLoading  from "..//../components/ChatLoading"
import UserListItem from "../userAvatar/UserListItem";
import {ChatState} from  '..//../context/ChatProvider'
// ===================

const SideDrawer = () => {

  const [search, setSearch] = useState("");
  const [seachResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChats] = useState(false);
  const navigate = useNavigate(); 

  const {setSelectedChat,user,chats,setChats,notification, setNotification,baseUrl }=ChatState();


  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast=useToast();

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    navigate("/")
  }

  const handleSearch=async()=>{
    if(!search){
      toast({
          title: "search is empty",
          description: "please enter something to search",
          duration: 2000,
          isClosable: true,
          position:"top-left",
        })
        return
    }
    try{
      setLoading(true);

      const config = {
        headers: { Authorization: `Bearer ${user.token}`, },
      };

      const {data}=await axios.get(`${baseUrl}/registerUser?search=${search}`,config)
      setLoading(false);
      setSearchResult(data)
    }catch(error){
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
  //2 users ke bich me chats create karta hai
  const accessChat=async(userId)=>{
    try {
      setLoadingChats(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${baseUrl}/`, { userId }, config);   
      //  const { data } = await axios.post(`/api/chat`, { userId }, config);

      console.log(data)
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data)
      setLoadingChats(false)
      onClose();
    } catch (error) {
       toast({
          title: "Error in accessChat",
          description: error.message,
          duration: 5000,
          isClosable: true,
          position:"bottom-left",
        })
    }
  }
  return (
    <div> 
      {/* <Box   */}
      <Flex display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px" >

          <Tooltip label="search user to chat" hasArrow placement='bottom-end'>
            <Button variant='ghost' onClick={onOpen}>
              <i className="fas fa-search"></i>
              <Text d={{ base: "none", md: "flex" }} px="4px" > Search User </Text>
            </Button>
          </Tooltip>
          <Text fontSize="2xl" fontFamily="Work sans" textAlign="center" marginTop="0px" > Talk-A-Tive </Text>
          <div>
            <Menu>
              <MenuButton p={1}>
                {/* <Badge count={notification.length} /> */}
                {/* <NotificationBadge 
                count={notification.length}
                effect={Effect.SCALE}
              /> */}
                <div className="noti" count={notification.length}>  </div>
              
                <BellIcon fontSize="2xl" m="1px"/>
              </MenuButton>
              <MenuList paddingLeft={2}> 
                {!notification.length && "No New Messages"} 
                {notification.map(notif=>(
                  <MenuItem key={notif._id} onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}> 
                  {notif.chat.isGroupChat ? 
                  `New Message in ${notif.chat.chatName}`:
                  `New Message from ${getSender(user,notif.chat.users)}`}   
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
                <Avatar size="sm" cursor={'pointer'} name={user.name} src={user.pic}></Avatar>
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>My profile</MenuItem>
                </ProfileModal>
                <MenuDivider/>
                <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
              </MenuList>
            </Menu>
          </div>
       </Flex>
      {/* </Box> */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
              <DrawerBody>
                <Box display="flex" paddingBottom="2px" >
                  <Input placeholder="Search by name or email" marginRight="2" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading ? (<ChatLoading /> ) : 
                (
                    seachResult?.map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                      />
                    ))
                  )}
                {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer

// "react-notification-badge": "^1.5.1",
// "react-lottie": "^1.2.4",

// @mui/material @emotion/react @emotion/styled
// import { Badge } from "@chakra-ui/react";
// import { Player } from "@lottiefiles/react-lottie-player";