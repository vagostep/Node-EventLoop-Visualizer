/* @flow */
import React from "react";

import { MuiThemeProvider, withStyles } from "@material-ui/core";
import { createTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";

const blueTheme = createTheme({
  palette: { primary: blue },
  typography: {
    fontSize: 16,
    useNextVariants: true,
  },
});

const styles = (theme) => ({
  terminalContainer: {
    backgroundColor: "#772953",
    "box-sizing": "border-box",
    width: "100%",
    maxWidth: "300",
    margin: theme.spacing.unit,
    height: "100%",
    borderRadius: "8px",
    fontFamily: "monospace",
    overflowY: "auto",
  },
  terminal: {
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    margin: "12px",
  },
  outputLine: {
    margin: "0",
    color: "white",
  },
  terminalPrompt: {
    color: "#33FF00",
    margin: "2px",
  },
  topBar: {
    backgroundColor: "#555", // Color gris para la barra de título
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    borderTopLeftRadius: "8px", // Bordes redondeados
    borderTopRightRadius: "8px", // Bordes redondeados
  },
  title: {
    color: "#ffffff", // Color del título
    fontWeight: "bold", // Peso del texto
  },
  topBarTextContent: {
    width: "100%",
    textAlign: "center",
  },
  buttons: {
    display: "flex",
    gap: "8px", // Espaciado entre los botones
  },
  button: {
    width: "15px",
    height: "15px",
    backgroundColor: "#ff605c", // Botón de cerrar
    borderRadius: "50%",
    cursor: "pointer",
  },
});

const Terminal = ({ outputs, classes, mode }) => (
  <div className={classes.terminalContainer}>
    <div className={classes.topBar}>
      <div className={classes.topBarTextContent}>
        <div className={classes.title}>user@desktop:~</div>
      </div>
      <div className={classes.buttons}>
        <div
          className={classes.button}
          style={{ backgroundColor: "#ff605c" }}
        />{" "}
        {}
        <div
          className={classes.button}
          style={{ backgroundColor: "#ffbd44" }}
        />{" "}
        {}
        <div
          className={classes.button}
          style={{ backgroundColor: "#00ca4e" }}
        />{" "}
        {}
      </div>
    </div>
    <MuiThemeProvider theme={blueTheme}>
      <div className={classes.terminal}>
        {mode == 'visualizing' && (
          <div>
            <p className={classes.terminalPrompt}>
              user@desktop:~{" "}
              <span style={{ color: "white" }}>node file.js</span>
            </p>
            {outputs?.map((output, index) => (
              <p key={index} className={classes.outputLine}>
                {output}
              </p>
            ))}
          </div>
        )}
      </div>
    </MuiThemeProvider>
  </div>
);

export default withStyles(styles)(Terminal);
