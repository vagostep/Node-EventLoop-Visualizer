import { Link, Text } from "@chakra-ui/react";

const Attributions: React.FC = () => {
  return (
    <Text textStyle={{ base: "md", md: "2xl" }} marginTop="8px">
      By{" "}
      <Link
        color="#339933"
        _hover={{ color: "#66cc33", textDecoration: "none" }}
        target="_blank"
        href="https://github.com/vagostep/Node-EventLoop-Visualizer"
      >
        vagostep
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
  );
}

export default Attributions;