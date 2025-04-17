import { Card, Text } from "@chakra-ui/react";
import React from "react";

export interface StepperProps {
  title: string
}

const Stepper: React.FC<StepperProps> = ({ title }) => {
  return (
    <Card.Root height="100%" width="100%" bg="#333333" shadow="sm">
      <Card.Body padding="1rem">
        <Card.Title color="#fff" fontWeight="bold" fontSize="20px">
          <Text fontSize="1.3rem">{title}</Text>
        </Card.Title>
        <Card.Description></Card.Description>
      </Card.Body>
    </Card.Root>
  );
};

export default Stepper;