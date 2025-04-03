/* @flow */
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';



const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit,
  },
});

const Attribution = ({ classes }: {| classes: any |}) => (
  <Typography
    variant="body1"
    color="inherit"
    className={classes.root}
    align="center"
  >
    By {' '}
    <Link
      variant="body1"
      color="secondary"
      href="https://github.com/vagostep"
      target="_blank"
      rel="noreferrer"
    >
      vagostep {' '}
    </Link>
     based on work from {' '}
     <Link
      variant="body1"
      color="secondary"
      href="https://github.com/PhakornKiong"
      target="_blank"
      rel="noreferrer"
    >
      PK {' '}
    </Link>
    &  {' '}
    <Link
      variant="body1"
      color="secondary"
      href="https://github.com/Hopding/"
      target="_blank"
      rel="noreferrer"
    >
      Andrew Dillon {' '}
    </Link>
    &  {' '}
    <Link
      variant="body1"
      color="secondary"
      href="http://latentflip.com/loupe/"
      target="_blank"
      rel="noreferrer"
    >
      Loupe
    </Link>
    .
  </Typography>
);

export default withStyles(styles)(Attribution);
