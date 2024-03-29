import React from 'react'
import { useState } from 'react'
import { Button,VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement,useToast} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import {authUser} from '../../utils/HandleApi'

const Login = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const toast = useToast()
  const [Loading, setLoading] = useState(false);

  const navigate =useNavigate();
  const handleClick=()=>{
        setShow(!show)
    }

  const submitHandler=async()=>{
        setLoading(true)
        if (!name || !email || !password) 
        {  
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        try{
            const config = { headers: {"Content-type": "application/json", }, };
            const data=await authUser(name, email, password, config)
             toast({
                title: "login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate('/chats');
        }catch(error)
        {
            toast({
                title: "Error Occured!",
                description: error+"autherization failed. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }
  return (
    <VStack spacing='5px' color='black'>
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' value={name} onChange={(e)=> setName(e.target.value)}/>
        </FormControl>
        <FormControl id='Email' isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input placeholder='Enter Your email address' value={email} onChange={(e)=> setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id='Password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input placeholder='Enter Your Password' value={password} type={show ? 'text':'password'} onChange={(e)=> setPassword(e.target.value)} />
                <InputRightElement width='4.5rem'>
                    <Button h="1.75rem" size="sm" onClick={handleClick} >{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={Loading}> Login </Button>
        <Button variant="solid" colorScheme="red"  width="100%" onClick={() => {setName("guest"); setEmail("meghalneema@gmail.com"); setPassword("123456"); }} > Get Guest User Credentials </Button>
    </VStack>
  )
}

export default Login
