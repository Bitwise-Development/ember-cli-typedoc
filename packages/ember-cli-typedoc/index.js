'use strict';
const TypeDocGenerator = require('./lib/typedoc-generator');
const createLoggerBridge = require('./lib/logger-bridge');

module.exports = {
  name: require('./package').name,

  included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    const addonOptions =
      (this.parent && this.parent.options) || (app && app.options) || {};

    this.addonConfig = addonOptions['ember-cli-typedoc'] || {};

    this.addonEnabled =
      this.addonConfig.enabled === true || process.env.TYPEDOC === 'true';

    // This is not a TypeDoc option, so it gets removed.
    delete this.addonConfig.enabled;
  },

  async outputReady() {
    if (this.addonEnabled) {
      const generator = new TypeDocGenerator();

      const config = Object.assign(
        {
          entryPoints: [this.project.isEmberCLIAddon() ? './addon' : './app'],
          entryPointStrategy: 'expand',
          out: './docs',
          json: './docs/docs.json',
          logger: createLoggerBridge(this.ui),
        },
        this.addonConfig
      );

      this.ui.writeInfoLine('Running TypeDoc');

      await generator.generate(config);
    }
  },
};
