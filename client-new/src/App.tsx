import Terminal from '@components/Terminal/Terminal';
import './App.css'
import CodeEditor from './components/CodeEditor/CodeEditor'
import { Box, Container, Flex, Grid, GridItem } from "@chakra-ui/react"
import { ColorModeButton, useColorMode } from "@components/ui/color-mode";
import CallStack from '@components/CallStack/CallStack';

function App() {

  const onChangeCode = () => {

  }

  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <Container>
      <Grid
        templateColumns="35% 65%"
        templateRows="1fr"
        height="100vh"
        gap={4}>
        <GridItem
          colSpan={1}
          display="grid"
          gridTemplateRows="60% 40%"
          gap={4}>
          <Box
            display="flex"
            alignItems="center"
            width="100%">
            <CodeEditor code='console.log("1");' locked={false} onChangeCode={onChangeCode} markers={[]}></CodeEditor>
          </Box>
          <Box
            bg="blue.300"
            width="100%">
            <Terminal outputs={[]} mode=''></Terminal>
          </Box>
        </GridItem>
        <GridItem
          colSpan={1}
          display="grid"
          gridTemplateRows="30% 70%"
          gap={4}>
          <Box
            bg="blue.300"
            width="100%">
            <ColorModeButton />
          </Box>
          <Box
            bg="red.300"
            width="100%">
              <Flex 
                direction="row"
                height="100%"
                gap={4}>
                  <Box width="30%" height="100%">
                    <CallStack></CallStack>
                  </Box>
                  <Box width="30%" height="100%">
                    <CallStack></CallStack>
                  </Box>
                  <Box width="30%" height="100%">
                    <CallStack></CallStack>
                  </Box>
              </Flex>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  )
}

export default App
