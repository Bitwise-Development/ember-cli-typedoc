const { dir } = require('chai-files');
const { join } = require('path');
const { gitReset, deleteDirectory, ember } = require('./test-helpers');

const TEST_PKG = 'test-addon';
const BASE_PATH = join(__dirname, TEST_PKG);

describe('addon documentation generation', function () {
    jest.setTimeout(10000000);

    beforeEach(async function () {
        await deleteDirectory(TEST_PKG, 'dist');
        await gitReset(TEST_PKG);
    });

    afterEach(async function () {
        await deleteDirectory(TEST_PKG, 'dist');
        await gitReset(TEST_PKG);
    });

    it('creates documentation when the env var is set', async function () {
        dir(`${BASE_PATH}/docs`).assertDoesNotExist();
        await ember(TEST_PKG, 'build', [], { TYPEDOC: 'true' });
        dir(`${BASE_PATH}/docs`).assertExists();
    })
});
