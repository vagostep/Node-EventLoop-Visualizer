import Terminal from '@components/Terminal';
import './App.css'
import CodeEditor from './components/CodeEditor'
import { Box, Container, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react"
import QueueStack, { Frame } from '@components/QueueStack';
import Stepper, { Step } from '@components/Stepper';
import Attributions from '@components/Attributions';
import ExampleSelector from '@components/ExampleSelector';
import ActionButtons from '@components/ActionButtons';
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import CodeEditorButtons from '@components/CodeEditorButtons';
import { API_URL, COMMANDS, defaultCode } from './constants';
import { EventRequest, EventResponse, Event, Marker } from './interfaces';
import WelcomeDialog from '@components/WelcomeDialog';
import CallStackAboutDialog from '@components/CallStackAboutDialog';
import MicroTaskQueueAboutDialog from '@components/MicroTaskQueueAboutDialog';
import MacroTaskQueueAboutDialog from '@components/MacroTaskQueueAboutDialog';
import EventLoopStepperAboutDialog from '@components/EventLoopStepperAboutDialog';
import TicksAndRejectionsLoopStepperAboutDialog from '@components/TicksAndRejectionsLoopStepperAboutDialog';
import { Toaster, toaster } from "@components/ui/toaster";

const eventLoopSteps: Array<Step> = [
  {
    id: 0,
    name: "none",
  },
  {
    id: 1,
    name: "EventLoopStart",
    title: "Start",
    description: "NodeJs runs a new Event Loop.",
  },
  {
    id: 2,
    name: "EventLoopTimers",
    title: "Timers",
    description:
      "Executes callbacks scheduled with 'setTimeout' and 'setInterval'.",
  },
  {
    id: 3,
    name: "EventLoopPendingCallbacks",
    title: "Pending Callbacks",
    description: "Executes callbacks for completed I/O.",
  },
  {
    id: 4,
    name: "EventLoopIdlePrepare",
    title: "Idle - Prepare",
    description: "Executes preparation callbacks.",
  },
  {
    id: 5,
    name: "EventLoopPoll",
    title: "Poll",
    description: "Processes pending I/O events and waits for new events.",
  },
  {
    id: 6,
    name: "EventLoopCheck",
    title: "Check",
    description: "Executes callbacks from 'setImmediate'.",
  },
  {
    id: 7,
    name: "EventLoopCloseCallbacks",
    title: "Close Callbacks",
    description: "Executes callbacks emitted on 'close' events.",
  },
  {
    id: 8,
    name: "EventLoopFinish",
    title: "Finish",
    description: "Ends of current Event Loop.",
  },
  {
    id: 9,
    name: "EventLoopCompleted",
  },
];

const ticksAndRejectionsSteps: Array<Step> = [
  {
    id: 0,
    name: "none",
  },
  {
    id: 1,
    name: "TicksAndRejectionsStart",
    title: "Start",
    description: "",
  },
  {
    id: 2,
    name: "TicksAndRejectionsNextTick",
    title: "Next Tick",
    description: "Executes process.nextTick callbacks before Microtasks.",
  },
  {
    id: 3,
    name: "TicksAndRejectionsMicroTasks",
    title: "Micro Tasks",
    description:
      "Executes microtasks from the queue, including promise callbacks.",
  },
  {
    id: 4,
    name: "TicksAndRejectionsFinish",
    title: "Finish",
    description: "Executes preparation callbacks.",
  },
  {
    id: 5,
    name: "TicksAndRejectionsCompleted",
  },
];


function App() {

  const [code, setCode] = useState(defaultCode);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [macroTasks, setMacroTasks] = useState<Array<Frame>>([]);
  const [microTasks, setMicroTasks] = useState<Array<Frame>>([]);
  const [callStack, setCallStack] = useState<Array<Frame>>([]);
  const callStackRef = useRef(callStack);
  const [outputs, setOutputs] = useState<Array<string>>([]);
  const [markers, setMarkers] = useState<Array<Marker>>([]);
  const markersRef = useRef(markers);
  const [events, setEvents] = useState<Generator<Event>>();
  const [eventLoopActiveStep, setEventLoopActiveStep] = useState<string>("none");
  const [ticksAndRejectionsActiveStep, setTicksAndRejectionsActiveStep] = useState<string>("none");
  const intervalRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);
  const [isCallStackAboutDialogOpen, setIsCallStackAboutDialogOpen] = useState(false);
  const [isMicrotaskQueueAboutDialogOpen, setIsMicrotaskQueueAboutDialogOpen] =
    useState(false);
  const [isMacrotaskQueueAboutDialogOpen, setIsMacrotaskQueueAboutDialogOpen] =
    useState(false);
  const [
    isEventLoopStepperAboutDialogOpen,
    setIsEventLoopStepperAboutDialogOpen,
  ] = useState(false);
  const [
    isTicksAndRejectionsStepperAboutDialogOpen,
    setIsTicksAndRejectionsStepperAboutDialogOpen,
  ] = useState(false);

  useEffect(() => {
    callStackRef.current = callStack;
    markersRef.current = markers;
  }, [callStack, markers]);

  useEffect(() => {
    const hideDialog = localStorage.getItem("hideWelcomeDialog");

    if (hideDialog !== "true") {
      setIsWelcomeDialogOpen(true);
    }
  }, []);

  const onWelcomeDialogChecked = (checked: boolean) => {
    localStorage.setItem("hideWelcomeDialog", `${checked}`);
  };

  function* eventsIterator(eventsArray: Array<EventResponse>) {
    for (const event of eventsArray) {
      yield event;
    }
  }

  const onChangeCode = (newCode: string) => {
    setCode(newCode);
  }

  const onValueChange = (code: string | undefined) => {
    onChangeCode(code || "");
  }

  const onButtonEditClick = () => {
    resetState();
  }

  const resetState = () => {
    setCallStack([]);
    setMicroTasks([]);
    setMacroTasks([]);
    setEventLoopActiveStep("none");
    setTicksAndRejectionsActiveStep("none");
    setIsEditMode(true);
    setIsAutoPlay(false);
    setOutputs([]);
    setMarkers([]);
    setIsWelcomeDialogOpen(false);
    setIsCallStackAboutDialogOpen(false);
    if (isAutoPlay) {
      setIsAutoPlay(false);
      clearInterval(intervalRef.current);
    }
  }

  const onButtonRunClick = async () => {
    
    try {
      setIsLoading(true);
      setIsEditMode(false);
      const body = { type: COMMANDS.RUN_CODE, payload: code } as EventRequest;
      const { data } = await axios.post<Array<EventResponse>>(`${API_URL}/execute-code`, body);
      console.log(data);
      const iterator = eventsIterator(data);
      setEvents(iterator);
    } catch (error) {
      console.error("Error:", error);
      setIsEditMode(true);
    } finally {
      setIsLoading(false);
    }
  }

  const onPlayNextEvent = () => {
    const next = events?.next();
    if (next?.done) {
      resetState();
      return true;
    };

    if (!next) {
      return true;
    }
    
    const {
      type,
      payload: { start, message, end, name, funcId },
    } = next.value;
    console.log("onPlayNextEvent: ", next.value);
    switch (type) {
      case "ConsoleLog":
      case "ConsoleWarn": {
        setOutputs((prev) => [...prev, message]);
        break;
      }
      case "ConsoleError":
        break;
      case "ErrorFunction":
        break;
      case "EnterFunction": {
        setCallStack((prev) => [...prev, { name: name }]);
        setMarkers((prev) => [...prev, { start, end }]);
        break;
      }
      case "ExitFunction": {
        const updatedCallStack = callStackRef.current?.slice(
          0,
          callStackRef.current?.length - 1
        );
        const updatedMarkers = markersRef.current?.slice(
          0,
          markersRef.current?.length - 1
        );
        setCallStack(updatedCallStack);
        setMarkers(updatedMarkers);
        break;
      }
      case "EnqueueMicrotask": {
        const microTask = {
          id: funcId,
          name: name,
        };
        setMicroTasks((prev) => [...prev, microTask]);
        break;
      }
      case "DequeueMicrotask": {
        const id = funcId;
        const updatedMicrotasks = microTasks?.filter(
          (microTask) => microTask.id !== id
        );
        setMicroTasks(updatedMicrotasks);
        break;
      }
      case "EnqueueTask": {
        const macroTask = {
          id: funcId,
          name: name,
        };
        setMacroTasks((prev) => [...prev, macroTask]);
        break;
      }
      case "DequeueTask":
        {
          const id = funcId;
          const updatedMacrotasks = macroTasks?.filter(
            (microTask) => microTask.id !== id
          );
          setMacroTasks(updatedMacrotasks);
        }
        break;
      case "EventLoopStart":
      case "EventLoopTimers":
      case "EventLoopPendingCallbacks":
      case "EventLoopIdlePrepare":
      case "EventLoopPoll":
      case "EventLoopCheck":
      case "EventLoopCloseCallbacks": {
        setEventLoopActiveStep(type);
        break;
      }
      case "EventLoopFinish": {
        setEventLoopActiveStep(type);
        setEventLoopActiveStep("EventLoopCompleted");
        break;
      }
      case "TicksAndRejectionsStart":
      case "TicksAndRejectionsNextTick":
      case "TicksAndRejectionsMicroTasks":{
        setTicksAndRejectionsActiveStep(type);
        break;
      }
      case "TicksAndRejectionsFinish": {
        setTicksAndRejectionsActiveStep(type);
        setTicksAndRejectionsActiveStep("TicksAndRejectionsCompleted");
        break;
      }
      case "UncaughtError": {
        toaster.create({
          title: `${type}`,
          description: `${funcId}`,
          type: 'error',
          duration: 3000
        });
        break;
      }
      default:
        break;
    }
    return false;
  }

  const onAutoplayNextEvent = async (toggle: boolean) => {

    if (toggle) {
      setIsAutoPlay(true);
      intervalRef.current = setInterval(() => {
        const isCompleted = onPlayNextEvent();

        if (isCompleted) {
          setIsAutoPlay(false);
          clearInterval(intervalRef.current);
        }
      }, 1000);
    } else {
      setIsAutoPlay(false);
      clearInterval(intervalRef.current);
    }
  }

  const onAboutClick = (name: string) => {

    switch (name) {
      case "callstack":
        setIsCallStackAboutDialogOpen(true);
        break;
      case "microtaskqueue":
        setIsMicrotaskQueueAboutDialogOpen(true);
        break;
      case "macrotaskqueue":
        setIsMacrotaskQueueAboutDialogOpen(true);
        break;
      case "eventloop":
        setIsEventLoopStepperAboutDialogOpen(true);
        break;
      case "ticksandrejectionsloop":
        setIsTicksAndRejectionsStepperAboutDialogOpen(true);
        break
      default:
        break;
    }
  };

  return (
    <Container padding="16px">
      {isWelcomeDialogOpen && (
        <WelcomeDialog
          onWelcomeDialogChecked={onWelcomeDialogChecked}
          onWelcomeDialogClose={() => setIsWelcomeDialogOpen(false)}
        ></WelcomeDialog>
      )}
      {isCallStackAboutDialogOpen && (
        <CallStackAboutDialog
          onCallStackAboutDialogClose={() =>
            setIsCallStackAboutDialogOpen(false)
          }
        ></CallStackAboutDialog>
      )}
      {isMicrotaskQueueAboutDialogOpen && (
        <MicroTaskQueueAboutDialog
          onMicroTaskQueueAboutDialogClose={() => {
            setIsMicrotaskQueueAboutDialogOpen(false);
          }}
        ></MicroTaskQueueAboutDialog>
      )}
      {isMacrotaskQueueAboutDialogOpen && (
        <MacroTaskQueueAboutDialog
          onMacroTaskQueueAboutDialogClose={() => {
            setIsMacrotaskQueueAboutDialogOpen(false);
          }}
        ></MacroTaskQueueAboutDialog>
      )}
      {isEventLoopStepperAboutDialogOpen && (
        <EventLoopStepperAboutDialog
          onEventLoopStepperAboutDialogClose={() => {
            setIsEventLoopStepperAboutDialogOpen(false);
          }}
        ></EventLoopStepperAboutDialog>
      )}
      {isTicksAndRejectionsStepperAboutDialogOpen && (
        <TicksAndRejectionsLoopStepperAboutDialog
          onTicksAndRejectionsLoopStepperAboutDialogClose={() => {
            setIsTicksAndRejectionsStepperAboutDialogOpen(false);
          }}
        ></TicksAndRejectionsLoopStepperAboutDialog>
      )}
      <Toaster />
      <Grid
        templateColumns={{ base: "1fr", lg: "35% 65%" }}
        templateRows={{ base: "100vh 100vh", lg: "1fr" }}
        height={{ base: "auto", lg: "92vh" }}
        gap={4}
      >
        <GridItem
          colSpan={1}
          display="grid"
          gridTemplateRows={{
            base: "8% 8% 5% 40% 30%",
            lg: "6% 3% 5% 47% 32%",
          }}
          gap={4}
        >
          <Box width="100%" padding="16px">
            <Flex
              justifyContent={{ base: "flex-start", sm: "space-around" }}
              alignItems="center"
              gap={{ base: "4", sm: "0" }}
            >
              <Image
                src={`${import.meta.env.VITE_BASE_URL}/light.svg`}
                height="50px"
                width="80px"
              />
              <Text textStyle={{ base: "xl", lg: "2xl" }} textAlign="center">
                Event Loop Visualizer{" "}
              </Text>
            </Flex>
          </Box>

          <Box>
            <Attributions></Attributions>
          </Box>
          <Box width="100%">
            <Flex justifyContent="space-between">
              <ExampleSelector
                onValueChange={onValueChange}
                disabled={!isEditMode}
              ></ExampleSelector>
              <CodeEditorButtons
                isEditMode={isEditMode}
                isLoading={isLoading}
                onButtonEditClick={onButtonEditClick}
                onButtonRunClick={onButtonRunClick}
              ></CodeEditorButtons>
            </Flex>
          </Box>
          <Box display="flex" alignItems="center" width="100%">
            <CodeEditor
              code={code}
              isEditMode={isEditMode}
              onChangeCode={onChangeCode}
              markers={markers}
            ></CodeEditor>
          </Box>
          <Box width="100%">
            <Terminal
              outputs={outputs}
              isRunning={!isLoading && !isEditMode}
            ></Terminal>
          </Box>
        </GridItem>
        <GridItem
          colSpan={1}
          display="grid"
          gridTemplateRows={{ base: "30% 100%", lg: "30% 68%" }}
          gap={4}
        >
          <Box width="100%">
            <Flex direction="column" height="100%" gap={4}>
              <Box width={{ base: "100%", lg: "94.5%" }} height="100%">
                <QueueStack
                  orientation="horizontal"
                  title="Macrotask Queue"
                  frames={macroTasks}
                  onAboutClick={() => onAboutClick("macrotaskqueue")}
                ></QueueStack>
              </Box>
              <Box width={{ base: "100%", lg: "94.5%" }} height="100%">
                <QueueStack
                  orientation="horizontal"
                  title="Microtask Queue"
                  frames={microTasks}
                  onAboutClick={() => onAboutClick("microtaskqueue")}
                ></QueueStack>
              </Box>
            </Flex>
          </Box>
          <Box width="100%">
            <Flex
              direction={{ base: "column", lg: "row" }}
              height="100%"
              gap={4}
            >
              <Box
                width={{ base: "100%", lg: "30%" }}
                height="100%"
                maxHeight={{ base: "100%", lg: "65vh" }}
                minHeight={{ base: "15%", lg: "100%" }}
              >
                <QueueStack
                  orientation="vertical"
                  title="Call Stack"
                  frames={callStack}
                  onAboutClick={() => onAboutClick("callstack")}
                ></QueueStack>
              </Box>
              <Box
                width={{ base: "100%", lg: "30%" }}
                height="100%"
                maxHeight={{ base: "100%", lg: "65vh" }}
              >
                <Stepper
                  title="Event Loop"
                  steps={eventLoopSteps}
                  activeStep={eventLoopActiveStep}
                  onAboutClick={() => onAboutClick("eventloop")}
                ></Stepper>
              </Box>
              <Box
                width={{ base: "100%", lg: "30%" }}
                height="100%"
                maxHeight={{ base: "100%", lg: "65vh" }}
              >
                <Stepper
                  title="Ticks & Rejections"
                  steps={ticksAndRejectionsSteps}
                  activeStep={ticksAndRejectionsActiveStep}
                  onAboutClick={() => onAboutClick("ticksandrejectionsloop")}
                ></Stepper>
              </Box>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
      {!isEditMode && !isLoading ? (
        <ActionButtons
          onPlayNextEvent={onPlayNextEvent}
          onAutoplayNextEvent={onAutoplayNextEvent}
          isAutoPlay={isAutoPlay}
        ></ActionButtons>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default App


//<ColorModeButton />