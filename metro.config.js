const { getDefaultConfig } = require('@expo/metro-config');
/** @type {import('@expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure resolver fields exist (compat guard) and recognize WebAssembly files for expo-sqlite
config.resolver = config.resolver || {};
config.resolver.assetExts = config.resolver.assetExts || [];
config.resolver.sourceExts = config.resolver.sourceExts || [];

if (!config.resolver.assetExts.includes('wasm')) {
	config.resolver.assetExts.push('wasm');
}

module.exports = config;