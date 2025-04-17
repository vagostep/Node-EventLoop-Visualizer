import { Box, Button } from "@chakra-ui/react";
import { FC } from "react";
import { HiOutlineFastForward, HiOutlinePlay } from "react-icons/hi";

const ActionButtons: FC = () => {

  return (
    <Box position="fixed" bottom="4" right="4" zIndex="overlay">
      <Box mb="3">
        <Button
          bg="blue"
          borderRadius="24px"
          boxSize="56px"
          shadow="sm"
          aria-label="Email"
        >
          <HiOutlineFastForward />
        </Button>
      </Box>

      <Box>
        <Button
          bg="green"
          borderRadius="24px"
          boxSize="56px"
          width="140px"
          shadow="sm"
          aria-label="Add"
        >
          <HiOutlinePlay /> Step
        </Button>
      </Box>
    </Box>
  );
}

export default ActionButtons;