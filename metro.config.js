const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const { assetExts, sourceExts } = getDefaultConfig(__dirname).resolver;

const config = {
	transformer: {
		babelTransformerPath: require.resolve(
			'react-native-svg-transformer/react-native',
		),
		getTransformOptions: async () => ({
			transform: {
				experimentalImportSupport: false,
				inlineRequires: true,
			},
		}),
	},
	resolver: {
		assetExts: assetExts.filter(ext => ext !== 'svg'),
		sourceExts: [...sourceExts, 'svg'],
	},
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
