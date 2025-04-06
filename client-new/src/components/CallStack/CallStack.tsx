import { Card } from "@chakra-ui/react";
import React from "react";
import styled from 'styled-components';

export interface CallStackProps {

}

const CallStack: React.FC<CallStackProps> = ({}) => {

  return (
    <Card.Root height="100%">
      <Card.Body>
        <Card.Title>Call Stack</Card.Title>
        <Card.Description>
          content
        </Card.Description>
      </Card.Body>
    </Card.Root> 
  );
}

export default CallStack;