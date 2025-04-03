const parser = require('@babel/parser');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
// Custom Babel Plugin
const { traceLoops } = require('./babelPlugin/loopTracer');
const { traceFunction } = require('./babelPlugin/functionTracer');
const { traceFuncCall } = require('./babelPlugin/functionCallTracer');

function processCode(payload) {
  const oriAST = parser.parse(payload);
  const listOfUserDefinedFunc = [];

  // Get list of name of user defined function
  traverse(oriAST, {
    FunctionDeclaration: function (path) {
      listOfUserDefinedFunc.push(path.node.id.name);
    },
    ArrowFunctionExpression: function (path) {
      let fnName;
      if (t.isIdentifier(path.container.id)) {
        fnName = path.container.id.name;
      } else {
        fnName = 'anonymous';
      }
      listOfUserDefinedFunc.push(fnName);
    },
  });

  const modifiedSource = babel.transformSync(payload.toString(), {
    plugins: [
      [traceFuncCall, { listOfUserDefinedFunc }],
      traceFunction,
      traceLoops,
    ],
  }).code;

  return modifiedSource;
}

module.exports = { processCode };