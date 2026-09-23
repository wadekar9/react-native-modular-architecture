const store = {
  getState: () => ({}),
  dispatch: jest.fn(),
  subscribe: jest.fn(() => jest.fn()),
};

export default store;
