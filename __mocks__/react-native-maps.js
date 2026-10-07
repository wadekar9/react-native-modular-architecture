const React = require('react');
const { View } = require('react-native');

const MockMapView = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => ({
    animateCamera: jest.fn(),
    animateToRegion: jest.fn(),
    fitToCoordinates: jest.fn(),
    setCamera: jest.fn(),
  }));

  return React.createElement(View, { testID: 'mock-map-view', ...props }, props.children);
});
MockMapView.displayName = 'MockMapView';

const MockMarker = props => React.createElement(View, { testID: 'mock-marker', ...props }, props.children);
const MockPolyline = props => React.createElement(View, { testID: 'mock-polyline', ...props }, props.children);
const MockCircle = props => React.createElement(View, { testID: 'mock-circle', ...props }, props.children);

module.exports = {
  __esModule: true,
  default: MockMapView,
  MapView: MockMapView,
  Marker: MockMarker,
  Polyline: MockPolyline,
  Circle: MockCircle,
  PROVIDER_GOOGLE: 'google',
  PROVIDER_DEFAULT: null,
};

