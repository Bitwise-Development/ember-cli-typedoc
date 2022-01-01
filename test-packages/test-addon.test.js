const { dir, file } = require('chai-files');
const {
  getTestPackagePath,
  gitReset,
  deleteDirectory,
  ember,
  readFile,
  addCLIConfig,
} = require('./test-helpers');

const TEST_PKG = 'test-addon';
const BASE_PATH = getTestPackagePath(TEST_PKG);

describe('addon documentation generation', function () {
  jest.setTimeout(10000000);

  beforeEach(async function () {
    await deleteDirectory(TEST_PKG, 'docs');
    await gitReset(TEST_PKG);
  });

  afterEach(async function () {
    await deleteDirectory(TEST_PKG, 'docs');
    await gitReset(TEST_PKG);
  });

  it('creates documentation when the env var is set', async function () {
    dir(`${BASE_PATH}/docs`).assertDoesNotExist();

    await ember(TEST_PKG, 'build', [], { TYPEDOC: 'true' });

    dir(`${BASE_PATH}/docs`).assertExists();
    file(`${BASE_PATH}/docs/index.html`).assertIsNotEmpty();
    file(`${BASE_PATH}/docs/docs.json`).assertIsNotEmpty();

    expect(readFile(TEST_PKG, 'docs/docs.json', true)).toMatchSnapshot();
  });

  it('creates documentation when the "enabled" config flag is set', async function () {
    dir(`${BASE_PATH}/docs`).assertDoesNotExist();

    addCLIConfig(TEST_PKG, { 'ember-cli-typedoc': { enabled: true } });
    await ember(TEST_PKG, 'build');

    dir(`${BASE_PATH}/docs`).assertExists();
    file(`${BASE_PATH}/docs/index.html`).assertIsNotEmpty();
    file(`${BASE_PATH}/docs/docs.json`).assertIsNotEmpty();

    expect(readFile(TEST_PKG, 'docs/docs.json', true)).toMatchSnapshot();
  });

  it('does not create documentation when not explicitly enabled', async function () {
    dir(`${BASE_PATH}/docs`).assertDoesNotExist();
    await ember(TEST_PKG, 'build');
    dir(`${BASE_PATH}/docs`).assertDoesNotExist();
  });

  it('only creates JSON output when configured', async function () {
    dir(`${BASE_PATH}/docs`).assertDoesNotExist();

    addCLIConfig(TEST_PKG, { 'ember-cli-typedoc': { enabled: true, out: null } });
    await ember(TEST_PKG, 'build');

    dir(`${BASE_PATH}/docs`).assertExists();
    file(`${BASE_PATH}/docs/index.html`).assertDoesNotExist();
    file(`${BASE_PATH}/docs/docs.json`).assertIsNotEmpty();

    expect(readFile(TEST_PKG, 'docs/docs.json', true)).toMatchSnapshot();
  });

  it('only creates HTML output when configured', async function () {
    dir(`${BASE_PATH}/docs`).assertDoesNotExist();

    addCLIConfig(TEST_PKG, { 'ember-cli-typedoc': { enabled: true, json: null } });
    await ember(TEST_PKG, 'build');

    dir(`${BASE_PATH}/docs`).assertExists();
    file(`${BASE_PATH}/docs/index.html`).assertIsNotEmpty();
    file(`${BASE_PATH}/docs/docs.json`).assertDoesNotExist();

    expect(readFile(TEST_PKG, 'docs/index.html')).toMatchSnapshot();
  });
});
