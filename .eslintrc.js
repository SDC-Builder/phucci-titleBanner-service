/**
 * These rules enforce the Hack Reactor Style Guide
 *
 * Visit this repo for more information:
 *   https://github.com/reactorcore/eslint-config-hackreactor
 */

// "parser": "babel-eslint"
/* eslint-disable one-var */
one-var-declaration-per-line: ["error", "initializations"]

module.exports = {
  extends: './node_modules/eslint-config-hackreactor/index.js',

  parserOptions: {
    ecmaVersion: 8
  }
};