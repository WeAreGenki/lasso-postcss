'use strict';

/**
 * lasso-postcss
 * Process your CSS with PostCSS in lasso+marko
 *
 * @author: Max Milton <max@wearegenki.com>
 *
 * Copyright 2017 We Are Genki
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// TODO: Write readme with all the necessary basic information

// TODO: Implement source map generation; probably an API or pattern already in lasso
//  ↳ Turns out lasso doesn't even do JS source maps yet... wow.

// TODO: Error handling; lasso probably has it's own way of doing things

// TODO: Configure Jest and write initial set of unit tests

// TODO: PostCSS runner guidelines compliance: https://github.com/postcss/postcss/blob/master/docs/guidelines/runner.md

// TODO: Performance optimisations

const postcss = require('postcss');
const postcssLoadConfig = require('postcss-load-config');
const nodePath = require('path');
const fs = require('fs');

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
      if (nodePath.isAbsolute(contextOptions.config)) {
        configPath = contextOptions.config;
      } else {
        configPath = nodePath.join(file.base, contextOptions.config);
      }
    } else {
      configPath = file.dirname;
    }
    return postcssLoadConfig({ file, options: contextOptions }, configPath);
  };
}

function getConfig(config, file) {
  const loader = configLoader(file);

  return loader().then((resConfig) => {
    const newConfig = Object.assign({}, resConfig);
    const configOpts = config.options || {};
    const resConfigOpts = resConfig.options || {};

    newConfig.plugins = config.plugins || resConfig.plugins || {};
    newConfig.options = Object.assign(resConfigOpts, configOpts);

    return newConfig;
  });
}

module.exports = function lassoPostcss(lasso, config) {
  const postcssHandler = {
    properties: {
      path: 'string',
      paths: 'string',
      virtualPath: 'string',
      code: 'string',
      external: 'boolean',
    },

    init(lassoContext, callback) { // eslint-disable-line consistent-return
      const { path } = this;

      if (path || this.code) {
        if (path) {
          this.path = this.resolvePath(path);
        }

        this.postcssConfig = getConfig(config, this.path);
      } else {
        const pathError = new Error('"path" or "code" is required');
        if (callback !== undefined) return callback(pathError);
        throw pathError;
      }

      if (callback !== undefined) callback();
    },

    read(lassoContext, callback) {
      return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
        if (!callback) {
          callback = (err, res) => err ? reject(err) : resolve(res); // eslint-disable-line
        }

        const { path } = this;
        let code = '';

        if (this.code) {
          code = this.code; // eslint-disable-line prefer-destructuring
        } else if (path) {
          code = fs.readFileSync(path, 'utf8');
        } else {
          return callback(new Error('Invalid PostCSS dependency. No path or code'));
        }

        this.postcssConfig.then((postcssConfig) => {
          postcss(postcssConfig.plugins)
            .process(code, postcssConfig.options)
            .then((res) => {
              res.warnings().forEach((warn) => {
                process.stderr.write(warn.toString());
              });

              callback(null, res.css);
            })
            .catch(callback);
        });
      });
    },

    getDir() {
      if (this.dir) {
        return this.dir;
      }

      const path = this.path || this.virtualPath;
      return path ? nodePath.dirname(path) : undefined;
    },

    getLastModified(lassoContext, callback) {
      return callback ? callback(null, -1) : -1;
    },

    calculateKey() {
      return `less: ${(this.code || this.virtualPath || this.path)}`;
    },
  };

  const extensions = config.extensions || ['css', 'pcss', 'postcss'];

  extensions.forEach((ext) => {
    const type = ext.charAt(0) === '.' ? ext.substring(1) : ext;
    lasso.dependencies.registerStyleSheetType(type, postcssHandler);
  });
};
