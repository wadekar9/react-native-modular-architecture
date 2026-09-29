module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        extensions: ['.ios.js', '.android.js', '.ios.jsx', '.android.jsx', '.js', '.jsx', '.json', '.ts', '.tsx'],
        root: ['.'],
        alias: {
          "@app": "./src/app",
          "@core": "./src/core",
          "@modules": "./src/modules",
          "@shared": "./src/shared",
          "$app": "./src/app",
          "$assets": "./src/shared/assets",
          "$components": "./src/shared/components",
          "$constants": "./src/shared/constants",
          "$context": "./src/shared/theme",
          "$core": "./src/core",
          "$dto": "./src/shared/types/dto",
          "$dto/common": "./src/shared/types/dto",
          "$helpers": "./src/shared/utils",
          "$helpers/files.helper": "./src/core/platform/files.helper",
          "$hooks": "./src/shared/hooks",
          "$hooks/common": "./src/shared/hooks",
          "$locales": "./src/shared/locales",
          "$modules": "./src/modules",
          "$networking": "./src/core/networking",
          "$navigation": "./src/app/navigation",
          "$store": "./src/core/store",
          "$styles": "./src/shared/styles",
          "$types": "./src/shared/types",
          "$utils": "./src/core/utils",
          "$utils/permissions": "./src/core/platform/permissions",
          "$utils/storage": "./src/core/storage/storage",
          "$validators": "./src/modules/platform/auth/schemas/validators",
        }
      }
    ]
  ],
  env: {
    production: {
      plugins: ['transform-remove-console']
    }
  }
};