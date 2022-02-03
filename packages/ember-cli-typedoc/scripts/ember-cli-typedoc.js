#!/usr/bin/env node
const TypeDoc = require('typedoc');

(async function () {
  let config = {};

  try {
    config = JSON.parse(process.env.EMBER_CLI_TYPEDOC_CONFIG);
  } catch (e) {
    // noop
  }

  const app = new TypeDoc.Application();

  app.options.addReader(new TypeDoc.TypeDocReader());
  app.options.addReader(new TypeDoc.TSConfigReader());

  app.bootstrap(config);

  const project = app.convert();

  if (project) {
    if (typeof config.out === 'string') {
      await app.generateDocs(project, config.out);
    }

    if (typeof config.json === 'string') {
      await app.generateJson(project, config.json);
    }
  }
})();
