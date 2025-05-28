module.exports = {
  presets: [
    "module:metro-react-native-babel-preset",
    [
      "@babel/preset-typescript",
      { allowDeclareFields: true, onlyRemoveTypeImports: true },
    ],
  ],
  plugins: ["@babel/plugin-transform-flow-strip-types"],
};
