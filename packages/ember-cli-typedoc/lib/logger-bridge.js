const { LogLevel } = require('typedoc');

/**
 * Translates between EmberCLI's console-ui instance, and TypeDoc's
 * CallbackLogger.
 */
module.exports = function createLoggerBridge(ui) {
  return function consoleUiCallbackLogger(message, level) {
    const logMethod =
      level === LogLevel.Error
        ? ui.writeErrorLine
        : level === LogLevel.Warn
        ? ui.writeWarnLine
        : level === LogLevel.Verbose
        ? ui.writeDebugLine
        : ui.writeInfoLine;

    logMethod.call(ui, ui.prependLine('ember-cli-typedoc', message));
  };
};
