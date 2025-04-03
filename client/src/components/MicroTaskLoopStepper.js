/* @flow */
import React from 'react';

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
  'Next Tick',
  'Micro Tasks',
];

const stepDescriptions = [
  'Node.js executes process.nextTick callbacks before microtasks.',
  'Node.js executes microtasks from the queue, including promise callbacks.',
];

const idxForStep = {
  "none": -1,
  "EndProcessTicksAndRejections": -1,
  "NextTick": 0,
  "MicroTasks": 1,
};

const MicroTaskLoopStepper = ({
  step,
  classes,
  onClickAbout,
}: {
  classes: any,
  step: 'EndProcessTicksAndRejections' | 'NextTick' | 'MicroTasks',
  onClickAbout: void => any,
}) => (
  <Card className={classes.card}>
    <CardContent>
      <CardHeaderWithoutAbout title="Ticks & Rejections"/>
      <MuiThemeProvider theme={blueTheme}>
        <Stepper
          activeStep={idxForStep[step]}
          orientation="vertical"
          className={classes.stepper}
        >
          {stepTitles.map((title, idx) => (
            <Step key={title} completed={idx < idxForStep[step]}>
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

export default withStyles(styles)(MicroTaskLoopStepper);
