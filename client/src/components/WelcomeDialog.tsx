import { Alert, Button, Checkbox, CloseButton, Dialog, Link, List, Portal, Text } from "@chakra-ui/react";

export interface WelcomeDialogProps {
  onWelcomeDialogChecked: (checked: boolean) => void;
  onWelcomeDialogClose: () => void
}
const WelcomeDialog: React.FC<WelcomeDialogProps> = ({
  onWelcomeDialogChecked,
  onWelcomeDialogClose,
}) => {
  return (
    <Dialog.Root key="welcome-dialog" size="lg" open={true}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content paddingLeft="16px" paddingRight="16px">
            <Dialog.Header>
              <Dialog.Title>
                <Text textStyle="3xl" textAlign="center" color="#339933">
                  Welcome!
                </Text>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                This visualizer helps you understand how Node.js executes the{" "}
                <Link
                  color="#339933"
                  _hover={{ color: "#66cc33", textDecoration: "none" }}
                  target="_blank"
                  href="https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick"
                >
                  Event Loop
                </Link>{" "}
                while it interacts with your code, revealing the flow of
                synchronous & asynchronous operations in action.
              </p>
              <br />
              <p>
                Watch each{" "}
                <Link
                  color="#339933"
                  _hover={{ color: "#66cc33", textDecoration: "none" }}
                  target="_blank"
                  href="https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#phases-overview"
                >
                  Event Loop's phase
                </Link>{" "}
                —timers, idle-prepare, pending callbacks, poll, check, close
                callbacks, ticks & rejections— like never before. Understand the
                execution order and how different tasks are queued and resolved.
              </p>
              <br />
              <Alert.Root status="warning">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Important</Alert.Title>
                  <Alert.Description>
                    Some repetitive Event Loop cycles may have been omitted to
                    reduce verbosity.
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
              <br />
              <Text textStyle="2xl" textAlign="left" fontWeight="bold">
                Instructions
              </Text>
              <br />
              <List.Root>
                <List.Item>
                  Write some code in the text editor on the left or pick it up
                  one example from the dropdown on the top left.
                </List.Item>
                <List.Item>
                  Hit the Run button and wait until the server completes.
                </List.Item>
                <List.Item>
                  Control the execution using the Step or Autoplay button on the
                  bottom rigth.
                </List.Item>
                <List.Item>
                  You can click on the Edit button on the top left to stop the
                  execution.
                </List.Item>
              </List.Root>
              <br />
              <Alert.Root status="info">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Support</Alert.Title>
                  <Alert.Description>
                    Not all the Node.js functionality are supported. More
                    information{" "}
                    <Link
                      color="#339933"
                      _hover={{ color: "#66cc33", textDecoration: "none" }}
                      target="_blank"
                      href="https://github.com/vagostep/Node-EventLoop-Visualizer?tab=readme-ov-file#supported-features"
                    >
                      here
                    </Link>
                    .
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
              <br />
              <Text textStyle="2xl" textAlign="left" fontWeight="bold">
                How does it work?
              </Text>
              <br />
              <List.Root>
                <List.Item>Your code is sent to a server.</List.Item>
                <List.Item>
                  The server executes your code using a modify Node.js runtime
                  that tracks every phase of the Event Loop.
                </List.Item>
                <List.Item>
                  Once your code execution is completed, the server returns a
                  summary of steps that happened in Runtime.
                </List.Item>
                <List.Item>
                  By controlling the execution using either the Step or Autoplay
                  button, you'll see an actual representation of the Event Loop
                  cycles ocurred in the Node.js server.
                </List.Item>
              </List.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Checkbox.Root
                variant="outline"
                onCheckedChange={(e) => onWelcomeDialogChecked(!!e.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Don't show this again</Checkbox.Label>
              </Checkbox.Root>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onWelcomeDialogClose}>
                  Ok
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onWelcomeDialogClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default WelcomeDialog;