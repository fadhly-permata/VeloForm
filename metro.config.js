const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite on web bundles wa-sqlite as a .wasm asset — Metro must treat
// .wasm files as assets or the web worker fails to resolve.
if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

module.exports = config;
