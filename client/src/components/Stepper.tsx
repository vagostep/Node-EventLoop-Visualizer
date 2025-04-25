import { Card, Steps, Text } from "@chakra-ui/react";
import React from "react";
import { LuCheck } from "react-icons/lu";

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
}

const Stepper: React.FC<StepperProps> = ({ title, activeStep, steps = [] }) => {

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
    <Card.Root height="100%" width="100%" bg="#333333" shadow="sm">
      <Card.Body padding="1rem">
        <Card.Title color="#fff" fontWeight="bold" fontSize="20px">
          <Text fontSize="1.3rem">{title}</Text>
        </Card.Title>
        <Steps.Root
          orientation="vertical"
          height="auto"
          count={steps.length}
          marginTop="24px"
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
                >
                  <Steps.Indicator
                    color="white"
                    bg={getIndicatorBackgroundColor(index + 1)}
                  >
                    <Steps.Status incomplete={<></>} complete={<LuCheck />} />
                  </Steps.Indicator>
                  <Steps.Title>{step.title}</Steps.Title>
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