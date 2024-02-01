import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);  /////
  const navigate = useNavigate();
  const [notification, setNotification] = useState([]);
  // const baseUrl="http://localhost:5001";
  const baseUrl="https://chatapp-with-socketio.onrender.com";

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/"); 
  }, [navigate]);


  return (
    <ChatContext.Provider value={{baseUrl,navigate,selectedChat, setSelectedChat, user, setUser, notification, setNotification, chats, setChats,}} >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

