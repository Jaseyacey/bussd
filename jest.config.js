module.exports = {
  preset: "react-native",
  setupFiles: ["<rootDir>/jest.setup.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-expo|react-native|@react-native|expo(nent)?|@expo(nent)?|@react-navigation|react-native-vector-icons|@rneui)/)",
  ],
};
