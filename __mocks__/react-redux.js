const React = require('react');

const Provider = ({ children }) => React.createElement(React.Fragment, null, children);
const useDispatch = () => jest.fn();
const useSelector = selector => selector({});

module.exports = { Provider, useDispatch, useSelector };
