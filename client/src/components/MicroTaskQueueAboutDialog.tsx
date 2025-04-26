import { Button, CloseButton, Dialog, List, Portal, Text } from "@chakra-ui/react";

export interface MicroTaskQueueAboutDialogProps {
  onMicroTaskQueueAboutDialogClose: () => void
}
const MicroTaskQueueAboutDialog: React.FC<MicroTaskQueueAboutDialogProps> = ({
  onMicroTaskQueueAboutDialogClose,
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
                  Micro Task Queue!
                </Text>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                The Microtask Queue in Node.js is a special queue used to manage
                microtasks — small units of work that are scheduled to run
                immediately after the current operation completes, before the
                event loop moves to the next phase.
              </p>
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
                >
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={onMicroTaskQueueAboutDialogClose}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MicroTaskQueueAboutDialog;