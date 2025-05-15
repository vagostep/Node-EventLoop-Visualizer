import { Card, Flex, Steps, Text } from "@chakra-ui/react";
import React, { RefObject } from "react";
import { LuCheck } from "react-icons/lu";
import { useColorModeValue } from "./ui/color-mode";

export interface Step {
  id: number;
  name: string;
  title?: string;
  description?: string;
}
export interface StepperProps {
  title: string;
  steps: Array<Step>;
  activeStep: string;
  onAboutClick: () => void;
  ref?: RefObject<HTMLDivElement | null>;
}

const Stepper: React.FC<StepperProps> = ({ title, activeStep, onAboutClick, ref, steps = [] }) => {

  const backgroundColor = useColorModeValue('#fdf6e3', '#333333');
  const fontColor = useColorModeValue('#1a1a1a', '#ffffff');

  const getIndicatorBackgroundColor = (index: number) => {
    const activeStepId = steps?.find((step) => step.name === activeStep)?.id || 0;

    if (activeStepId === index) {
      return "#66cc33";
    }

    if (activeStepId > index) {
      return "gray";
    }

    if (activeStepId < index) {
      return;
    }
  }
  return (
    <Card.Root height="100%" width="100%" bg={backgroundColor} shadow="sm" ref={ref}>
      <Card.Body padding="1rem">
        <Card.Title color={fontColor} fontWeight="bold" fontSize="20px">
          <Flex justifyContent="space-between">
            <Text textStyle={{ base: "md", sm: "xs", lg: "xl" }}>{title}</Text>
            <Text
              textStyle="xs"
              color="#339933"
              fontWeight="bolder"
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
        <Steps.Root
          orientation="vertical"
          height="auto"
          count={steps.length}
          marginTop="24px"
          size="sm"
          step={steps?.find((step) => step.name === activeStep)?.id || 0}
        >
          <Steps.List>
            {steps
              ?.filter((_, index) => index >= 1 && index < steps.length - 1)
              .map((step, index) => (
                <Steps.Item
                  key={index + 1}
                  index={index + 1}
                  title={step.title}
                  alignItems="center"
                  marginBottom="1rem"
                  textStyle="xs"
                  color="#fff"
                >
                  <Steps.Indicator
                    color="white"
                    bg={getIndicatorBackgroundColor(index + 1)}
                  >
                    <Steps.Status incomplete={<></>} complete={<LuCheck />} />
                  </Steps.Indicator>
                  <Steps.Title textStyle={{ base: "xs", lg: "sm" }}>{step.title}</Steps.Title>
                  <Steps.Separator />
                </Steps.Item>
              ))}
          </Steps.List>
        </Steps.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default Stepper;