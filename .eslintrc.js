module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'import/no-cycle': 'warn',
    'import/no-restricted-paths': ['warn', {
      basePath: __dirname,
      zones: [
        {
          target: './src/shared',
          from: ['./src/app', './src/core', './src/modules'],
          message: 'Shared code cannot depend on app, core, or modules.',
        },
        {
          target: './src/core',
          from: ['./src/app', './src/modules'],
          message: 'Core code cannot depend on app or modules.',
        },
        {
          target: './src/modules',
          from: './src/app',
          message: 'Modules cannot depend on app.',
        },
        {
          target: ['./src/core', './src/shared', './src/modules/platform', './src/modules/verticals'],
          from: './src/modules/registry.ts',
          message: 'Only app code may import the module registry.',
        },
        {
          target: './src/modules/verticals',
          from: './src/modules/platform',
          except: ['index.ts'],
          message: 'Verticals may import platform modules only through the platform index.',
        },
        {
          target: ['./src/modules/verticals/instamart', './src/modules/verticals/dineout', './src/modules/verticals/events'],
          from: './src/modules/verticals/food',
          message: 'Verticals cannot depend on another vertical.',
        },
        {
          target: ['./src/modules/verticals/food', './src/modules/verticals/dineout', './src/modules/verticals/events'],
          from: './src/modules/verticals/instamart',
          message: 'Verticals cannot depend on another vertical.',
        },
        {
          target: ['./src/modules/verticals/food', './src/modules/verticals/instamart', './src/modules/verticals/events'],
          from: './src/modules/verticals/dineout',
          message: 'Verticals cannot depend on another vertical.',
        },
        {
          target: ['./src/modules/verticals/food', './src/modules/verticals/instamart', './src/modules/verticals/dineout'],
          from: './src/modules/verticals/events',
          message: 'Verticals cannot depend on another vertical.',
        },
      ],
    }],
  },
};
