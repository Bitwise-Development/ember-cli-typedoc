const TypeDoc = require('typedoc');

module.exports = class TypeDocGenerator {
  async generate(config = {}) {
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
  }
};
