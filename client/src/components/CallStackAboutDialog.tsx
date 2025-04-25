import { Button, CloseButton, Dialog, Link, List, Portal, Text } from "@chakra-ui/react";

export interface CallStackAboutDialogProps {
  onCallStackAboutDialogClose: () => void
}
const CallStackAboutDialog: React.FC<CallStackAboutDialogProps> = ({
  onCallStackAboutDialogClose,
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
                  Call Stack!
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
                  href="https://www.geeksforgeeks.org/what-is-the-call-stack-in-javascript/"
                >
                  Call Stack
                </Link>{" "}
                is a crucial concept in JavaScript’s runtime environment,
                representing the mechanism by which the JavaScript engine keeps
                track of function calls in a program. It operates as a Last In,
                First Out (LIFO) data structure, meaning that the last function
                called is the first one to be resolved.
              </p>
              <br />
              <Text textStyle="2xl" textAlign="left" fontWeight="bold">
                How It Works?
              </Text>
              <br />
              <List.Root>
                <List.Item>
                  When a function is called, it’s placed (“pushed”) onto the top
                  of the call stack. Execution begins from there.
                </List.Item>
                <List.Item>
                  If that function calls another function, the new one is also
                  pushed onto the stack. This continues for any nested or
                  chained calls.
                </List.Item>
                <List.Item>
                  Once the function at the top finishes executing, it is removed
                  (“popped”) from the stack, and control returns to the function
                  below it.
                </List.Item>
                <List.Item>
                  If too many function calls are pushed without being popped —
                  for example, due to deep or infinite recursion — the stack
                  reaches its size limit and throws a "Maximum call stack size
                  exceeded" error.
                </List.Item>
                <List.Item>
                  While something is on the stack, Node.js cannot do anything
                  else — the event loop is paused until the call stack is empty.
                  This is why long-running synchronous code blocks your entire
                  app.
                </List.Item>
              </List.Root>
              <br />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onCallStackAboutDialogClose}>
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onCallStackAboutDialogClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CallStackAboutDialog;