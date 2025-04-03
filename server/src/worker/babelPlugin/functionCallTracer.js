const { tracerFuncMaker } = require("./util.js");
const _ = require("lodash");

// This is to target all function call except the one defined by user
// To instrument enterFunc and exitFunc while getting the line code ref for client side render

const traceFuncCall = (babel) => {
  const t = babel.types;
  const makeTracerFunc = tracerFuncMaker(t);
  let i = 0;
  return {
    visitor: {
      CallExpression(path, state) {
        i++;

        const { node } = path;
        const { listOfUserDefinedFunc } = state.opts;

        let fnName, start, end;
        if (t.isCallExpression(node["callee"]?.["object"])) {
          const callee = node.callee;
          const property = callee.property.name;
          end = callee.end;
          const objectBase = callee.object?.callee?.object?.name;
          const propertyBase = callee.object?.callee?.property?.name;
          start = callee.object?.callee?.start;
          fnName = `${objectBase}.${propertyBase}().${property}`;
        } else if (
          t.isMemberExpression(node["callee"]) &&
          t.isIdentifier(node["callee"]["object"]) &&
          t.isIdentifier(node["callee"]["property"])
        ) {
          const callee = node.callee;
          const object = callee.object.name;
          start = callee.start;
          end = callee.end;
          const property = callee.property.name;
          fnName = `${object}.${property}`;
        } else if (t.isIdentifier(node["callee"])) {
          const callee = node.callee;
          start = callee.start;
          end = callee.end;
          fnName = callee.name;
        } else {
          return;
        }
        let shouldInsert = true;
        const nextId = t.callExpression(t.identifier("nextId"), []);

        listOfUserDefinedFunc.forEach((name) => {
          if (name === fnName) {
            shouldInsert = false;
          }
        });

        // No need to instrument these function call
        if (fnName.includes("Tracer") || fnName.includes("nextId")) {
          return;
        }
        // Make Tracer Function to instrument
        const tracerEnter = makeTracerFunc(
          "enterFunc",
          nextId,
          fnName,
          start,
          end
        );
        const tracerExit = makeTracerFunc(
          "exitFunc",
          nextId,
          fnName,
          start,
          end
        );

        const funcNode = path.findParent((path) => path.isBlockStatement());
        const programNode = path.findParent((path) => path.isProgram());

        if (funcNode) {
          // Add tracer for function call inside
          for (let i = 0; i < funcNode.node.body.length; i++) {
            let bodyNode = funcNode.node.body[i];
            if (
              t.isExpressionStatement(bodyNode) &&
              t.isCallExpression(bodyNode.expression) &&
              _.isEqual(bodyNode.expression, node) &&
              // Additional check as Babel does not guarantee that a node will be visited only once
              // This is a hot fix
              // Double insertion does not happen if only one plugin is used
              // Very weird
              //https://github.com/babel/babel/issues/5559
              !_.isEqual(funcNode.node.body[i - 1], tracerEnter) &&
              shouldInsert
            ) {
              funcNode.node.body.splice(i, 0, tracerEnter);
              funcNode.node.body.splice(i + 2, 0, tracerExit);
              i = i + 2;
            }
          }
        }
        if (programNode) {
          // Do nothing if the check confirm that this is user-defined function
          for (let i = 0; i < programNode.node.body.length; i++) {
            let bodyNode = programNode.node.body[i];

            if (
              t.isFunctionDeclaration(bodyNode) &&
              t.isIdentifier(bodyNode.id) &&
              bodyNode.id.name == fnName
            ) {
              return;
            } else if (
              t.isExpressionStatement(bodyNode) &&
              t.isCallExpression(bodyNode.expression) &&
              _.isEqual(bodyNode.expression, node) &&
              shouldInsert
            ) {
              programNode.node.body.splice(i, 0, tracerEnter);
              programNode.node.body.splice(i + 2, 0, tracerExit);
              i = i + 2;
            } else if (t.isVariableDeclaration(bodyNode)) {
              // With this if we can select those callMethods that are used in an assigment declaration. 

              bodyNode?.declarations?.forEach((declaration) => {
                const rightSide = declaration.init;

                if (t.isCallExpression(rightSide)) {
                  const functionName = rightSide.callee.name;

                  if (functionName === fnName) {
                    programNode.node.body.splice(i, 0, tracerEnter);
                    programNode.node.body.splice(i + 2, 0, tracerExit);
                    i = i + 2;
                  }
                }
              });
            }
          }
        }
      },
    },
  };
};

module.exports = { traceFuncCall };
