import { Flex, Image, Text } from "@chakra-ui/react";
import { RefObject } from "react";

export interface BrandingProps {
  ref?: RefObject<HTMLDivElement | null>;
}

const Branding: React.FC<BrandingProps> = ({ ref }) => {
  return (
    <Flex
      justifyContent={{ base: "flex-start", sm: "space-around" }}
      alignItems="center"
      gap={{ base: "4", sm: "0" }}
      ref={ref}
    >
      <Image
        src={`${import.meta.env.VITE_BASE_URL}/light.svg`}
        height="50px"
        width="80px"
      />
      <Text textStyle={{ base: "xl", lg: "2xl" }} textAlign="center">
        Event Loop Visualizer{" "}
      </Text>
    </Flex>
  );
}

export default Branding;