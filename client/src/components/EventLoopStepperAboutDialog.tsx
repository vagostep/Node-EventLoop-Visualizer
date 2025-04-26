import { Button, CloseButton, Dialog, Link, List, Portal, Text } from "@chakra-ui/react";

export interface EventLoopStepperAboutDialogProps {
  onEventLoopStepperAboutDialogClose: () => void
}
const EventLoopStepperAboutDialog: React.FC<EventLoopStepperAboutDialogProps> = ({
  onEventLoopStepperAboutDialogClose,
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
                  Node.js Event Loop!
                </Text>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <p>
                The{" "}
                <Link
                  color="#339933"
                  _hover={{ color: "#66cc33", textDecoration: "none" }}
                  target="_blank"
                  href="https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick#what-is-the-event-loop"
                >
                  Event Loop
                </Link>{" "}
                is what allows Node.js to perform non-blocking I/O operations —
                despite the fact that a single JavaScript thread is used by
                default — by offloading operations to the system kernel whenever
                possible. Since most modern kernels are multi-threaded, they can
                handle multiple operations executing in the background. When one
                of these operations completes, the kernel tells Node.js so that
                the appropriate callback may be added to the poll queue to
                eventually be executed. We'll explain this in further detail
                later in this topic.
              </p>
              <br />
              <p>
                Each phase in the Node.js Event Loop has its own queue, and
                Node.js processes one phase at a time in a continuous loop.
              </p>
              <br />
              <Text textStyle="2xl" textAlign="left" fontWeight="bold">
                Phases in Detail
              </Text>
              <br />
              <List.Root>
                <List.Item>
                  <strong>Timers:</strong> A timer specifies the threshold after
                  which a provided callback may be executed rather than the
                  exact time a person wants it to be executed. Timers callbacks
                  will run as early as they can be scheduled after the specified
                  amount of time has passed; however, Operating System
                  scheduling or the running of other callbacks may delay them.
                </List.Item>
                <br />
                <List.Item>
                  <strong>Pending Callbacks</strong>: This phase executes
                  callbacks for some system operations such as types of TCP
                  errors. For example if a TCP socket receives ECONNREFUSED when
                  attempting to connect, some *nix systems want to wait to
                  report the error. This will be queued to execute in the
                  pending callbacks phase.
                </List.Item>
                <br />
                <List.Item>Idle, Prepare: only used internally.</List.Item>
                <br />
                <List.Item>
                  Poll: The poll phase has two main functions:
                  <br />
                  <List.Root>
                    <List.Item marginLeft="16px">
                      Calculating how long it should block and poll for I/O,
                      then
                    </List.Item>
                    <List.Item marginLeft="16px">
                      Processing events in the poll queue.
                    </List.Item>
                  </List.Root>
                  <br />
                  When the event loop enters the poll phase and there are no
                  timers scheduled, one of two things will happen:
                  <br />
                  <List.Root>
                    <List.Item marginLeft="16px">
                      If the poll queue is not empty, the event loop will
                      iterate through its queue of callbacks executing them
                      synchronously until either the queue has been exhausted,
                      or the system-dependent hard limit is reached.
                    </List.Item>
                    <br />
                    <List.Item marginLeft="16px">
                      If the poll queue is empty, one of two more things will
                      happen:
                      <List.Root>
                        <List.Item marginLeft="32px">
                          If scripts have been scheduled by setImmediate(), the
                          event loop will end the poll phase and continue to the
                          check phase to execute those scheduled scripts.
                        </List.Item>
                        <List.Item marginLeft="32px">
                          If scripts have not been scheduled by setImmediate(),
                          the event loop will wait for callbacks to be added to
                          the queue, then execute them immediately.
                        </List.Item>
                      </List.Root>
                    </List.Item>
                  </List.Root>
                  <br />
                  Once the poll queue is empty the event loop will check for
                  timers whose time thresholds have been reached. If one or more
                  timers are ready, the event loop will wrap back to the timers
                  phase to execute those timers' callbacks.
                </List.Item>
                <br />
                <List.Item>
                  Check: This phase allows the event loop to execute callbacks
                  immediately after the poll phase has completed. If the poll
                  phase becomes idle and scripts have been queued with
                  setImmediate(), the event loop may continue to the check phase
                  rather than waiting. setImmediate() is actually a special
                  timer that runs in a separate phase of the event loop. It uses
                  a libuv API that schedules callbacks to execute after the poll
                  phase has completed.
                </List.Item>
                <br />
                <List.Item>
                  Close Callbacks: If a socket or handle is closed abruptly
                  (e.g. socket.destroy()), the 'close' event will be emitted in
                  this phase. Otherwise it will be emitted via
                  process.nextTick().
                </List.Item>
              </List.Root>
              <br />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onEventLoopStepperAboutDialogClose}
                >
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton
                size="sm"
                onClick={onEventLoopStepperAboutDialogClose}
              />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default EventLoopStepperAboutDialog;