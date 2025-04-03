/* @flow */
import React from 'react';
import uuid from 'uuid/v4';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

import CardHeaderWithoutAbout from './CardHeaderWithoutAbout';

const blueTheme = createTheme({
  palette: { primary: blue },
  typography: {
    fontSize: 16,
    useNextVariants: true,
  },
});

const styles = theme => ({
  card: {
    margin: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.main,
    flex: 1,
    maxWidth: 300,
    overflowY: 'hidden',
  },
  stepper: {
    backgroundColor: 'transparent',
  },
});

const stepTitles = [
  'Start',
  'Timers',
  'Pending Callbacks',
  'Idle - Prepare',
  'Poll',
  'Check',
  'Close Callbacks',
  'Finish',
];

const stepDescriptions = [
  'NodeJs runs a new Event Loop.',
  "Executes callbacks scheduled with 'setTimeout' and 'setInterval'.",
  "Executes callbacks for completed I/O.",
  "Executes preparation callbacks.",
  "Processes pending I/O events and waits for new events.",
  "Executes callbacks from 'setImmediate'.",
  "Executes callbacks emitted on 'close' events.",
  'Ends of current Event Loop.',
];

const idxForStep = {
  "none": -1,
  "EventLoopStart": 0,
  "EventLoopTimers": 1,
  "EventLoopPendingCallbacks": 2,
  "EventLoopIdlePrepare": 3,
  "EventLoopPoll": 4,
  "EventLoopCheck": 5,
  "EventLoopCloseCallbacks": 6,
  "EventLoopFinish": 7,
};

const EventLoopStepper = ({
  step,
  classes,
  onClickAbout,
}: {
  classes: any,
  step: 'none' | 'EventLoopStart' | 'EventLoopTimers' | 'EventLoopPendingCallbacks' | 'EventLoopIdlePrepare' | 'EventLoopPoll' | 'EventLoopCheck' | 'EventLoopCloseCallbacks' | 'EventLoopFinish',
  onClickAbout: void => any,
}) => (
  <Card className={classes.card}>
    <CardContent>
      <CardHeaderWithoutAbout title="Event Loop"/>
      <MuiThemeProvider theme={blueTheme}>
        <Stepper
          activeStep={idxForStep[step]}
          orientation="vertical"
          className={classes.stepper}
        >
          {stepTitles.map((title, idx) => (
            <Step key={uuid()} completed={idx < idxForStep[step]}>
              <StepLabel>
                <Typography
                  style={{ fontWeight: idx === idxForStep[step] ? 'bold' : 'normal' }}
                >
                  {title}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography>{stepDescriptions[idx]}</Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </MuiThemeProvider>
    </CardContent>
  </Card>
);

export default withStyles(styles)(EventLoopStepper);
