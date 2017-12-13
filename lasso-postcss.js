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





const fs = require('fs');
const postcss = require('postcss');

fs.readFile('src/app.css', (err, css) => {
  postcss()
    .process(css, { from: 'src/app.css', to: 'dest/app.css' })
    .then(result => {
      fs.writeFile('dest/app.css', result.css);
      if (result.map) fs.writeFile('dest/app.css.map', result.map);
    });
});






var autoprefixer = require('autoprefixer');
var postcss = require('postcss');
var DEFAULT_CONFIG = {
  browsers: ['last 4 versions']
};

module.exports = function (lasso, config) {
  // use DEFAULT_CONFIG if config not present
  config = config || DEFAULT_CONFIG;

  lasso.addTransform({
    contentType: 'css',
    name: module.id,
    stream: false,
    transform: function (code) {
      var processed = postcss([autoprefixer(config)]).process(code);

      processed.warnings().forEach(function (warn) {
        process.stderr.write(warn.toString());
      });
      return processed.css;
    }
  });
};
