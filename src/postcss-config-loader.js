'use strict';

const path = require('path');
const loadConfig = require('postcss-load-config');

function configLoader(file) {
  return (plugins, options) => {
    if (Array.isArray(plugins)) {
      return Promise.resolve({ plugins, options });
    } else if (typeof plugins === 'function') {
      return Promise.resolve(plugins(file));
    }

    const contextOptions = plugins || {};
    let configPath;

    if (contextOptions.config) {
      if (path.isAbsolute(contextOptions.config)) {
        configPath = contextOptions.config;
      } else {
        configPath = path.join(file.base, contextOptions.config);
      }
    } else {
      configPath = file.dirname;
    }

    return loadConfig({ file, options: contextOptions }, configPath);
  };
}

module.exports = (lassoConfig, file) => {
  const load = configLoader(file);

  return load().then((result) => {
    const config = Object.assign({}, result);

    config.options = Object.assign(result.options, lassoConfig);
    config.plugins = lassoConfig.plugins || result.plugins || {};

    return config;
  });
};
