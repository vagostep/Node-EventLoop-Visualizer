const { tracerFuncMaker, tracerErrorFuncMaker } = require('./util.js');
// Inspired by: http://alltom.com/pages/instrumenting-javascript/
// This is the target code to get after instrumenting
// const traceBlock = (code, fnName, start, end) => `{
//   const idWithExtensionToAvoidConflicts = nextId();
//   Tracer.enterFunc(idWithExtensionToAvoidConflicts, '${fnName}', ${start}, ${end});
//   try {
//     ${code}
//   } catch (e) {
//     Tracer.errorFunc(e.message, idWithExtensionToAvoidConflicts, '${fnName}', ${start}, ${end});
//     throw e;
//   } finally {
//     Tracer.exitFunc(idWithExtensionToAvoidConflicts, '${fnName}', ${start}, ${end});
//   }
// }`;

// TOTO: solve the hierarchy issue when having throw statement
// This is because of wrapping of try-catch-finally block that will hinder the actual throwing sequence
const traceFunction = (babel) => {
  const t = babel.types;
  const makeTracerFunc = tracerFuncMaker(t);
  const makeErrorTracerFunc = tracerErrorFuncMaker(t);

  const transformFunction = (path) => {
    let start, end, fnName, oriBody;
    start = path.node.start;
    end = path.node.end;
    oriBody = path.node.body.body;
    // Check type of function
    if (
      path.node.type === 'FunctionDeclaration' ||
      path.node.type === 'FunctionExpression'
    ) {
      path.node.id && path.node.id.name
        ? (fnName = path.node.id.name)
        : 'anonymous';
    } else if (path.node.type === 'ArrowFunctionExpression') {
      if (t.isIdentifier(path.container.id)) {
        fnName = path.container.id.name;
      } else {
        fnName = 'anonymous';
      }
    } else {
      throw new Error('Unsupported type:', path.node.type);
    }

    const nextId = t.callExpression(t.identifier('nextId'), []);

    // Make Tracer Function to instrument

    const tracerEnter = makeTracerFunc('enterFunc', nextId, fnName, start, end);
    const tracerError = makeErrorTracerFunc(
      'errorFunc',
      nextId,
      fnName,
      start,
      end
    );
    const tracerExit = makeTracerFunc('exitFunc', nextId, fnName, start, end);
    // Rethrow Error to ensure original try catch is okay
    const reThrowError = t.throwStatement(t.identifier('e'));

    // Make Catch Block with tracerError
    const catchExp = t.expressionStatement(tracerError);
    const catchBlockStatement = t.blockStatement([catchExp, reThrowError]);
    const catchBlock = t.catchClause(t.identifier('e'), catchBlockStatement);

    // Make Finally Block with tracerExit
    const finallyExp = t.expressionStatement(tracerExit);
    const finallyBlockStatement = t.blockStatement([finallyExp]);

    // Make a copy of the existing node.body to avoid circular injection via the push container
    const oriCodeBlockStatement = JSON.parse(JSON.stringify(path.node.body));

    // Push the Tracer Enter Func to run before original code
    oriCodeBlockStatement.body.unshift(tracerEnter);

    // Build the final try-catch-finally block
    const tryBlock = t.tryStatement(
      oriCodeBlockStatement,
      catchBlock,
      finallyBlockStatement
    );
    // Additional early return statement to avoid double inserting of try-catch-finally block
    // This is a hot fix
    // To be refactored in future
    if (
      t.isTryStatement(path.node.body.body[0]) &&
      t.isBlockStatement(path.node.body.body[0].block)
    ) {
      return;
    }
    // Clear the existing body
    oriBody.length = 0;

    path.get('body').pushContainer('body', tryBlock);
  };

  return {
    visitor: {
      FunctionDeclaration(path) {
        transformFunction(path);
      },
      FunctionExpression(path) {
        transformFunction(path);
      },
      ArrowFunctionExpression(path) {
        // Wrap arrow function expression that do not have curly braces with curly braces
        // From AST POV, it is adding a block statement
        if (t.isCallExpression(path.node.body)) {
          const newBlock = t.BlockStatement([
            t.ExpressionStatement(path.node.body),
          ]);
          path.node.body = newBlock;
        }
        transformFunction(path);
      },
    },
  };
};

module.exports = { traceFunction };
