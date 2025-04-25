import { Button, CloseButton, Dialog, Link, List, Portal, Text } from "@chakra-ui/react";

export interface MacroTaskQueueAboutDialogProps {
  onMacroTaskQueueAboutDialogClose: () => void
}
const MacroTaskQueueAboutDialog: React.FC<MacroTaskQueueAboutDialogProps> = ({
  onMacroTaskQueueAboutDialogClose,
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
                  Macro Task Queue!
                </Text>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                In Node.js, macrotasks are larger units of asynchronous work,
                handled during specific{" "}
                <Link
                  color="#339933"
                  _hover={{ color: "#66cc33", textDecoration: "none" }}
                  target="_blank"
                  href="https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#phases-overview"
                >
                  phases of the Event Loop
                </Link>{" "}
                . Unlike microtasks (like Promises and process.nextTick), which
                are run immediately after the current stack clears, macrotasks
                are scheduled for specific phases and executed in their
                respective queues.
              </p>
              <br />
              <p>
                Each phase in the Node.js Event Loop has its own queue, and
                Node.js processes one phase at a time in a continuous loop.
              </p>
              <br />
              <Text textStyle="2xl" textAlign="left" fontWeight="bold">
                Queues
              </Text>
              <br />
              <List.Root>
                <List.Item>
                  <strong>Timers Queue:</strong> Callbacks scheduled by
                  setTimeout() and setInterval().
                </List.Item>
                <List.Item>
                  Pending Callbacks Queue: I/O Callbacks deferred to the next
                  loop iteration.
                </List.Item>
                <List.Item>Idle, Prepare Queue: only used internally.</List.Item>
                <List.Item>
                  Poll Queue: I/O related Callbacks (almost all with the exception of close callbacks, the ones
                  scheduled by timers, and setImmediate());
                </List.Item>
                <List.Item>
                  Check Queue: setImmediate() Callbacks are invoked here.
                </List.Item>
                <List.Item>
                  Close Callbacks Queue: close Callbacks, e.g. socket.on('close',
                  ...).
                </List.Item>
              </List.Root>
              <br />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onMacroTaskQueueAboutDialogClose}
                >
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={onMacroTaskQueueAboutDialogClose}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MacroTaskQueueAboutDialog;