import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      // Disallow the use of variables before they are defined
      'no-use-before-define': [
        'error',
        { functions: false, classes: true, variables: true },
      ],
    },
  },
];
