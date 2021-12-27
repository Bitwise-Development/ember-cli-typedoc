const { gitReset, deleteDirectory } = require('./test-helpers');

describe('addon documentation generation', function () {
    jest.setTimeout(10000000);

    beforeEach(async function () {
        await deleteDirectory('test-addon/dist');
        await gitReset('test-addon');
    });

    afterEach(async function () {
        await deleteDirectory('test-addon/dist');
        await gitReset('test-addon');
    });

    it('works', function () {
        expect(1).toBeTruthy();
    })
});
