const execa = require("execa");
const { join } = require('path');

module.exports = {
    async gitReset(directory) {
        await execa('git', ['clean', '-f', directory], { cwd: __dirname });
        await execa('git', ['restore', directory], { cwd: __dirname });
    },

    async deleteDirectory(directory) {
        await execa('rm', ['-rf', join(__dirname, directory)], { cwd: __dirname });
    },

    async ember(cmd, ... args) {
        await execa('ember', [cmd, ...args]);
    }
}