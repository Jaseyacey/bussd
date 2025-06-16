import { init, track, identify } from '@amplitude/analytics-react-native';

export const initAmplitude = (apiKey: string) => {
  init(apiKey);
};

export const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  track(eventName, eventProperties);
};
