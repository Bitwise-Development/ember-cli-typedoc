const createLoggerBridge = require('ember-cli-typedoc/lib/logger-bridge');
const { LogLevel } = require('typedoc');

describe('logger bridge', function () {
  it('translates logging between TypeDoc and ConsoleUi', function () {
    const logs = [];
    const ui = {
      writeErrorLine(msg) { logs.push(`ERROR ${msg}`); },
      writeWarnLine(msg) { logs.push(`WARN ${msg}`); },
      writeDebugLine(msg) { logs.push(`DEBUG ${msg}`); },
      writeInfoLine(msg) { logs.push(`INFO ${msg}`); },
      prependLine(a, b) { return `${a}: ${b}`; },
    }

    const bridge = createLoggerBridge(ui);

    bridge('1', LogLevel.Verbose);
    bridge('2', LogLevel.Error);
    bridge('3', LogLevel.Warn);
    bridge('4');

    expect(logs).toEqual([
      'DEBUG ember-cli-typedoc: 1',
      'ERROR ember-cli-typedoc: 2',
      'WARN ember-cli-typedoc: 3',
      'INFO ember-cli-typedoc: 4',
    ]);
  });
});
