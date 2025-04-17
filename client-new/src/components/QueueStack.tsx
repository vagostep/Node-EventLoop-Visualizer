import { Box, Card, Flex, Text } from "@chakra-ui/react";
import React from "react";

export type Orientation = 'horizontal' | 'vertical';

export interface QueueStackProps {
  title: string;
  orientation: Orientation;
}

const QueueStack: React.FC<QueueStackProps> = ({ title, orientation }) => {

  const flexDirection = orientation === 'horizontal' ? 'row' : 'column-reverse';
  const width =
    orientation === "horizontal" ? "auto" : "100%";
  return (
    <Card.Root height="100%" width="100%" bg="#333333" shadow="sm">
      <Card.Body padding="1rem">
        <Card.Title color="#fff" fontWeight="bold" fontSize="20px">
          <Text fontSize="1.3rem">{title}</Text>
        </Card.Title>
        <Flex
          flexDirection={flexDirection}
          height="100%"
          gap="12px"
          marginTop="16px"
        >
          <Box
            width={width}
            height="40px"
            bg="#AFF8D8"
            borderRadius="4px"
            shadow="sm"
            color="black"
            padding="16px"
          >
            <Text fontSize="1rem" textAlign="center" lineHeight="0.6">
              Content
            </Text>
          </Box>
          <Box
            width={width}
            height="40px"
            bg="#FFCBC1"
            borderRadius="4px"
            shadow="sm"
            color="black"
            padding="16px"
          >
            <Text fontSize="1rem" textAlign="center" lineHeight="0.6">
              Content
            </Text>
          </Box>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

export default QueueStack;