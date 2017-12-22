'use strict';

/**
 * lasso-postcss
 * Lasso plugin to transform CSS using PostCSS
 *
 * @author: Max Milton <max@wearegenki.com>
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

const fs = require('fs');
const postcss = require('postcss');
const getPostcssConfig = require('./postcss-config-loader');

module.exports = (lasso, lassoConfig) => {
  getPostcssConfig(lassoConfig, process.env.PWD).then((config) => {
    lasso.addTransform({
      contentType: 'css',
      name: module.id,
      stream: false,
      transform: (code, lassoContext) => {
        const path = lassoContext.dependency.virtualPath || lassoContext.dependency.path;
        const opts = Object.assign(config.options, {
          from: path,
          to: path,
        });

        return postcss(config.plugins)
          .process(code, opts)
          .then((result) => {
            result.warnings().forEach((warn) => {
              process.stderr.write(warn.toString());
            });

            // FIXME: Source map output path OR better yet, map support in lasso
            if (result.map) {
              fs.writeFile(`${opts.to}.map`, result.map.toString());
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
