function getArgument(argName) {
  const idx = process.argv.findIndex(function (arg) {
    return arg === argName || arg.startsWith(`${argName}=`);
  });

  if (idx !== -1) {
    const [, value] = process.argv[idx].split('=');
    return value ? value.trim() : process.argv[idx + 1].trim();
  }

  return undefined;
}

function getDistDirectory() {
  return getArgument('-o') || getArgument('--output-path') || 'dist';
}

module.exports = {
  getArgument,
  getDistDirectory,
};
