import { Box, Card, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { getPastelForIndex } from "@utils/colors";
import React, { RefObject, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DELAY_TIME, UI_QUEUE_SIZES } from "../constants";
import { useColorModeValue } from "./ui/color-mode";

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
  const isMobileLandscape = useBreakpointValue({ base: false, sm: true, md: false });

  const backgroundColor = useColorModeValue('#fdf6e3', '#333333');
  const fontColor = useColorModeValue('#1a1a1a', '#ffffff');

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

  const scrollComponentRef = useRef<HTMLDivElement | null>(null);
  const lastFrameComponentRef = useRef<HTMLDivElement | null>(null);
  const prevFramesLength = useRef(0);

  useEffect(() => {
    const container = scrollComponentRef.current;
    const divisor = isMobileLandscape ? UI_QUEUE_SIZES.LANDSCAPE : isMobile ? UI_QUEUE_SIZES.MOBILE : UI_QUEUE_SIZES.DESKTOP;
    const wasAdded = frames.length > prevFramesLength.current;

    if (container && frames.length > divisor) {
      if (isMobile) {
        container.scrollLeft = container.scrollLeft + 132;
      } else if (!isMobile && wasAdded) {
        setTimeout(() => {
          container.scrollTop = container.scrollHeight * -1;     
        }, DELAY_TIME);   
        
      }
    }
    prevFramesLength.current = frames.length;
  }, [frames.length, isMobile, isMobileLandscape])

  return (
    <Box height="100%" overflow="hidden" ref={ref} shadow="sm" >
      <Card.Root height="100%" width="100%" bg={backgroundColor} overflow="hidden">
        <Card.Body overflow="hidden" padding="1rem" height="100%" width="100%" justifyContent="space-between">
          <Card.Title
            color={fontColor}
            fontWeight="bold"
            marginBottom={titleMarginBottom}
          >
            <Flex justifyContent="space-between">
              <Text textStyle={{ base: "md", sm: "xs", lg: "xl" }} color={fontColor}>{title}</Text>
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
            height={{ base: "100%", lg: !isHorizontal ? "460px" : "100%" }}
            maxHeight={{ base: "none", lg: !isHorizontal ? "460px" : "100%" }}
            gap="12px"
            width={{ base: "252px", sm: "516px", lg: "100%" }}
            overflowX="hidden"
            overflowY="auto"
            scrollBehavior="smooth"
            ref={scrollComponentRef}
            css={{
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": {
                display: "none", // Chrome, Safari
              },
            }}
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
                    transition={{ duration: DELAY_TIME / 1000 }}
                    ref={frames.length - 1 === index ? lastFrameComponentRef : null}
                  >
                    <Text
                      textStyle={{ base: "xs", lg: "sm" }}
                      textAlign="center"
                      color={fontColor}
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
    </Box>
  );
};

export default QueueStack;