import { Button, CloseButton, Dialog, Link, List, Portal, Text } from "@chakra-ui/react";

export interface MetricsAboutDialogProps {
  onMetricsAboutDialogClose: () => void
}
const MetricsAboutDialog: React.FC<MetricsAboutDialogProps> = ({
  onMetricsAboutDialogClose,
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
                  Performance Metrics!
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
                  href="https://nodejs.org/api/perf_hooks.html"
                >
                  Performance Hook
                </Link>{" "}
                module in Node.js provides an API to measure the performance of different parts of a Node.js application with high precision. 
                It allows developers to track the timing of function execution, measure performance bottlenecks, and gather detailed runtime metrics similar to what a browser’s 
                performance API offers. 
              </p>
              <p>
                The {" "}
                <Link
                  color="#339933"
                  _hover={{ color: "#66cc33", textDecoration: "none" }}
                  target="_blank"
                  href="https://nodejs.org/api/perf_hooks.html#performancenodetiminguvmetricsinfo"
                >
                  performanceNodeTiming.uvMetricsInfo
                </Link>{" "} property specifically provides low-level metrics from Node.js's underlying libuv library.
              </p>
              <br />
              <Text textStyle="2xl" textAlign="left" fontWeight="bold">
                Metrics
              </Text>
              <br />
              <List.Root>
                <List.Item>
                  Loop Count: Number of event loop iterations..
                </List.Item>
                <List.Item>
                  Events: Number of events that have been processed by the event handler.
                </List.Item>
                <List.Item>
                  Events Waiting: Number of events that were waiting to be processed when the event provider was called.
                </List.Item>
              </List.Root>
              <br />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onMetricsAboutDialogClose}>
                  Close
                </Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onMetricsAboutDialogClose} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default MetricsAboutDialog;