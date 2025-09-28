export const API_URL = import.meta.env.VITE_API_URL;

export const defaultCode = 
`// Write here your code
// Or select one example`;

export const COMMANDS = Object.freeze({
  RUN_CODE: "RunCode"
});

export const DELAY_TIME = 500;

export enum UI_QUEUE_SIZES {
    MOBILE = 2,
    LANDSCAPE = 4,
    DESKTOP = 9
}

export enum MODULETYPES {
  COMMONJS = "commonjs",
  ESM = "esm"
}
