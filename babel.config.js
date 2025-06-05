module.exports = {
  presets: [
    [
      "module:metro-react-native-babel-preset",
      {
        enableHermes: true,
        unstable_transformProfile: "hermes-stable",
      },
    ],
  ],
  plugins: [
    ["@babel/plugin-transform-flow-strip-types"],
    ["@babel/plugin-transform-private-methods", { loose: false }],
    ["@babel/plugin-transform-class-properties", { loose: false }],
    ["@babel/plugin-transform-private-property-in-object", { loose: false }],
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@components": "./src/components",
          "@screens": "./screens",
          "@utils": "./src/utils",
        },
      },
    ],
  ],
  env: {
    production: {
      plugins: ["transform-remove-console"],
    },
  },
};
