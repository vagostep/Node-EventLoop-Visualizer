export interface EventResponse {
  type: string;
  payload: EventPayload;
  metrics: EventMetrics;
}

export interface EventRequest {
  type: string;
  payload: string;
}

export interface EventPayload {
  source: string;
  name: string;
  funcId: string;
  start: string;
  end: string;
  message: string;
}

export interface EventMetrics {
  loopCount: string;
  loopEvents: string;
  loopEventsWaiting: string;
}

export interface Event {
  type: string;
  payload: EventPayload;
  metrics: EventMetrics;
}

export interface Marker {
  start: string;
  end: string;
}