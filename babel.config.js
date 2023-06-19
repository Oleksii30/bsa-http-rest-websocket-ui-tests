const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        firefox: "60",
        chrome: "67"
      }
    }
  ]
];

const plugins = ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"];

module.exports = {
  presets,
  plugins
};