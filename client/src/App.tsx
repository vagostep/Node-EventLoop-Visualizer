import Terminal from '@components/Terminal';
import './App.css'
import CodeEditor from './components/CodeEditor'
import { Container, Grid, useBreakpointValue } from "@chakra-ui/react"
import QueueStack, { Frame } from '@components/QueueStack';
import Stepper, { Step } from '@components/Stepper';
import Attributions from '@components/Attributions';
import ActionButtons from '@components/ActionButtons';
import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { API_URL, COMMANDS, defaultCode, DELAY_TIME } from './constants';
import { EventRequest, EventResponse, Event, Marker, EventMetrics } from './interfaces';
import WelcomeDialog from '@components/WelcomeDialog';
import CallStackAboutDialog from '@components/CallStackAboutDialog';
import MicroTaskQueueAboutDialog from '@components/MicroTaskQueueAboutDialog';
import MacroTaskQueueAboutDialog from '@components/MacroTaskQueueAboutDialog';
import EventLoopStepperAboutDialog from '@components/EventLoopStepperAboutDialog';
import TicksAndRejectionsLoopStepperAboutDialog from '@components/TicksAndRejectionsLoopStepperAboutDialog';
import { Toaster, toaster } from "@components/ui/toaster";
import Branding from '@components/Branding';
import ExampleController from '@components/ExampleController';
import Metrics from '@components/Metrics';
import { delay } from '@utils/delay';

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

  const isMobile = useBreakpointValue({ base: true, sm: false });

  const callStackComponentRef = useRef<HTMLDivElement>(null);
  const terminalComponentRef = useRef<HTMLDivElement>(null);
  const microTaskQueueComponentRef = useRef<HTMLDivElement>(null);
  const macroTaskQueueComponentRef = useRef<HTMLDivElement>(null);
  const eventLoopComponentRef = useRef<HTMLDivElement>(null);
  const ticksAndRejectionsLoopComponentRef = useRef<HTMLDivElement>(null);
  const brandingComponentRef = useRef<HTMLDivElement>(null);

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
  const [metrics, setMetrics] = useState<EventMetrics>({
    loopCount: "0",
    loopEvents: "0",
    loopEventsWaiting: "0"
  });
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

  const onExampleSelectorValueChange = (code: string | undefined) => {
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
    setMetrics({
      loopCount: "0",
      loopEvents: "0",
      loopEventsWaiting: "0"
    })
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

  const onPlayNextEvent = async () => {
    const next = events?.next();
    if (next?.done) {
      resetState();
      isAutoPlay && await delay(DELAY_TIME);
      brandingComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      brandingComponentRef.current?.focus();
      return true;
    };

    if (!next) {
      return true;
    }

    const enterFunctionHandler = async () => {
      if (isMobile) {
        isAutoPlay && await delay(DELAY_TIME);
        callStackComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        callStackComponentRef.current?.focus();
        isAutoPlay && await delay(DELAY_TIME);
      }      
      setCallStack((prev) => [...prev, { name: name }]);

      setMarkers((prev) => [...prev, { start, end }]);
    }

    const exitFunctionHandler = async () => {
      if (isMobile) {
        isAutoPlay && await delay(DELAY_TIME);
        callStackComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        callStackComponentRef.current?.focus();
        isAutoPlay && await delay(DELAY_TIME);
      }      
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
    }

    const enqueueMicrotaskHandler = async () => {
      if (isMobile) {
        isAutoPlay && await delay(DELAY_TIME);
        microTaskQueueComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        microTaskQueueComponentRef.current?.focus();
        isAutoPlay && await delay(DELAY_TIME);
      }      
      const microTask = {
        id: funcId,
        name: name,
      };
      setMicroTasks((prev) => [...prev, microTask]);
    }

    const dequeueMicrotaskHandler = async () => {
      if (isMobile) {
        isAutoPlay && await delay(DELAY_TIME);
        microTaskQueueComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        microTaskQueueComponentRef.current?.focus();
        isAutoPlay && await delay(DELAY_TIME);
      }      
      const id = funcId;
      const updatedMicrotasks = microTasks?.filter(
        (microTask) => microTask.id !== id
      );
      setMicroTasks(updatedMicrotasks);
    }

    const enqueueMacrotaskHandler = async () => {
      if (isMobile) {
        isAutoPlay && await delay(DELAY_TIME);
        macroTaskQueueComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        macroTaskQueueComponentRef.current?.focus();
        isAutoPlay && await delay(DELAY_TIME);
      }      
      const macroTask = {
        id: funcId,
        name: name,
      };
      setMacroTasks((prev) => [...prev, macroTask]);
    }

    const dequeueMacrotaskHandler = async () => {
      if (isMobile) {
        isAutoPlay && await delay(DELAY_TIME);
        macroTaskQueueComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        macroTaskQueueComponentRef.current?.focus();
        isAutoPlay && await delay(DELAY_TIME);
      }      
      const id = funcId;
      const updatedMacrotasks = macroTasks?.filter(
        (microTask) => microTask.id !== id
      );
      setMacroTasks(updatedMacrotasks);
    }

    const consoleHandler = async () => {
      if (isMobile) {
        isAutoPlay && await delay(DELAY_TIME);
        terminalComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        terminalComponentRef.current?.focus();
        isAutoPlay && await delay(DELAY_TIME);
      }
      setOutputs((prev) => [...prev, message]);
    }

    const eventLoopHandler = async (isCompleted: boolean = false) => {
      if (isMobile) {
        isAutoPlay && await delay(DELAY_TIME);
        eventLoopComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        eventLoopComponentRef.current?.focus();
        isAutoPlay && await delay(DELAY_TIME);
      }
      setEventLoopActiveStep(type);

      if (isCompleted) {
        setEventLoopActiveStep("EventLoopCompleted");
      }
    }

    const ticksAndRejectionsHandler = async (isCompleted: boolean = false) => {
      if (isMobile) {
        isAutoPlay && await delay(DELAY_TIME);
        ticksAndRejectionsLoopComponentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        ticksAndRejectionsLoopComponentRef.current?.focus();
        isAutoPlay && await delay(DELAY_TIME);
      }
      setTicksAndRejectionsActiveStep(type);

      if (isCompleted) {
        setTicksAndRejectionsActiveStep("TicksAndRejectionsCompleted");
      }
    }
    
    const {
      type,
      payload: { start, message, end, name, funcId },
      metrics
    } = next.value;
    console.log("onPlayNextEvent: ", next.value);
    switch (type) {
      case "ConsoleLog":
      case "ConsoleWarn": {
        consoleHandler();
        break;
      }
      case "ConsoleError":
        break;
      case "ErrorFunction":
        break;
      case "EnterFunction": {

        enterFunctionHandler();  
        break;
      }
      case "ExitFunction": {
        exitFunctionHandler();
        break;
      }
      case "EnqueueMicrotask": {
        enqueueMicrotaskHandler();
        break;
      }
      case "DequeueMicrotask": {
        dequeueMicrotaskHandler();
        break;
      }
      case "EnqueueTask": {
        enqueueMacrotaskHandler();
        break;
      }
      case "DequeueTask": {
        dequeueMacrotaskHandler();
        break;
      }        
      case "EventLoopStart":
      case "EventLoopTimers":
      case "EventLoopPendingCallbacks":
      case "EventLoopIdlePrepare":
      case "EventLoopPoll":
      case "EventLoopCheck":
      case "EventLoopCloseCallbacks": {
        eventLoopHandler(false);
        break;
      }
      case "EventLoopFinish": {
        eventLoopHandler(true)
        break;
      }
      case "TicksAndRejectionsStart":
      case "TicksAndRejectionsNextTick":
      case "TicksAndRejectionsMicroTasks":{
        ticksAndRejectionsHandler(false);
        break;
      }
      case "TicksAndRejectionsFinish": {
        ticksAndRejectionsHandler(true);
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

    if (metrics && Object.keys(metrics)?.length > 0) {
      setMetrics(metrics);
    }
    return false;
  }

  const onAutoplayNextEvent = async (toggle: boolean) => {

    if (toggle) {
      setIsAutoPlay(true);
      intervalRef.current = setInterval(async () => {
        const isCompleted = await onPlayNextEvent();

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
    <Container padding="16px" height="100vh">
      {isWelcomeDialogOpen && (
        <WelcomeDialog
          onWelcomeDialogChecked={onWelcomeDialogChecked}
          onWelcomeDialogClose={() => setIsWelcomeDialogOpen(false)}
        />
      )}
      {isCallStackAboutDialogOpen && (
        <CallStackAboutDialog
          onCallStackAboutDialogClose={() =>
            setIsCallStackAboutDialogOpen(false)
          }
        />
      )}
      {isMicrotaskQueueAboutDialogOpen && (
        <MicroTaskQueueAboutDialog
          onMicroTaskQueueAboutDialogClose={() => {
            setIsMicrotaskQueueAboutDialogOpen(false);
          }}
        />
      )}
      {isMacrotaskQueueAboutDialogOpen && (
        <MacroTaskQueueAboutDialog
          onMacroTaskQueueAboutDialogClose={() => {
            setIsMacrotaskQueueAboutDialogOpen(false);
          }}
        />
      )}
      {isEventLoopStepperAboutDialogOpen && (
        <EventLoopStepperAboutDialog
          onEventLoopStepperAboutDialogClose={() => {
            setIsEventLoopStepperAboutDialogOpen(false);
          }}
        />
      )}
      {isTicksAndRejectionsStepperAboutDialogOpen && (
        <TicksAndRejectionsLoopStepperAboutDialog
          onTicksAndRejectionsLoopStepperAboutDialogClose={() => {
            setIsTicksAndRejectionsStepperAboutDialogOpen(false);
          }}
        />
      )}
      <Toaster />
      <Grid templateColumns={{ base: "1fr", lg: "calc(35% - 8px) calc(65% - 8px)" }} height="100%" gap={4}>
        <Grid 
          templateRows={{ base: "6% 4% 5% 50% 31.4%", lg: "6% 4% 5% 50% 35%" }}
          height="calc(100vh - 64px)"
          gap={2}>
          <Branding ref={brandingComponentRef} />
          <Attributions />
          <ExampleController 
            onValueChange={onExampleSelectorValueChange}
            isEditMode={isEditMode}
            isLoading={isLoading}
            onButtonEditClick={onButtonEditClick}
            onButtonRunClick={onButtonRunClick}
          />
          <CodeEditor
            code={code}
            isEditMode={isEditMode}
            onChangeCode={onChangeCode}
            markers={markers}
          />
          <Terminal
            ref={terminalComponentRef}
            outputs={outputs}
            isRunning={!isLoading && !isEditMode}
          />
        </Grid>
        <Grid 
          templateRows={{ base: "50% 50%", lg: "30% 70%" }}
          height="calc(100vh - 36px)"
          gap={2}
        >
          <Grid 
            templateColumns={{ base: "none", lg: "calc(65% - 4px) calc(35% - 4px)" }}
            templateRows={{ base: "40% 60%", lg: "none" }}
            height={{ base: "calc(100% - 16px)", lg: "calc(100% - 4px)" }}
            flexDirection={{ base: "column", lg: "row" }}
            gap={{ base: 4, lg: 2 }}
          >
            <Grid
              templateRows="50% 50%"
              height="calc(100% - 8px)"
              gap={2}
              order={{ base: 2, lg: 1 }}
            >
              <QueueStack
                ref={macroTaskQueueComponentRef}
                orientation="horizontal"
                title="Macrotask Queue"
                frames={macroTasks}
                onAboutClick={() => onAboutClick("macrotaskqueue")}
              />
              <QueueStack
                ref={microTaskQueueComponentRef}
                orientation="horizontal"
                title="Microtask Queue"
                frames={microTasks}
                onAboutClick={() => onAboutClick("microtaskqueue")}
              />
            </Grid>
            <Grid height="100%" order={{ base: 1, lg: 2 }}>
              <Metrics onAboutClick={() => onAboutClick("metrics")} metrics={metrics}></Metrics>
            </Grid>
          </Grid>
          <Grid
            templateColumns={{ base: "none", lg: "repeat(3, 1fr)" }}
            templateRows={{ base: "28.223% auto auto", lg: "none" }}
            height="calc(100% - 4px)"
            gap={2}
          >
            <QueueStack
              ref={callStackComponentRef}
              orientation="vertical"
              title="Call Stack"
              frames={callStack}
              onAboutClick={() => onAboutClick("callstack")}
            />
            <Stepper
              ref={eventLoopComponentRef}
              title="Event Loop"
              steps={eventLoopSteps}
              activeStep={eventLoopActiveStep}
              onAboutClick={() => onAboutClick("eventloop")}
            />
            <Stepper
              ref={ticksAndRejectionsLoopComponentRef}
              title="Ticks & Rejections"
              steps={ticksAndRejectionsSteps}
              activeStep={ticksAndRejectionsActiveStep}
              onAboutClick={() => onAboutClick("ticksandrejectionsloop")}
            />
          </Grid>
        </Grid>
      </Grid>
      {!isEditMode && !isLoading ? (
        <ActionButtons
          onPlayNextEvent={onPlayNextEvent}
          onAutoplayNextEvent={onAutoplayNextEvent}
          isAutoPlay={isAutoPlay}
        />
      ) : (
        <></>
      )}
    </Container>
  );
}

export default App


//<ColorModeButton />