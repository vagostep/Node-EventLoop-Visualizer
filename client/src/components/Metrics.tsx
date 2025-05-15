import { Box, Card, Flex, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import { GrPowerCycle } from "react-icons/gr";
import { MdOutlineEventAvailable, MdOutlineEventRepeat } from "react-icons/md";
import { EventMetrics } from "../interfaces";
import { useColorModeValue } from "./ui/color-mode";

export interface MetricsProps {
  onAboutClick: () => void;
  metrics: EventMetrics;
}
const Metrics: React.FC<MetricsProps> = ({
  onAboutClick,
  metrics
}) => {

  const backgroundColor = useColorModeValue('#fdf6e3', '#333333');
  const fontColor = useColorModeValue('#1a1a1a', '#ffffff');

  return (
    <Card.Root height="100%" width="100%" bg={backgroundColor} shadow="sm">
      <Card.Body padding="1rem">
        <Card.Title color={fontColor} fontWeight="bold" fontSize="20px">
          <Flex justifyContent="space-between">
            <Text textStyle={{ base: "md", sm: "xs", lg: "xl" }}>Metrics</Text>
            <Text
              textStyle="xs"
              color="#339933"
              mt="8px"
              _hover={{
                color: "#66cc33",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onClick={onAboutClick}
            >
              About
            </Text>
          </Flex>
        </Card.Title>
        <SimpleGrid columns={{ base: 3, lg: 2 }} gap={2} height="100%" padding={{ base: "7px", lg: "16px" }}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
            <Icon size={{ base: "sm", lg: "lg" }} color={fontColor}>
              <GrPowerCycle />
            </Icon>
            <Text truncate textStyle={{ base: "xs", lg: "sm" }} color={fontColor}>Loop Count</Text>
            <Text textStyle={{ base: "xs", lg: "sm" }} color={fontColor}>{metrics.loopCount || 0}</Text>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
            <Icon size={{ base: "sm", lg: "lg" }} color={fontColor}>
              <MdOutlineEventAvailable /> 
            </Icon>
            <Text truncate textStyle={{ base: "xs", lg: "sm" }} color={fontColor}>Events</Text>
            <Text textStyle={{ base: "xs", lg: "sm" }} color={fontColor}>{metrics.loopEvents || 0}</Text>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
            <Icon size={{ base: "sm", lg: "lg" }} color={fontColor}>
              <MdOutlineEventRepeat />
            </Icon>
            <Text truncate textStyle={{ base: "xs", lg: "sm" }} color={fontColor}>Events Waiting</Text>
            <Text textStyle={{ base: "xs", lg: "sm" }} color={fontColor}>{metrics.loopEventsWaiting || 0}</Text>
          </Box>
        </SimpleGrid>
      </Card.Body>
    </Card.Root>
  );
}

export default Metrics;