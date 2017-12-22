# lasso-postcss

Lasso plugin to transform CSS using PostCSS

## Usage

### 1. Install the plugin

```bash
npm install --dev lasso-postcss
```

or

```bash
yarn add --dev lasso-postcss
```

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

Due to limitations in lasso, only inline source maps are currently supported. Use `map: 'inline'` in your config.

-----

© 2018 [We Are Genki](https://wearegenki.com)
