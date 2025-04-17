import Terminal from '@components/Terminal';
import './App.css'
import CodeEditor from './components/CodeEditor'
import { Box, Button, Container, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react"
import { useColorMode } from "@components/ui/color-mode";
import QueueStack from '@components/QueueStack';
import Stepper from '@components/Stepper';
import Attributions from '@components/Attributions';
import ExampleSelector from '@components/ExampleSelector';
import { AiOutlineSend } from "react-icons/ai";
import ActionButtons from '@components/ActionButtons';
import { useState } from 'react';
import axios from "axios";

function App() {

  const [code, setCode] = useState('console.log("2");');

  const onChangeCode = (newCode: string) => {
    setCode(newCode);
  }

  const onButtonRunClick = async () => {
    try {
      const response = await axios.get("https://api.ejemplo.com/endpoint");
      console.log("Respuesta:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Container padding="16px">
      <Grid templateColumns="35% 65%" templateRows="1fr" height="92vh" gap={4}>
        <GridItem
          colSpan={1}
          display="grid"
          gridTemplateRows="10% 5% 45% 35%"
          gap={4}
        >
          <Box width="100%" padding="16px">
            <Flex justifyContent="space-around">
              <Image src="light.svg" height="50px" width="80px" />
              <Text textStyle="2xl" textAlign="center">
                Node.js EventLoop Visualizer
              </Text>
            </Flex>
          </Box>
          <Box width="100%">
            <Flex justifyContent="space-between">
              <ExampleSelector></ExampleSelector>
              <Button size="lg" variant="surface" bg="blue" borderRadius="0px" shadow="sm" onClick={onButtonRunClick}>
                <AiOutlineSend />
                Run
              </Button>
            </Flex>
          </Box>
          <Box display="flex" alignItems="center" width="100%">
            <CodeEditor
              code={code}
              locked={false}
              onChangeCode={onChangeCode}
              markers={[]}
            ></CodeEditor>
          </Box>
          <Box width="100%">
            <Terminal outputs={[]} mode=""></Terminal>
          </Box>
        </GridItem>
        <GridItem
          colSpan={1}
          display="grid"
          gridTemplateRows="30% 67.3%"
          gap={4}
        >
          <Box width="100%">
            <Flex direction="column" height="100%" gap={4}>
              <Box width="94.5%" height="100%">
                <QueueStack
                  orientation="horizontal"
                  title="Macrotask Queue"
                ></QueueStack>
              </Box>
              <Box width="94.5%" height="100%">
                <QueueStack
                  orientation="horizontal"
                  title="Microtask Queue"
                ></QueueStack>
              </Box>
            </Flex>
          </Box>
          <Box width="100%">
            <Flex direction="row" height="100%" gap={4}>
              <Box width="30%" height="100%">
                <QueueStack
                  orientation="vertical"
                  title="Call Stack"
                ></QueueStack>
              </Box>
              <Box width="30%" height="100%">
                <Stepper title="Event Loop"></Stepper>
              </Box>
              <Box width="30%" height="100%">
                <Stepper title="Ticks & Rejections"></Stepper>
              </Box>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
      <ActionButtons></ActionButtons>
      <Attributions></Attributions>
    </Container>
  );
}

export default App


//<ColorModeButton />