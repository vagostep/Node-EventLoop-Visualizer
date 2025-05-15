import { Box, Link, Text } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

const Attributions: React.FC = () => {

  const fontColor = useColorModeValue('#000000', '#ffffff');

  return (
    <Box height="100%" display="flex" justifyContent="center" alignItems="center">
      <Text textStyle="xs" color={fontColor}>
        By{" "}
        <Link
          color="#339933"
          _hover={{ color: "#66cc33", textDecoration: "none" }}
          target="_blank"
          href="https://github.com/vagostep/Node-EventLoop-Visualizer"
        >
          Vagostep
        </Link>{" "}
        based on work from{" "}
        <Link
          color="#339933"
          _hover={{ color: "#66cc33", textDecoration: "none" }}
          target="_blank"
          href="https://github.com/PhakornKiong"
        >
          PK
        </Link>{" "}
        &{" "}
        <Link
          color="#339933"
          _hover={{ color: "#66cc33", textDecoration: "none" }}
          target="_blank"
          href="https://github.com/Hopding/"
        >
          Andrew Dillon
        </Link>{" "}
        &{" "}
        <Link
          color="#339933"
          _hover={{ color: "#66cc33", textDecoration: "none" }}
          target="_blank"
          href="http://latentflip.com/loupe/"
        >
          Loupe
        </Link>
        .
      </Text>
    </Box>
    
  );
}

export default Attributions;