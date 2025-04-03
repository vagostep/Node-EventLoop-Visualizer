function tracerFuncMaker(t) {
  return (type, nextId, fnName, start, end) => {
    const tracerEnterFunc = t.memberExpression(
      t.identifier('Tracer'),
      t.identifier(`${type}`)
    );
    return t.callExpression(tracerEnterFunc, [
      nextId,
      t.stringLiteral(`${fnName}`),
      t.numericLiteral(start),
      t.numericLiteral(end),
    ]);
  };
}

function tracerErrorFuncMaker(t) {
  return (type, nextId, fnName, start, end) => {
    const tracerEnterFunc = t.memberExpression(
      t.identifier('Tracer'),
      t.identifier(`${type}`)
    );

    const errorMessage = t.memberExpression(
      t.identifier('e'),
      t.identifier(`message`)
    );
    return t.callExpression(tracerEnterFunc, [
      errorMessage,
      nextId,
      t.stringLiteral(`${fnName}`),
      t.numericLiteral(start),
      t.numericLiteral(end),
    ]);
  };
}

module.exports = { tracerFuncMaker, tracerErrorFuncMaker };
