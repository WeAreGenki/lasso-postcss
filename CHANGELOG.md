<!-- markdownlint-disable MD024 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2018-01-27

### Changed

- Simplified how PostCSS configuration files are loaded.
- Better internal dev tooling configs.

## [0.3.0] - 2017-12-22

### Added

- Crude external source map support via a `mapPath` option.
- `keywords` field to `package.json`.

### Changed

- PostCSS options for `from` and `to` can now be overridden by the config.

### Removed

- VS Code specific files (didn't really add any value for this project).

## [0.2.0] - 2017-12-22

### Added

- Basic instructions in README.

### Changed

- Nearly a complete rewrite from a CSS dependency handler into a CSS output transformer. Will now transform any CSS in lasso rather than just handle .css files. This enables chaining style plugins e.g. `lasso-sass` >> `lasso-postcss`.
- Now mostly compliant with the [PostCSS runner guidelines](https://github.com/postcss/postcss/blob/master/docs/guidelines/runner.md). Only place it falls short is lack of support for external source maps (current limitation of lasso), inline source maps are still OK though.

### Removed

- Clean up unnecessary comments.

## [0.1.1] - 2017-12-14

### Added

- "TODO" comments about upcoming functionality.

### Removed

- `raptor-util` as it's functionality was refactored out.
- Debugging code that left in by accident.

### Fixed

- A couple of bugs in the previous release preventing CSS from compiling.

## [0.1.0] - 2017-12-14

Initial code structure inspired by [lasso-sass](https://github.com/lasso-js/lasso-sass/), [lasso-less](https://github.com/lasso-js/lasso-less/), and [gulp-postcss](https://github.com/postcss/gulp-postcss/). A nice place to start but there's plenty of room for improvement!

### Added

- Initial base source files, dependencies, and configurations.
- POC of working functionality.

[Unreleased]: https://github.com/WeAreGenki/lasso-postcss/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/WeAreGenki/lasso-postcss/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/WeAreGenki/lasso-postcss/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/WeAreGenki/lasso-postcss/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/WeAreGenki/lasso-postcss/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/WeAreGenki/lasso-postcss/compare/v0.0.0...v0.1.0
