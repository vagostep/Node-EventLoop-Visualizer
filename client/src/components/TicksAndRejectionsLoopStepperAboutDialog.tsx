import { Button, CloseButton, Dialog, List, Portal, Text } from "@chakra-ui/react";

export interface TicksAndRejectionsLoopStepperAboutDialogProps {
  onTicksAndRejectionsLoopStepperAboutDialogClose: () => void
}
const TicksAndRejectionsLoopStepperAboutDialog: React.FC<TicksAndRejectionsLoopStepperAboutDialogProps> = ({
  onTicksAndRejectionsLoopStepperAboutDialogClose,
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
                  Ticks & Rejections Loop!
                </Text>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                The Ticks & Rejections Loop in Node.js is a crucial micro-phase
                that runs between each phase of the main Event Loop. This loop
                is responsible for handling next ticks and microtasks, ensuring
                that operations scheduled to run as soon as possible are given
                the highest priority. Even though these callbacks are
                asynchronous, they are treated as extremely urgent, and they are
                always executed before Node.js proceeds to the next phase of the
                Event Loop.
              </p>
              <br />
              <Text textStyle="2xl" textAlign="left" fontWeight="bold">
                Ticks vs Microtasks
              </Text>
              <br />
              <List.Root>
                <List.Item>
                  <strong>Next Ticks:</strong> This phase's queue is populated
                  with callbacks scheduled via process.nextTick(). These
                  callbacks are not part of the official microtask queue, but in
                  Node.js, they have even higher priority. They are executed
                  immediately after the current operation and before Promises.
                </List.Item>
                <br />
                <List.Item>
                  <strong>Microtasks</strong>: These microtasks are executed
                  after all next ticks have been processed, but still before the
                  Event Loop moves to its next phase (e.g., timers or poll).
                </List.Item>
                <br />
              </List.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onTicksAndRejectionsLoopStepperAboutDialogClose}
                >
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={onTicksAndRejectionsLoopStepperAboutDialogClose}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default TicksAndRejectionsLoopStepperAboutDialog;