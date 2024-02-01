import React from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";


const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
        borderRadius="lg"
        margin={1}
        marginBottom={2}
        variant="solid"
        fontSize={12}
        colorScheme="purple"
        cursor="pointer"
        onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon paddingLeft={1} />
    </Badge>
  )
}

export default UserBadgeItem
