export const NativeModulesProxy = {};
export const requireNativeViewManager = () => {};
export const requireNativeModule = () => {};
export const Platform = { OS: "ios" };
export const UnavailabilityError = class extends Error {};
export const CodedError = class extends Error {};

export const EventEmitter = jest.fn(() => ({
  addListener: jest.fn(),
  removeListeners: jest.fn(),
}));

export const Subscription = jest.fn(() => ({
  remove: jest.fn(),
}));

export const SyntheticPlatformEmitter = {
  emit: jest.fn(),
};

export const createPermissionHook = jest.fn(() =>
  jest.fn(() => [null, jest.fn(), jest.fn()])
);
export const deprecate = jest.fn();
export const uuidv4 = jest.fn();

export const DeviceEventEmitter = {
  addListener: jest.fn().mockReturnValue({
    remove: jest.fn(),
  }),
  emit: jest.fn(),
  removeAllListeners: jest.fn(),
  removeListener: jest.fn(),
  removeSubscription: jest.fn(),
};

export const NativeModule = jest.fn();
