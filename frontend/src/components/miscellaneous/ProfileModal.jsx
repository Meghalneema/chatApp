import React from 'react'
import { ViewIcon } from "@chakra-ui/icons";
import { Image, Text,Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,IconButton, Center} from "@chakra-ui/react";
// import { useDisclosure } from "@chakra-ui/hooks";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";

const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
        {children ? (
            <span onClick={onOpen}>{children}</span>
          ) : (
            <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
          )}
          <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent height="350px" >
                <ModalHeader fontSize="25px" fontFamily="Work sans" display="flex" justifyContent="center" >{user.name} </ModalHeader>
                <ModalCloseButton />
                <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between" >
                    {/* <Image borderRadius="full" width="145px" height="140px" name={user.name} src={user.pic} alt={user.name} /> */}
                    <Avatar borderRadius="full" width="145px" height="140px" size="sm" cursor={'pointer'} name={user.name} src={user.pic}></Avatar>
                    
                    <Text marginTop="10px" as='b' fontSize={{ base: "30px", md: "25px" }} fontFamily="Work sans" > Email: {user.email} </Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  );
};

export default ProfileModal