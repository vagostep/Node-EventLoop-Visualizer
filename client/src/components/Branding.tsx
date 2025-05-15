import { Flex, Image, Text } from "@chakra-ui/react";
import { RefObject } from "react";
import { useColorModeValue } from "./ui/color-mode";

export interface BrandingProps {
  ref?: RefObject<HTMLDivElement | null>;
}

const Branding: React.FC<BrandingProps> = ({ ref }) => {

  const imageUrl = useColorModeValue(`${import.meta.env.VITE_BASE_URL}/dark.svg`, `${import.meta.env.VITE_BASE_URL}/light.svg`)
  const fontColor = useColorModeValue('#000000', '#ffffff');

  return (
    <Flex
      justifyContent={{ base: "flex-start", sm: "space-around" }}
      alignItems="center"
      gap={{ base: "4", sm: "0" }}
      ref={ref}
    >
      <Image
        src={imageUrl}
        height="50px"
        width="80px"
      />
      <Text textStyle={{ base: "xl", lg: "2xl" }} textAlign="center" color={fontColor}>
        Event Loop Visualizer{" "}
      </Text>
    </Flex>
  );
}

export default Branding;