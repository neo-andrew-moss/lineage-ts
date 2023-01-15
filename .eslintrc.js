module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: "xo",
  overrides: [
    {
      extends: ["xo-typescript"],
      files: ["*.ts", "*.tsx"],
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-unsafe-assignment": 0,
    "new-cap": 0,
  },
};
