class MyOwnEvent {
  constructor() {
    this._emitter = new EventEmitterBase();
  }

  // Copiamos los métodos on y emit del EventEmitter original
  on(...args) {
    return this._emitter.on(...args);
  }

  emit(...args) {
    return this._emitter.emit(...args);
  }
}

const workerAction = ({
    asyncHooks,
    fs,
    net,
    http,
    babel,
    traverse,
    parser,
    vm,
    t,
    EventEmitterBase,
    ReadableBase,
    fetch,
    crypto,
    traceLoops,
    traceFuncCall,
    traceFunction,
    Events,
    Tracer,
    postEvent,
    init,
    before,
    after,
    destroy,
    promiseResolve,
    path
}) => {

    class MyOwnEvent {
        constructor() {
            this._emitter = new EventEmitterBase();
        }

        // Copiamos los métodos on y emit del EventEmitter original
        on(...args) {
            return this._emitter.on(...args);
        }

        emit(...args) {
            return this._emitter.emit(...args);
        }
    }

    asyncHooks
        .createHook({ init, before, after, destroy, promiseResolve })
        .enable();

    // TODO: Maybe change this name to avoid conflicts?
    const nextId = (() => {
        let id = 0;
        return () => id++;
    })();

    // E.g. call stack size exceeded errors...
    process.on("uncaughtException", (err) => {
        postEvent(Events.UncaughtError(err));
        process.exit(1);
    });

    const fakeFilePath = path.join(__dirname, 'file.txt');

    const context = {
        nextId,
        Tracer,
        console: {
            log: Tracer.log,
            warn: Tracer.warn,
            error: Tracer.error,
        },
        setTimeout,
        setInterval,
        clearInterval,
        setImmediate,
        queueMicrotask,
        __filename,
        fs: new Proxy({}, {
            get(target, prop) {
            if (prop === 'readFile') {
                return (callback) => fs.readFile(fakeFilePath, 'utf8', callback);
            }

            if (prop === 'readFileSync') {
                return (callback) => fs.readFileSync(fakeFilePath, 'utf8');
            }

            if (prop === 'createReadStream') {
                const stream = fs.createReadStream(fakeFilePath, { encoding: 'utf8' });

                // Proxy que solo permite el método `on`
                return new Proxy({}, {
                get(target, prop) {
                    if (prop === 'on') return stream.on.bind(stream);
                    // Bloquear acceso a otros métodos/properties
                    return undefined;
                },
                set() {
                    // Evita modificaciones
                    return false;
                }
                });
            }

            return undefined;
            },
            set() {
            // No permitir asignaciones
            return false;
            }
        }),
        process: new Proxy({}, {
            get(target, prop) {
            if (prop === "nextTick") {
                return process.nextTick;
            }

            return undefined;
            },
            set() {
            // No permitir asignaciones
            return false;
            }
        }),
        http: {
            createServer: (callback) => {

            const server = http.createServer(callback);

            const originalServerListen = server.listen.bind(server);

            server.listen = (listenCallback) => {
                return originalServerListen(3000, listenCallback);
            };

            return server;
            },
            request: (callback) => {

            if (typeof callback !== "function") {
                throw new Error('Invalid argument: callback is not a function as 1st argument');
            }

            const options = {
                hostname: "localhost",
                port: 3000,
                path: "/",
                method: "GET"
            };

            return http.request(options, callback);
            }
        },
        net: {
            createConnection: (callback) => {
            
            return net.createConnection({
                port: 4000
            }, callback);
            },
            createServer: (callback) => {

            const server = net.createServer(callback);

            const originalServerListen = server.listen.bind(server);

            server.listen = (listenCallback) => {
                return originalServerListen(4000, listenCallback);
            }

            return server;
            },
        },
        crypto: {
            pbkdf2: (text, callback) => {
            
            const salt = crypto.randomBytes(16);

            const callbackProxy = (err, derivedKey) => {
                if (!err) {
                callback(derivedKey);
                }
            }
            return crypto.pbkdf2(text, salt, 100000, 64, "sha512", callbackProxy);
            }
        },
        fetch,
        JSON,
        EventEmitter: MyOwnEvent,
        Readable: {
            from: (source) => {

            const stream = ReadableBase.from(source);

            // Proxy que solo permite el método `on`
            return new Proxy({}, {
                get(target, prop) {
                if (prop === 'on') return stream.on.bind(stream);
                // Bloquear acceso a otros métodos/properties
                return undefined;
                },
                set() {
                // Evita modificaciones
                return false;
                }
            });
            }
        }
    };

    const code = process.argv.slice(2)?.[0];
    const jsSourceCode = JSON.parse(code);

    const oriAST = parser.parse(jsSourceCode);
    const listOfUserDefinedFunc = [];

    // Get list of name of user defined function
    traverse(oriAST, {
    FunctionDeclaration: function (path) {
        listOfUserDefinedFunc.push(path?.node?.id?.name);
    },
    ArrowFunctionExpression: function (path) {
        let fnName;
        if (t.isIdentifier(path.container.id)) {
        fnName = path?.container?.id?.name;
        } else {
        fnName = "anonymous";
        }
        listOfUserDefinedFunc.push(fnName);
    },
    });

    let modifiedSource = babel.transformSync(jsSourceCode.toString(), {
    plugins: [
        [traceFuncCall, { listOfUserDefinedFunc }],
        traceFunction,
        traceLoops,
    ],
    }).code;

    const script = new vm.Script(modifiedSource);
    vm.createContext(context);
    script.runInContext(context);

}

module.exports = { workerAction };
