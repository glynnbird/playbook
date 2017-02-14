function preprocess(input) {
  const awaitMatcher = /^(?:\s*(?:(?:let|var|const)\s)?\s*([^=]+)=\s*|^\s*)(await\s[\s\S]*)/;
  const asyncWrapper = (code, binder) => {
    let assign = binder ? `global.${binder} = ` : '';
    return `(function(){ async function _wrap() { return ${assign}${code} } return _wrap();})()`;
  };

  // match & transform
  const match = input.match(awaitMatcher);
  if (match) {
    input = `${asyncWrapper(match[2], match[1])}`;
  }
  return input;
}

module.exports = preprocess;