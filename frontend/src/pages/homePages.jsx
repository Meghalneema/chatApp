import {React, useEffect} from 'react'
import { Container ,Box,Text, Tabs, TabList, TabPanels, Tab, TabPanel} from '@chakra-ui/react'
import Login from '../components/authentication/login';
import Signup from '../components/authentication/signUp';
import { useNavigate, } from "react-router-dom";
  
function HomePage() 
{
  const navigate =useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW='xl' centerContent>  
      <Box d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px">
        <Text textAlign ="center" fontSize="4xl" fontFamily="Work sans" color="black">Login Page</Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" textColor="black">
          <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList mb="1em">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">SignUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel> <Login/> </TabPanel>
              <TabPanel> <Signup/> </TabPanel>
            </TabPanels>
          </Tabs>
      </Box>
    </Container>
  );
}

export default HomePage;