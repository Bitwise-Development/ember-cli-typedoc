const execa = require("execa");
const { join } = require('path');

module.exports = {
    async gitReset(testPackage) {
        await execa('git', ['clean', '-f', testPackage], { cwd: __dirname });
        await execa('git', ['restore', testPackage], { cwd: __dirname });
    },

    async deleteDirectory(testPackage, directory) {
        await execa('rm', ['-rf', join(__dirname, testPackage, directory)], { cwd: __dirname });
    },

    async ember(testPackage, command, commandArgs = [], environmentVars = {}) {
        await execa('ember', [command, ...commandArgs], {
            env: environmentVars,
            cwd: join(__dirname, testPackage),
            stdio: 'inherit',
        });
    }
}