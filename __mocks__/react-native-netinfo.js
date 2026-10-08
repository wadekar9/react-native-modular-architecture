const listeners = new Set();
let currentState = { isConnected: true, isInternetReachable: true, type: 'wifi' };

const netInfo = {
  fetch: jest.fn(() => Promise.resolve(currentState)),
  addEventListener: jest.fn(listener => {
    listeners.add(listener);
    listener(currentState);
    return () => listeners.delete(listener);
  }),
  useNetInfoInstance: jest.fn(() => ({
    netInfo: currentState,
    refresh: jest.fn(),
  })),
  __emitStateChange: (newState) => {
    currentState = { ...currentState, ...newState };
    listeners.forEach(l => l(currentState));
  },
};

module.exports = {
  __esModule: true,
  default: netInfo,
  useNetInfoInstance: netInfo.useNetInfoInstance,
};