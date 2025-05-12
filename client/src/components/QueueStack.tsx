import { Box, Card, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { getPastelForIndex } from "@utils/colors";
import React, { RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion.create(Box);


export type Orientation = 'horizontal' | 'vertical';

export interface Frame {
  id?: string;
  name: string;
}

export interface QueueStackProps {
  title: string;
  orientation: Orientation;
  frames: Array<Frame>;
  onAboutClick: () => void;
  ref?: RefObject<HTMLDivElement | null>;
}

const QueueStack: React.FC<QueueStackProps> = ({
  title,
  orientation,
  frames = [],
  onAboutClick,
  ref
}) => {
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const isHorizontal = !!isMobile || orientation === "horizontal";
  const flexDirection = isHorizontal ? "row" : "column-reverse";
  const width = isHorizontal ? "auto" : "100%";
  const initial =
    isHorizontal
      ? { opacity: 0, x: 200 }
      : { opacity: 0, y: -200 };
  const exit =
    isHorizontal
      ? { opacity: 0, x: 200 }
      : { opacity: 0, y: -200 };
  const animate =
    isHorizontal ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 };
  const titleMarginBottom = isHorizontal ? "10px" : "3rem";

  return (
    <Card.Root height="100%" width="100%" bg="#333333" shadow="sm" ref={ref}>
      <Card.Body padding="1rem" overflow="hidden" height="100%" width="100%">
        <Card.Title
          color="#fff"
          fontWeight="bold"
          marginBottom={titleMarginBottom}
        >
          <Flex justifyContent="space-between">
            <Text textStyle={{ base: "md", sm: "xs", lg: "xl" }}>{title}</Text>
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
        <Flex
          flexDirection={flexDirection}
          alignItems="center"
          height="100%"
          gap="12px"
          width="100%"
        >
          <AnimatePresence>
            {frames?.map(({ name }, index) => {
              return (
                <MotionBox
                  key={index}
                  width={width}
                  minWidth="120px"
                  height={{ base: "35px", lg: "40px" }}
                  bg={getPastelForIndex(index)}
                  borderRadius="4px"
                  shadow="sm"
                  color="black"
                  padding="10px"
                  initial={initial}
                  animate={animate}
                  exit={exit}
                  transition={{ duration: 0.5 }}
                >
                  <Text
                    textStyle={{ base: "xs", sm: "xs", lg: "sm" }}
                    textAlign="center"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {name}
                  </Text>
                </MotionBox>
              );
            })}
          </AnimatePresence>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};

export default QueueStack;