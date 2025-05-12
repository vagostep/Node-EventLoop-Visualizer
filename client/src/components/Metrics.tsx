import { Box, Card, Flex, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import { GrPowerCycle } from "react-icons/gr";
import { MdOutlineEventAvailable, MdOutlineEventRepeat } from "react-icons/md";
import { EventMetrics } from "../interfaces";

export interface MetricsProps {
  onAboutClick: () => void;
  metrics: EventMetrics;
}
const Metrics: React.FC<MetricsProps> = ({
  onAboutClick,
  metrics
}) => {
  return (
    <Card.Root height="100%" width="100%" bg="#333333" shadow="sm">
      <Card.Body padding="1rem">
        <Card.Title color="#fff" fontWeight="bold" fontSize="20px">
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
        <SimpleGrid columns={{ base: 3, lg: 2 }} gap={2} height="100%" padding="16px">
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
            <Icon size="lg">
              <GrPowerCycle />
            </Icon>
            <Text truncate textStyle={{ base: "xs", lg: "md" }}>Loop Count</Text>
            <Text textStyle={{ base: "xs", lg: "md" }}>{metrics.loopCount || 0}</Text>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
            <Icon size="lg">
              <MdOutlineEventAvailable /> 
            </Icon>
            <Text truncate textStyle={{ base: "xs", lg: "md" }}>Events</Text>
            <Text textStyle={{ base: "xs", lg: "md" }}>{metrics.loopEvents || 0}</Text>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
            <Icon size="lg">
              <MdOutlineEventRepeat />
            </Icon>
            <Text truncate textStyle={{ base: "xs", lg: "md" }}>Events Waiting</Text>
            <Text textStyle={{ base: "xs", lg: "md" }}>{metrics.loopEventsWaiting || 0}</Text>
          </Box>
        </SimpleGrid>
      </Card.Body>
    </Card.Root>
  );
}

export default Metrics;