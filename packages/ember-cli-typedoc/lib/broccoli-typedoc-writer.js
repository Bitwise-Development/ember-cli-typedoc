const Path = require('path');
const Writer = require('broccoli-caching-writer');
const execa = require('execa');
const { getDistDirectory } = require('./command-args');

function isString(value) {
  return typeof value === 'string';
}

module.exports = class BroccoliTypedocWriter extends Writer {
  constructor(inputNodes, options = {}) {
    super(inputNodes, options);

    this.ui = options.ui;
    this.typedocConfig = options.typedocConfig || {};
    this.distDirectory = Path.resolve(getDistDirectory());

    this.scriptPath = Path.resolve(
      __dirname,
      '../scripts/ember-cli-typedoc.js'
    );

    if (isString(this.typedocConfig.out)) {
      this.typedocConfig.out = Path.resolve(this.typedocConfig.out);
    }

    if (isString(this.typedocConfig.json)) {
      this.typedocConfig.json = Path.resolve(this.typedocConfig.json);
    }

    // We can't serialize a function for the child process.
    if (typeof this.typedocConfig.logger !== 'string') {
      delete this.typedocConfig.logger;
    }

    // Trying to pump Typedoc's output right into /dist results in lots of
    // ugly things happening.
    if (this.typedocConfig.out === this.distDirectory) {
      throw new Error(
        'The Typedoc HTML output directory must be a child of the build output directory, and not the build output directory itself.'
      );
    }
  }

  async build() {
    const buildConfig = Object.assign({}, this.typedocConfig);

    // If the Typedoc output is going into the build target directory
    // then it needs to get shunted over to the outputPath, or it'll
    // be overwritten when the rest of the build is written out.

    let out = buildConfig.out;
    let json = buildConfig.json;

    if (isString(out) && out.startsWith(this.distDirectory)) {
      out = out.replace(this.distDirectory, this.outputPath);
      buildConfig.out = out;
    }

    if (isString(json) && json.startsWith(this.distDirectory)) {
      json = json.replace(this.distDirectory, this.outputPath);
      buildConfig.json = json;
    }

    // This logging is less than ideal
    const stdio =
      buildConfig.logger && buildConfig.logger !== 'none'
        ? 'inherit'
        : undefined;

    await execa('node', [this.scriptPath], {
      stdio,
      cwd: process.cwd(),
      env: { EMBER_CLI_TYPEDOC_CONFIG: JSON.stringify(buildConfig) },
    });
  }
};
