/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-undef': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-v-on-native-modifier': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        semi: false,
        singleQuote: true,
        trailingComma: 'none',
        bracketSpacing: false,
        arrowParens: 'avoid',
        jsxBracketSameLine: true,
        endOfLine: 'lf',
        htmlWhitespaceSensitivity: 'ignore'
      }
    ]
  }
}
