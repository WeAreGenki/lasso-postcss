/**
 * lasso-postcss
 * @overview Lasso plugin to transform CSS using PostCSS.
 * @author Max Milton <max@wearegenki.com>
 *
 * Copyright 2018 We Are Genki
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

'use strict';

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');

const noop = () => { /* do nothing */ };

/**
 * @typedef {object} PluginConfig
 * @property {object.<string>|Array.<require|Function>} PluginConfig.plugins
 * @property {boolean|string} PluginConfig.map
 */

/**
 * Load PostCSS configuration and transform CSS passed in by Lasso.js
 * @param {object} lasso Lasso.js plugin execution context.
 * @param {PluginConfig} config Lasso.js plugin configuration options.
 */
module.exports = (lasso, config) => {
  /**
   * @typedef {object} PostCSSConfig
   * @property {object} plugins The plugins specified in the PostCSS configuration.
   * @property {object} options The options specified in the PostCSS configuration.
   */
  postcssrc(config).then((/** @type {PostCSSConfig} */{ plugins, options }) => {
    lasso.addTransform({
      contentType: 'css',
      name: module.id,
      stream: false,

      /**
       * @param {string} css The CSS being processed.
       * @param {object} lassoContext The Lasso.js build context.
       */
      transform: (css, lassoContext) => {
        const { virtualPath, path: actualPath } = lassoContext.dependency;
        const sourcePath = virtualPath || actualPath;
        const opts = Object.assign({
          from: sourcePath,
          to: sourcePath,
        }, options);

        return postcss(plugins)
          .process(css, opts)
          .then((result) => {
            result.warnings().forEach((warn) => {
              process.stderr.write(warn.toString());
            });

            // TODO: Improve this once lasso has source map support
            if (result.map) {
              const mapPath = opts.mapPath
                ? `${opts.mapPath}/${path.basename(sourcePath)}`
                : opts.to;
              fs.writeFile(`${mapPath}.map`, result.map.toString(), noop);
            }

            return result.css;
          })
          .catch((error) => {
            if (error.name === 'CssSyntaxError') {
              process.stderr.write(error.message + error.showSourceCode());
            } else {
              throw error;
            }
          });
      },
    });
  });
};
