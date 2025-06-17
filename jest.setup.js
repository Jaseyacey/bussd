jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

jest.mock("expo-tracking-transparency", () => ({
  requestTrackingPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: "granted" }),
  getTrackingPermissionsAsync: jest.fn(),
}));
