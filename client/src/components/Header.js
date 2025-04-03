/* @flow */
import Typography from '@material-ui/core/Typography';
import React from 'react';
import JavaScriptLogo from '../assets/nodejs.svg';



const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeLogo: {
    width: 80,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 15,
    marginLeft: 15,
    cursor: 'pointer',
  },
}

const Header = ({
  onClickLogo,
}: {|
  onClickLogo: void => any,
|}) => (
  <div style={styles.container}>
    <img
      style={styles.nodeLogo}
      src={JavaScriptLogo}
      alt=""
      onClick={onClickLogo}
    />
    <Typography variant="h5" color="inherit">
      Node.js EventLoop Visualizer
    </Typography>
  </div>
);

export default Header;
