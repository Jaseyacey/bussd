import { init, setUserId, track } from '@amplitude/analytics-react-native';

let isInitialized = false;

export const initAmplitude = async (apiKey: string) => {
  if (!isInitialized) {
    await init(apiKey);
    isInitialized = true;
  }
};

export const setAmplitudeUserId = (userId: string) => {
  setUserId(userId);
};

export const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
  track(eventName, eventProperties);
};