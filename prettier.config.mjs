/** @type {import("prettier").Config} */

const config = {
  endOfLine: 'lf',
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 80,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
