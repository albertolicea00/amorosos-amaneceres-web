export default [
  {
    ignores: ["assets/**", "public/**", "book/**", "i18n/**"],
  },
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        location: "readonly",
        navigator: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        requestAnimationFrame: "readonly",
        IntersectionObserver: "readonly",
        URLSearchParams: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-console": "warn",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
      "no-trailing-spaces": "error",
    },
  },
];
