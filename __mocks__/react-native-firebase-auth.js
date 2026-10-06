module.exports = {
  getAuth: jest.fn(() => ({
    currentUser: { uid: 'mock-user-123' },
  })),
  signInAnonymously: jest.fn(() =>
    Promise.resolve({
      user: { uid: 'mock-user-123' },
    })
  ),
};

