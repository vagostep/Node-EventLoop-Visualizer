import { Button, CloseButton, Dialog, List, Portal, Text } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

export interface MicroTaskQueueAboutDialogProps {
  onMicroTaskQueueAboutDialogClose: () => void
}
const MicroTaskQueueAboutDialog: React.FC<MicroTaskQueueAboutDialogProps> = ({
  onMicroTaskQueueAboutDialogClose,
}) => {

  const fontColor = useColorModeValue('#1a1a1a', '#ffffff');
  const buttonBackgroundColor = useColorModeValue("#fbf1d3", "#1a1a1a");

  return (
    <Dialog.Root key="welcome-dialog" size="lg" open={true}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content paddingLeft="16px" paddingRight="16px">
            <Dialog.Header>
              <Dialog.Title>
                <Text textStyle="3xl" textAlign="center" color="#339933">
                  Micro Task Queue!
                </Text>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body color={fontColor}>
              <Text>
                The Microtask Queue in Node.js is a special queue used to manage
                microtasks — small units of work that are scheduled to run
                immediately after the current operation completes, before the
                event loop moves to the next phase.
              </Text>
              <br />
              <Text textStyle="2xl" textAlign="left" fontWeight="bold">
                Microtasks include:
              </Text>
              <br />
              <List.Root>
                <List.Item>
                  Promise callbacks (.then, .catch, .finally, async/await,
                  Promise.resolve(), Promise.reject()).
                </List.Item>
                <List.Item>queueMicrotask.</List.Item>
                <List.Item>
                  process.nextTick (Node.js-specific — but even more
                  prioritized).
                </List.Item>
              </List.Root>
              <br />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onMicroTaskQueueAboutDialogClose}
                  bg={buttonBackgroundColor}
                  color={fontColor}
                  _hover={{
                    border: "none"
                  }} _focus={{
                    border: "none",
                    outline: "none",
                    borderRadius: "0px"
                  }}
                >
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={onMicroTaskQueueAboutDialogClose}
                bg={buttonBackgroundColor}
                color={fontColor}
                _hover={{
                  border: "none"
                }} _focus={{
                  border: "none",
                  outline: "none",
                  borderRadius: "0px"
                }}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MicroTaskQueueAboutDialog;