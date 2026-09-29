const fs = require('fs');
const path = require('path');

const verticalRoot = path.join(__dirname, 'src/modules/verticals');
const verticalNames = fs.readdirSync(verticalRoot, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);
const verticalDependencyZones = verticalNames.map(verticalName => ({
  target: verticalNames
    .filter(otherVertical => otherVertical !== verticalName)
    .map(otherVertical => `./src/modules/verticals/${otherVertical}`),
  from: `./src/modules/verticals/${verticalName}`,
  message: 'Verticals cannot depend on another vertical.',
}));

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
    'import/no-cycle': 'error',
    'import/no-restricted-paths': ['error', {
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
          target: ['./src/core', './src/shared', './src/modules'],
          from: './src/modules/registry.ts',
          message: 'Only app code may import the module registry.',
        },
        {
          target: './src/modules/platform',
          from: './src/modules/verticals',
          message: 'Platform modules cannot depend on verticals.',
        },
        {
          target: './src/modules/verticals',
          from: './src/modules/platform',
          except: ['index.ts'],
          message: 'Verticals may import platform modules only through the platform index.',
        },
        ...verticalDependencyZones,
      ],
    }],
  },
};
