const netInfo = {
  addEventListener: jest.fn(listener => {
    listener({ isConnected: true });
    return jest.fn();
  }),
};

module.exports = {
  __esModule: true,
  default: netInfo,
};