module.exports = {
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(),
  doc: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ empty: true, docs: [] })),
  orderBy: jest.fn(),
  query: jest.fn(),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
  setDoc: jest.fn(() => Promise.resolve()),
  writeBatch: jest.fn(() => ({
    update: jest.fn(),
    delete: jest.fn(),
    set: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  })),
  onSnapshot: jest.fn(() => jest.fn()),
};

