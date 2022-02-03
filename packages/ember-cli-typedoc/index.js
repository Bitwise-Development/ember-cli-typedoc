'use strict';
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const BroccoliTypedocWriter = require('./lib/broccoli-typedoc-writer');

module.exports = {
  name: require('./package').name,

  configName: 'ember-cli-typedoc',

  included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    const addonOptions =
      (this.parent && this.parent.options) || (app && app.options) || {};

    this.addonConfig = addonOptions[this.configName] || {};

    this.addonEnabled =
      this.addonConfig.enabled === true || process.env.TYPEDOC === 'true';
  },

  postprocessTree(type, tree) {
    this._super.postprocessTree.apply(this, arguments);

    if (!(this.addonEnabled && type === 'all')) {
      return tree;
    }

    const { funnelConfig, writerConfig } = this.getConfiguration();

    const docsTree = new BroccoliTypedocWriter(
      [new Funnel('.', funnelConfig)],
      writerConfig
    );

    return mergeTrees([tree, docsTree]);
  },

  getConfiguration() {
    const isInAddon = this.project.isEmberCLIAddon();

    let typedocConfig = Object.assign({}, this.addonConfig);
    let funnelConfig = typedocConfig.funnelConfig || {};

    // These are not TypeDoc options, so they get removed.
    delete typedocConfig.enabled;
    delete typedocConfig.funnelConfig;

    funnelConfig = Object.assign(
      {
        include: isInAddon
          ? ['addon/**/*.ts', 'addon-test-support/**/*.ts']
          : ['app/**/*.ts'],
      },
      funnelConfig
    );

    typedocConfig = Object.assign(
      {
        out: './docs',
        json: './docs/docs.json',
        entryPoints: [isInAddon ? './addon' : './app'],
        entryPointStrategy: 'expand',
        excludeExternals: true,
        excludePrivate: true,
        excludeProtected: true,
        excludeInternal: true,
        logger: 'none',
      },
      typedocConfig
    );

    return { funnelConfig, writerConfig: { typedocConfig, ui: this.ui } };
  },
};
