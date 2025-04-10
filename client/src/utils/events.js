/* @flow */
import _ from 'lodash';
import axios from "axios";

const URL = process.env.NODE_ENV === 'production'
  ? 'wss://node-eventloop-visualizer-server.onrender.com'
  : 'ws://localhost:8090';

const HTTP_URL =
  process.env.NODE_ENV === "production"
    ? "http://node-eventloop-visualizer-server.onrender.com"
    : "http://localhost:8090";

export const sendCode = (code: string) => {
  const body = { type: "RunCode", payload: code };
  return axios.post(`${HTTP_URL}/execute-code`, body);
}

export const fetchEventsForCode = (code: string) =>
  new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(URL);

      ws.addEventListener('open', (event) => {
        const command = { type: 'RunCode', payload: code };
        ws.send(JSON.stringify(command))
      });

      ws.addEventListener('message', (event) => {
        const events = JSON.parse(event.data);

        console.log('Events:', events);

        const didError = !events || !events[0] || events[0].type === 'UncaughtError';

        if (didError) {
          const msg = _.get(events[0], 'payload.error.name') === 'SyntaxError'
            ? 'Failed to run script due to syntax error.'
            : 'Failed to run script.';
          reject(new Error(msg));
        } else {
          resolve(events);
        }

        ws.close();
      });
    } catch (e) {
      reject({ ...e, message: `Failed to connect to backend: ${e.message}` });
    }
  });
