<!-- markdownlint-disable first-line-h1 -->

**WARNING: This project is no longer maintained. Marko/lasso never worked as we would have liked and so we've migrated to [Svelte](https://svelte.technology). See [`minna-ui`](https://github.com/WeAreGenki/minna-ui) for our new web UI framework.**

-----

[![Build Status](https://travis-ci.org/WeAreGenki/lasso-postcss.svg?branch=master)](https://travis-ci.org/WeAreGenki/lasso-postcss)
[![Known Vulnerabilities](https://snyk.io/test/github/WeAreGenki/lasso-postcss/badge.svg)](https://snyk.io/test/github/WeAreGenki/lasso-postcss)

# lasso-postcss

Lasso plugin to transform CSS using PostCSS.

__IMPORTANT: Lasso currently runs transforms _per each component, not once globally_. This plugin is useful for processing syntax (e.g. nested selectors) but it's highly recommended to do minification _after_ lasso processing.__

## Usage

### 1. Install the plugin and dependencies

```bash
npm install --dev lasso-postcss postcss
```

or

```bash
yarn add --dev lasso-postcss postcss
```

Also install the packages for any plugins you want to use.

### 2. Add plugin to your `project.js` or lasso configuration

_NOTE: This example assumes you're using [marko-starter](https://github.com/marko-js/marko-starter)._

```javascript
const isProduction = process.env.NODE_ENV === 'production';

module.exports = require('marko-starter').projectConfig({
  lassoConfig: {
    plugins: [
      'lasso-marko',
      {
        plugin: 'lasso-postcss',
        config: {
          map: isProduction ? false : 'inline',
        },
      },
    ],
  },
});
```

### 3. Install any required PostCSS plugins and create a PostCSS configuration file

[See documentation](https://github.com/michael-ciniawsky/postcss-load-config#examples) for more information. An example setup:

Install dependencies:

```bash
yarn add --dev postcss-import postcss-nested autoprefixer
```

Then create a `.postcssrc.js` file:

```javascript
module.exports = {
  plugins: {
    'postcss-import': { path: ['src', 'node_modules'] },
    'postcss-nested': {},
    'autoprefixer': {},
  }
};
```

## Options

All options are the same as in [postcss-load-config](https://github.com/michael-ciniawsky/postcss-load-config#options). It's generally recommended to use a standalone config file but you can also pass options via the lasso plugin `config` object.

_NOTE: You can use both a standalone config and lasso config together. Options are merged from both sources but the lasso config will override anything else._

Example:

```javascript
{
  plugin: 'lasso-postcss',
  config: {
    syntax: 'postcss-scss',
    plugins: [
      require('postcss-nested'),
      require('autoprefixer'),
    ],
    map: 'inline',
  },
},
```

## Source maps

Due to limitations in lasso, if you want external source maps it's necessary to add a `mapPath` option to your config so this plugin knows where to save your source maps. Alternatively your can use inline source maps. [See docs](https://github.com/postcss/postcss/blob/master/docs/source-maps.md) for configuration info.

_NOTE: External source map files are named after the source filename NOT the compiled filename (no fingerprint etc.). This is due to a lasso limitation._

For example:

```javascript
{
  plugin: 'lasso-postcss',
  config: {
    map: true, // outputs inline source map (default)
  },
},
```

or

```javascript
const path = require('path');

...

{
  plugin: 'lasso-postcss',
  config: {
    map: { inline: false },
    mapPath: path.join(process.env.PWD, 'dist'),
  },
},

// outputs external source map to: <root>/dist/<source_filename>.map
```

-----

© 2018 [We Are Genki](https://wearegenki.com)
