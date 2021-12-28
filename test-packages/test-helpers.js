const execa = require("execa");
const { join } = require('path');
const { readFileSync, writeFileSync } = require('fs');

/**
 * Put together an absolute path to the named test addon.
 *
 * @param {string} testPackage
 * @param {...string} rest
 *
 * @returns {string}
 */
function getTestPackagePath(testPackage, ...rest) {
  return join(__dirname, testPackage, ...rest);
}

/**
 * Get the contents of a file, optionally parsing it as JSON.
 *
 * @param {string} testPackage          The name of the test addon.
 * @param {string} relativePath         The file path, relative to the test addon root.
 * @param {boolean} [parseAsJSON=false] Parse the file contents as JSON.
 *
 * @returns {string}
 */
function readFile(testPackage, relativePath, parseAsJSON = false) {
  const filePath = getTestPackagePath(testPackage, relativePath);
  const contents = readFileSync(filePath, { encoding: 'utf-8' });

  return parseAsJSON
      ? JSON.parse(contents)
      : contents;
}

/**
 * Runs git clean and git restore against the provided test addon.
 *
 * @param {string} testPackage The name of the test addon.
 *
 * @returns {Promise<void>}
 */
async function gitReset(testPackage) {
  await execa('git', ['clean', '-f', testPackage], { cwd: __dirname });
  await execa('git', ['restore', testPackage], { cwd: __dirname });
}

/**
 * Deletes (rm -rf) a directory within the provided test addon.
 *
 * @param {string} testPackage The name of the test addon.
 * @param {string} directory   The subdirectory to remove.
 *
 * @returns {Promise<void>}
 */
async function deleteDirectory(testPackage, directory) {
  const directoryPath = getTestPackagePath(testPackage, directory);
  await execa('rm', ['-rf', directoryPath], { stdio: 'inherit' }
  );
}

/**
 * Runs an `ember` command against the provided test addon.
 *
 * @param {string} testPackage           The name of the test addon.
 * @param {string} command               The ember command to run.
 * @param {string[]} [commandArgs]       Additional arguments for the command.
 * @param {Record<string, string>} [env] Environment variables.
 *
 * @returns {Promise<void>}
 */
async function ember(testPackage, command, commandArgs = [], env = {}) {
  const cwd  = getTestPackagePath(testPackage);
  const args = [command, ...commandArgs];

  await execa('ember', args, { env, cwd, stdio: 'inherit' });
}

/**
 * Adds configuration to the ember-cli-build.js file of a test addon package.
 *
 * @param {string} testPackage                   The name of the test addon.
 * @param {Record<string, unknown>} configObject A Javascript object.
 *
 * @returns {void}
 */
function addCLIConfig(testPackage, configObject) {
  const filePath     = getTestPackagePath(testPackage, 'ember-cli-build.js');
  const content      = readFileSync(filePath, { encoding: 'utf-8' });
  const configString = JSON.stringify(configObject);

  writeFileSync(
    filePath,
    content.replace('/* Add options here */', configString),
    { encoding: 'utf-8' }
  );
}


module.exports = {
  getTestPackagePath,
  readFile,
  gitReset,
  deleteDirectory,
  ember,
  addCLIConfig,
}