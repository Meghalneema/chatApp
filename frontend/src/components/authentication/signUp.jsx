import React from 'react'
import { useState} from 'react'

import { Button,VStack, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import {registerUser} from '../../utils/HandleApi'
// import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const SignUp = () => {

  const [name, setName] = useState();  
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [loding, setLoding] = useState(false);
  const toast = useToast()
  const navigate =useNavigate();
//   const history = useHistory();

    const handleClick=()=>{
        setShow(!show)
    }

    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
        toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return;
        }
        console.log(pics);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chatapp");
        data.append("cloud_name", "dggy5wypz");  ////
        fetch("https://api.cloudinary.com/v1_1/dggy5wypz/image/upload", {  ////
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
            setPic(data.url.toString());
            console.log(data.url.toString());
            setPicLoading(false);
            })
            .catch((err) => {
            console.log(err);
            setPicLoading(false);
            });
        } else {
        toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setPicLoading(false);
        return;
        }
    };

    const submitHandler=async()=>{
        setPicLoading(true)
        if (!name || !email || !password || !confirmpassword) 
        {  
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Password's Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try{
            const config = { headers: {"Content-type": "application/json", }, };
            const data=await registerUser(name, email, password,  pic, config)
             toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            navigate('/chats');
        }catch(error)
        {
            toast({
                title: "Error Occured!",
                description: error+"Registration failed. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
        }
    }
  return (
   <VStack spacing='5px' color='black'>
        <FormControl id='first name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' onChange={(e)=> setName(e.target.value)}/>
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input placeholder='Enter Your email address' onChange={(e)=> setEmail(e.target.value)}/>
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input placeholder='Enter Your Password' type={show ? 'text':'password'} onChange={(e)=> setPassword(e.target.value)} />
                <InputRightElement width='4.5rem'>
                    <Button h="1.75rem" size="sm" onClick={handleClick} >{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='conformPassword' isRequired>
            <FormLabel>conform Password</FormLabel>
            <InputGroup>
                <Input placeholder='Enter Your conform Password' type={show ? 'text':'password'} onChange={(e)=> setConfirmpassword(e.target.value)}/>
                <InputRightElement width='4.5rem'>
                    <Button h="1.75rem" size="sm" onClick={handleClick} >{show ? "Hide" : "Show"}</Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic' isRequired>
            <FormLabel>upload your picture</FormLabel>
            <Input type='file' p={1.5} accept='image/*' onChange={(e)=> postDetails(e.target.files[0])}/>
        </FormControl>
        <Button colorScheme='blue' width='100%' style={{marginTop:15}} onClick={submitHandler} isLoading={loding}>SignUp</Button>
   </VStack>
  )
}

export default SignUp
