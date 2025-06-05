module.exports = {
  presets: [
    [
      "module:metro-react-native-babel-preset",
      {
        enableHermes: true,
        unstable_transformProfile: "hermes-stable",
      },
    ],
    [
      "@babel/preset-typescript",
      { allowDeclareFields: true, onlyRemoveTypeImports: true },
    ],
  ],
  plugins: [
    ["@babel/plugin-transform-flow-strip-types"],
    ["@babel/plugin-transform-private-methods", { loose: false }],
    ["@babel/plugin-transform-class-properties", { loose: false }],
    ["@babel/plugin-transform-private-property-in-object", { loose: false }],
  ],
  env: {
    production: {
      plugins: ["transform-remove-console"],
    },
  },
};
