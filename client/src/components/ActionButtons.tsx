import { Box, Button, Icon, Text } from "@chakra-ui/react";
import { FC } from "react";
import { HiOutlineFastForward, HiOutlinePause, HiOutlinePlay } from "react-icons/hi";

export interface ActionButtonsProps {
  onPlayNextEvent: () => void;
  onAutoplayNextEvent: (toggle: boolean) => void;
  isAutoPlay: boolean;
}
const ActionButtons: FC<ActionButtonsProps> = ({
  onPlayNextEvent,
  onAutoplayNextEvent,
  isAutoPlay
}) => {
  return (
    <Box position="fixed" bottom="4" right="4" zIndex="overlay">
      <Box mb="3">
        <Button
          bg={isAutoPlay ? "gray" : "#e99c40"}
          borderRadius="24px"
          boxSize="56px"
          shadow="sm"
          size={{ base: "sm", lg: "lg" }}
          variant="surface"
          onClick={() =>
            isAutoPlay ? onAutoplayNextEvent(false) : onAutoplayNextEvent(true)
          }
          aria-description="Auto play"
          _hover={
            isAutoPlay
              ? {
                  bg: "lightgrey",
                  borderColor: "transparent",
                }
              : {
                  bg: "#f5bc75",
                  borderColor: "transparent",
                }
          }
        >
          <Icon size={{ base: "md", lg: "xl" }}>
            {isAutoPlay ? <HiOutlinePause /> : <HiOutlineFastForward />}
          </Icon>
        </Button>
      </Box>

      <Box>
        <Button
          bg="#339933"
          borderRadius="24px"
          boxSize="56px"
          width="140px"
          size={{ base: "sm", lg: "lg" }}
          shadow="sm"
          disabled={isAutoPlay}
          variant="surface"
          onClick={onPlayNextEvent}
          _hover={{
            bg: "#99cc7d",
            borderColor: "transparent",
          }}
        >
          <Icon size={{ base: "md", lg: "2xl" }}>
            <HiOutlinePlay />
          </Icon>

          <Text textStyle={{ base: "sm", lg: "xl" }} fontWeight="semibold">
            Step
          </Text>
        </Button>
      </Box>
    </Box>
  );
};

export default ActionButtons;