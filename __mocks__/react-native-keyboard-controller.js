const React = require('react');
const { ScrollView, View } = require('react-native');

const KeyboardProvider = ({ children }) => React.createElement(View, null, children);
const KeyboardAwareScrollView = React.forwardRef((props, ref) =>
  React.createElement(ScrollView, { ...props, ref }),
);

module.exports = {
  KeyboardProvider,
  KeyboardAwareScrollView,
};
