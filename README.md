[![npm version](https://badge.fury.io/js/ember-cli-typedoc.svg)](https://badge.fury.io/js/ember-cli-typedoc)
[![CI](https://github.com/Bitwise-Development/ember-cli-typedoc/actions/workflows/ci.yml/badge.svg)](https://github.com/Bitwise-Development/ember-cli-typedoc/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/Bitwise-Development/ember-cli-typedoc/badge.svg?branch=master)](https://coveralls.io/github/Bitwise-Development/ember-cli-typedoc?branch=master)

# ember-cli-typedoc
TypeDoc documentation generation for EmberCLI projects.

## Installation
```bash
ember install ember-cli-typedoc
```

## Usage
Docs generation is opt-in via either environment variable or build config.

```bash
TYPEDOC=true ember start
```
```js
// ember-cli-build.js
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  return new EmberAddon(defaults, {
    'ember-cli-typedoc': {
      enabled: true,
    },
  });
};
```

## Configuration
Out of the box, `ember-cli-typedoc` has a couple of loosely held opinions; you're free to interject your own 
as required. The parent project's `/addon` directory is the default entrypoint, with `expand` as the default 
interpretation strategy. Private, protected, internal annotated, and external super class members are ignored.

Any configuration [offered by TypeDoc](https://typedoc.org/guides/options/) can be tweaked in the project's build
config.

Both HTML and JSON outputs are generated to a `/docs` directory, by default. The 
[out](https://typedoc.org/guides/options/#out) and [json](https://typedoc.org/guides/options/#json) arguments 
properties can be unset to limit this.

For example, to undo the aforementioned class member slights while limiting your output to JSON:

```js
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  return new EmberAddon(defaults, {
    'ember-cli-typedoc': {
      enabled: true,
      excludeExternals: false,
      excludePrivate: false,
      excludeProtected: false,
      excludeInternal: false,
      out: undefined,
    },
  });
};
```
