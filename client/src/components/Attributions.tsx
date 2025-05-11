import { Box, Link, Text } from "@chakra-ui/react";

const Attributions: React.FC = () => {
  return (
    <Box height="100%" display="flex" justifyContent="center" alignItems="center">
      <Text textStyle={{ base: "xs", lg: "md" }}>
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