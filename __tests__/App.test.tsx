/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/app/navigation/app-stack-navigator.navigation', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../src/core/store/redux.store', () => ({
  __esModule: true,
  default: {},
}));

import App from '../src/app/App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
