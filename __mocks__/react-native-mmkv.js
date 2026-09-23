const values = new Map();

const storage = {
  getString: key => values.get(key),
  getBoolean: key => values.get(key),
  getNumber: key => values.get(key),
  set: (key, value) => values.set(key, value),
  remove: key => values.delete(key),
  contains: key => values.has(key),
  getAllKeys: () => [...values.keys()],
  clearAll: () => values.clear(),
};

module.exports = { createMMKV: () => storage };
