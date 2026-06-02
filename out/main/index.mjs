import { createRequire } from "node:module";
import * as fs$2 from "fs";
import * as path$1 from "path";
import * as net$1 from "net";
import { EventEmitter } from "events";
// -- CommonJS Shims --
import __cjs_mod__ from "node:module";
import.meta.filename;
const __dirname = import.meta.dirname;
__cjs_mod__.createRequire(import.meta.url);
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esmMin = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __require = /* @__PURE__ */ createRequire(import.meta.url);
//#endregion
//#region node_modules/electron/index.js
var require_electron = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { spawnSync } = __require("child_process");
	var fs$4 = __require("fs");
	var path$3 = __require("path");
	var pathFile = path$3.join(__dirname, "path.txt");
	function downloadElectron() {
		console.log("Downloading Electron binary...");
		if (spawnSync(process.execPath, [path$3.join(__dirname, "install.js")], { stdio: "inherit" }).status !== 0) throw new Error("Electron failed to install correctly. Please delete `node_modules/electron` and run \"npx install-electron --no\" manually.");
	}
	/**
	* Fetches the path to the Electron executable to use in development mode.
	* If the executable is missing, attempt to download it first.
	*
	* @returns the path to the Electron executable to run
	*/
	function getElectronPath() {
		let executablePath;
		if (fs$4.existsSync(pathFile)) executablePath = fs$4.readFileSync(pathFile, "utf-8");
		if (process.env.ELECTRON_OVERRIDE_DIST_PATH) return path$3.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || "electron");
		if (executablePath) {
			const fullPath = path$3.join(__dirname, "dist", executablePath);
			if (!fs$4.existsSync(fullPath)) downloadElectron();
			return fullPath;
		} else {
			try {
				downloadElectron();
			} catch {
				throw new Error("Electron failed to install correctly. Please delete `node_modules/electron` and run \"npx install-electron --no\" manually.");
			}
			executablePath = fs$4.readFileSync(pathFile, "utf-8");
			return path$3.join(__dirname, "dist", executablePath);
		}
	}
	module.exports = getElectronPath();
}));
//#endregion
//#region node_modules/dotenv/package.json
var package_exports = /* @__PURE__ */ __exportAll({
	browser: () => browser,
	default: () => package_default,
	description: () => description,
	devDependencies: () => devDependencies,
	engines: () => engines,
	exports: () => exports$1,
	funding: () => funding,
	homepage: () => homepage,
	keywords: () => keywords,
	license: () => license,
	main: () => main,
	name: () => name,
	readmeFilename: () => readmeFilename,
	repository: () => repository,
	scripts: () => scripts,
	types: () => types,
	version: () => version
});
var name, version, description, main, types, exports$1, scripts, repository, homepage, funding, keywords, readmeFilename, license, devDependencies, engines, browser, package_default;
var init_package = __esmMin((() => {
	name = "dotenv";
	version = "16.6.1";
	description = "Loads environment variables from .env file";
	main = "lib/main.js";
	types = "lib/main.d.ts";
	exports$1 = {
		".": {
			"types": "./lib/main.d.ts",
			"require": "./lib/main.js",
			"default": "./lib/main.js"
		},
		"./config": "./config.js",
		"./config.js": "./config.js",
		"./lib/env-options": "./lib/env-options.js",
		"./lib/env-options.js": "./lib/env-options.js",
		"./lib/cli-options": "./lib/cli-options.js",
		"./lib/cli-options.js": "./lib/cli-options.js",
		"./package.json": "./package.json"
	};
	scripts = {
		"dts-check": "tsc --project tests/types/tsconfig.json",
		"lint": "standard",
		"pretest": "npm run lint && npm run dts-check",
		"test": "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
		"test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
		"prerelease": "npm test",
		"release": "standard-version"
	};
	repository = {
		"type": "git",
		"url": "git://github.com/motdotla/dotenv.git"
	};
	homepage = "https://github.com/motdotla/dotenv#readme";
	funding = "https://dotenvx.com";
	keywords = [
		"dotenv",
		"env",
		".env",
		"environment",
		"variables",
		"config",
		"settings"
	];
	readmeFilename = "README.md";
	license = "BSD-2-Clause";
	devDependencies = {
		"@types/node": "^18.11.3",
		"decache": "^4.6.2",
		"sinon": "^14.0.1",
		"standard": "^17.0.0",
		"standard-version": "^9.5.0",
		"tap": "^19.2.0",
		"typescript": "^4.8.4"
	};
	engines = { "node": ">=12" };
	browser = { "fs": false };
	package_default = {
		name,
		version,
		description,
		main,
		types,
		exports: exports$1,
		scripts,
		repository,
		homepage,
		funding,
		keywords,
		readmeFilename,
		license,
		devDependencies,
		engines,
		browser
	};
}));
//#endregion
//#region node_modules/dotenv/lib/main.js
var require_main = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$3 = __require("fs");
	var path$2 = __require("path");
	var os$2 = __require("os");
	var crypto = __require("crypto");
	var version = (init_package(), __toCommonJS(package_exports).default).version;
	var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
	function parse(src) {
		const obj = {};
		let lines = src.toString();
		lines = lines.replace(/\r\n?/gm, "\n");
		let match;
		while ((match = LINE.exec(lines)) != null) {
			const key = match[1];
			let value = match[2] || "";
			value = value.trim();
			const maybeQuote = value[0];
			value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
			if (maybeQuote === "\"") {
				value = value.replace(/\\n/g, "\n");
				value = value.replace(/\\r/g, "\r");
			}
			obj[key] = value;
		}
		return obj;
	}
	function _parseVault(options) {
		options = options || {};
		const vaultPath = _vaultPath(options);
		options.path = vaultPath;
		const result = DotenvModule.configDotenv(options);
		if (!result.parsed) {
			const err = /* @__PURE__ */ new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
			err.code = "MISSING_DATA";
			throw err;
		}
		const keys = _dotenvKey(options).split(",");
		const length = keys.length;
		let decrypted;
		for (let i = 0; i < length; i++) try {
			const attrs = _instructions(result, keys[i].trim());
			decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
			break;
		} catch (error) {
			if (i + 1 >= length) throw error;
		}
		return DotenvModule.parse(decrypted);
	}
	function _warn(message) {
		console.log(`[dotenv@${version}][WARN] ${message}`);
	}
	function _debug(message) {
		console.log(`[dotenv@${version}][DEBUG] ${message}`);
	}
	function _log(message) {
		console.log(`[dotenv@${version}] ${message}`);
	}
	function _dotenvKey(options) {
		if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) return options.DOTENV_KEY;
		if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
		return "";
	}
	function _instructions(result, dotenvKey) {
		let uri;
		try {
			uri = new URL(dotenvKey);
		} catch (error) {
			if (error.code === "ERR_INVALID_URL") {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			}
			throw error;
		}
		const key = uri.password;
		if (!key) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing key part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environment = uri.searchParams.get("environment");
		if (!environment) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing environment part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		const ciphertext = result.parsed[environmentKey];
		if (!ciphertext) {
			const err = /* @__PURE__ */ new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
			err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
			throw err;
		}
		return {
			ciphertext,
			key
		};
	}
	function _vaultPath(options) {
		let possibleVaultPath = null;
		if (options && options.path && options.path.length > 0) if (Array.isArray(options.path)) {
			for (const filepath of options.path) if (fs$3.existsSync(filepath)) possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
		} else possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
		else possibleVaultPath = path$2.resolve(process.cwd(), ".env.vault");
		if (fs$3.existsSync(possibleVaultPath)) return possibleVaultPath;
		return null;
	}
	function _resolveHome(envPath) {
		return envPath[0] === "~" ? path$2.join(os$2.homedir(), envPath.slice(1)) : envPath;
	}
	function _configVault(options) {
		const debug = Boolean(options && options.debug);
		const quiet = options && "quiet" in options ? options.quiet : true;
		if (debug || !quiet) _log("Loading env from encrypted .env.vault");
		const parsed = DotenvModule._parseVault(options);
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsed, options);
		return { parsed };
	}
	function configDotenv(options) {
		const dotenvPath = path$2.resolve(process.cwd(), ".env");
		let encoding = "utf8";
		const debug = Boolean(options && options.debug);
		const quiet = options && "quiet" in options ? options.quiet : true;
		if (options && options.encoding) encoding = options.encoding;
		else if (debug) _debug("No encoding is specified. UTF-8 is used by default");
		let optionPaths = [dotenvPath];
		if (options && options.path) if (!Array.isArray(options.path)) optionPaths = [_resolveHome(options.path)];
		else {
			optionPaths = [];
			for (const filepath of options.path) optionPaths.push(_resolveHome(filepath));
		}
		let lastError;
		const parsedAll = {};
		for (const path of optionPaths) try {
			const parsed = DotenvModule.parse(fs$3.readFileSync(path, { encoding }));
			DotenvModule.populate(parsedAll, parsed, options);
		} catch (e) {
			if (debug) _debug(`Failed to load ${path} ${e.message}`);
			lastError = e;
		}
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsedAll, options);
		if (debug || !quiet) {
			const keysCount = Object.keys(parsedAll).length;
			const shortPaths = [];
			for (const filePath of optionPaths) try {
				const relative = path$2.relative(process.cwd(), filePath);
				shortPaths.push(relative);
			} catch (e) {
				if (debug) _debug(`Failed to load ${filePath} ${e.message}`);
				lastError = e;
			}
			_log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
		}
		if (lastError) return {
			parsed: parsedAll,
			error: lastError
		};
		else return { parsed: parsedAll };
	}
	function config(options) {
		if (_dotenvKey(options).length === 0) return DotenvModule.configDotenv(options);
		const vaultPath = _vaultPath(options);
		if (!vaultPath) {
			_warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
			return DotenvModule.configDotenv(options);
		}
		return DotenvModule._configVault(options);
	}
	function decrypt(encrypted, keyStr) {
		const key = Buffer.from(keyStr.slice(-64), "hex");
		let ciphertext = Buffer.from(encrypted, "base64");
		const nonce = ciphertext.subarray(0, 12);
		const authTag = ciphertext.subarray(-16);
		ciphertext = ciphertext.subarray(12, -16);
		try {
			const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
			aesgcm.setAuthTag(authTag);
			return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
		} catch (error) {
			const isRange = error instanceof RangeError;
			const invalidKeyLength = error.message === "Invalid key length";
			const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
			if (isRange || invalidKeyLength) {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			} else if (decryptionFailed) {
				const err = /* @__PURE__ */ new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
				err.code = "DECRYPTION_FAILED";
				throw err;
			} else throw error;
		}
	}
	function populate(processEnv, parsed, options = {}) {
		const debug = Boolean(options && options.debug);
		const override = Boolean(options && options.override);
		if (typeof parsed !== "object") {
			const err = /* @__PURE__ */ new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
			err.code = "OBJECT_REQUIRED";
			throw err;
		}
		for (const key of Object.keys(parsed)) if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
			if (override === true) processEnv[key] = parsed[key];
			if (debug) if (override === true) _debug(`"${key}" is already defined and WAS overwritten`);
			else _debug(`"${key}" is already defined and was NOT overwritten`);
		} else processEnv[key] = parsed[key];
	}
	var DotenvModule = {
		configDotenv,
		_configVault,
		_parseVault,
		config,
		decrypt,
		parse,
		populate
	};
	module.exports.configDotenv = DotenvModule.configDotenv;
	module.exports._configVault = DotenvModule._configVault;
	module.exports._parseVault = DotenvModule._parseVault;
	module.exports.config = DotenvModule.config;
	module.exports.decrypt = DotenvModule.decrypt;
	module.exports.parse = DotenvModule.parse;
	module.exports.populate = DotenvModule.populate;
	module.exports = DotenvModule;
}));
//#endregion
//#region src/config.ts
var config_exports = /* @__PURE__ */ __exportAll({ loadConfig: () => loadConfig });
function loadDotenv(customPath) {
	if (customPath) {
		import_main$1.config({
			path: customPath,
			override: true
		});
		return;
	}
	const searchPaths = [path$1.join(process.cwd(), ".env"), path$1.join(__dirname, "..", ".env")];
	for (const p of searchPaths) if (fs$2.existsSync(p)) {
		import_main$1.config({ path: p });
		break;
	}
}
function requireEnv(key) {
	const val = process.env[key];
	if (!val) throw new Error(`Variable de entorno requerida: ${key} (ver .env.example)`);
	return val;
}
function parseIntEnv(key, defaultValue) {
	const val = process.env[key];
	if (!val) return defaultValue;
	const parsed = parseInt(val, 10);
	if (isNaN(parsed)) throw new Error(`${key} debe ser un número entero (recibido: "${val}")`);
	return parsed;
}
function loadConfig(envPath) {
	loadDotenv(envPath);
	const printerType = process.env.PRINTER_TYPE ?? "network";
	if (![
		"network",
		"serial",
		"file"
	].includes(printerType)) throw new Error(`PRINTER_TYPE inválido: "${printerType}". Opciones: network | serial | file`);
	const paperWidth = process.env.PAPER_WIDTH ?? "80mm";
	if (!["58mm", "80mm"].includes(paperWidth)) throw new Error(`PAPER_WIDTH inválido: "${paperWidth}". Opciones: 58mm | 80mm`);
	const logLevel = process.env.LOG_LEVEL ?? "info";
	if (![
		"debug",
		"info",
		"warn",
		"error"
	].includes(logLevel)) throw new Error(`LOG_LEVEL inválido: "${logLevel}". Opciones: debug | info | warn | error`);
	return {
		token: requireEnv("MANDO_AGENT_TOKEN"),
		backendUrl: (process.env.MANDO_BACKEND_URL ?? DEFAULT_BACKEND_URL).replace(/\/$/, ""),
		printerType,
		printerHost: process.env.PRINTER_HOST,
		printerPort: parseIntEnv("PRINTER_PORT", 9100),
		serialPath: process.env.SERIAL_PATH,
		serialBaudRate: parseIntEnv("SERIAL_BAUD_RATE", 9600),
		filePath: process.env.PRINTER_FILE_PATH,
		heartbeatIntervalMs: parseIntEnv("HEARTBEAT_INTERVAL_MS", 25e3),
		paperWidth,
		logLevel
	};
}
var import_main$1, DEFAULT_BACKEND_URL;
var init_config = __esmMin((() => {
	import_main$1 = /* @__PURE__ */ __toESM(require_main());
	DEFAULT_BACKEND_URL = "https://mandobusiness-backend-nest.onrender.com";
}));
//#endregion
//#region node_modules/@serialport/parser-byte-length/dist/index.js
var require_dist$16 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ByteLengthParser = void 0;
	var stream_1$11 = __require("stream");
	/**
	* Emit data every number of bytes
	*
	* A transform stream that emits data as a buffer after a specific number of bytes are received. Runs in O(n) time.
	*/
	var ByteLengthParser = class extends stream_1$11.Transform {
		length;
		position;
		buffer;
		constructor(options) {
			super(options);
			if (typeof options.length !== "number") throw new TypeError("\"length\" is not a number");
			if (options.length < 1) throw new TypeError("\"length\" is not greater than 0");
			this.length = options.length;
			this.position = 0;
			this.buffer = Buffer.alloc(this.length);
		}
		_transform(chunk, _encoding, cb) {
			let cursor = 0;
			while (cursor < chunk.length) {
				this.buffer[this.position] = chunk[cursor];
				cursor++;
				this.position++;
				if (this.position === this.length) {
					this.push(this.buffer);
					this.buffer = Buffer.alloc(this.length);
					this.position = 0;
				}
			}
			cb();
		}
		_flush(cb) {
			this.push(this.buffer.slice(0, this.position));
			this.buffer = Buffer.alloc(this.length);
			cb();
		}
	};
	exports.ByteLengthParser = ByteLengthParser;
}));
//#endregion
//#region node_modules/@serialport/parser-cctalk/dist/index.js
var require_dist$15 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CCTalkParser = void 0;
	var stream_1$10 = __require("stream");
	/**
	* Parse the CCTalk protocol
	* @extends Transform
	*
	* A transform stream that emits CCTalk packets as they are received.
	*/
	var CCTalkParser = class extends stream_1$10.Transform {
		array;
		cursor;
		lastByteFetchTime;
		maxDelayBetweenBytesMs;
		constructor(maxDelayBetweenBytesMs = 50) {
			super();
			this.array = [];
			this.cursor = 0;
			this.lastByteFetchTime = 0;
			this.maxDelayBetweenBytesMs = maxDelayBetweenBytesMs;
		}
		_transform(buffer, encoding, cb) {
			if (this.maxDelayBetweenBytesMs > 0) {
				const now = Date.now();
				if (now - this.lastByteFetchTime > this.maxDelayBetweenBytesMs) {
					this.array = [];
					this.cursor = 0;
				}
				this.lastByteFetchTime = now;
			}
			this.cursor += buffer.length;
			Array.from(buffer).map((byte) => this.array.push(byte));
			while (this.cursor > 1 && this.cursor >= this.array[1] + 5) {
				const FullMsgLength = this.array[1] + 5;
				const frame = Buffer.from(this.array.slice(0, FullMsgLength));
				this.array = this.array.slice(frame.length, this.array.length);
				this.cursor -= FullMsgLength;
				this.push(frame);
			}
			cb();
		}
	};
	exports.CCTalkParser = CCTalkParser;
}));
//#endregion
//#region node_modules/@serialport/parser-delimiter/dist/index.js
var require_dist$14 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DelimiterParser = void 0;
	var stream_1$9 = __require("stream");
	/**
	* A transform stream that emits data each time a byte sequence is received.
	* @extends Transform
	*
	* To use the `Delimiter` parser, provide a delimiter as a string, buffer, or array of bytes. Runs in O(n) time.
	*/
	var DelimiterParser = class extends stream_1$9.Transform {
		includeDelimiter;
		delimiter;
		buffer;
		constructor({ delimiter, includeDelimiter = false, ...options }) {
			super(options);
			if (delimiter === void 0) throw new TypeError("\"delimiter\" is not a bufferable object");
			if (delimiter.length === 0) throw new TypeError("\"delimiter\" has a 0 or undefined length");
			this.includeDelimiter = includeDelimiter;
			this.delimiter = Buffer.from(delimiter);
			this.buffer = Buffer.alloc(0);
		}
		_transform(chunk, encoding, cb) {
			let data = Buffer.concat([this.buffer, chunk]);
			let position;
			while ((position = data.indexOf(this.delimiter)) !== -1) {
				this.push(data.slice(0, position + (this.includeDelimiter ? this.delimiter.length : 0)));
				data = data.slice(position + this.delimiter.length);
			}
			this.buffer = data;
			cb();
		}
		_flush(cb) {
			this.push(this.buffer);
			this.buffer = Buffer.alloc(0);
			cb();
		}
	};
	exports.DelimiterParser = DelimiterParser;
}));
//#endregion
//#region node_modules/@serialport/parser-inter-byte-timeout/dist/index.js
var require_dist$13 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.InterByteTimeoutParser = void 0;
	var stream_1$8 = __require("stream");
	/**
	* A transform stream that buffers data and emits it after not receiving any bytes for the specified amount of time or hitting a max buffer size.
	*/
	var InterByteTimeoutParser = class extends stream_1$8.Transform {
		maxBufferSize;
		currentPacket;
		interval;
		intervalID;
		constructor({ maxBufferSize = 65536, interval, ...transformOptions }) {
			super(transformOptions);
			if (!interval) throw new TypeError("\"interval\" is required");
			if (typeof interval !== "number" || Number.isNaN(interval)) throw new TypeError("\"interval\" is not a number");
			if (interval < 1) throw new TypeError("\"interval\" is not greater than 0");
			if (typeof maxBufferSize !== "number" || Number.isNaN(maxBufferSize)) throw new TypeError("\"maxBufferSize\" is not a number");
			if (maxBufferSize < 1) throw new TypeError("\"maxBufferSize\" is not greater than 0");
			this.maxBufferSize = maxBufferSize;
			this.currentPacket = [];
			this.interval = interval;
		}
		_transform(chunk, encoding, cb) {
			if (this.intervalID) clearTimeout(this.intervalID);
			for (let offset = 0; offset < chunk.length; offset++) {
				this.currentPacket.push(chunk[offset]);
				if (this.currentPacket.length >= this.maxBufferSize) this.emitPacket();
			}
			this.intervalID = setTimeout(this.emitPacket.bind(this), this.interval);
			cb();
		}
		emitPacket() {
			if (this.intervalID) clearTimeout(this.intervalID);
			if (this.currentPacket.length > 0) this.push(Buffer.from(this.currentPacket));
			this.currentPacket = [];
		}
		_flush(cb) {
			this.emitPacket();
			cb();
		}
	};
	exports.InterByteTimeoutParser = InterByteTimeoutParser;
}));
//#endregion
//#region node_modules/@serialport/parser-packet-length/dist/index.js
var require_dist$12 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.PacketLengthParser = void 0;
	var stream_1$7 = __require("stream");
	/**
	* A transform stream that decodes packets with a delimiter and length of payload
	* specified within the data stream.
	* @extends Transform
	* @summary Decodes packets of the general form:
	*       [delimiter][len][payload0] ... [payload0 + len]
	*
	* The length field can be up to 4 bytes and can be at any offset within the packet
	*       [delimiter][header0][header1][len0][len1[payload0] ... [payload0 + len]
	*
	* The offset and number of bytes of the length field need to be provided in options
	* if not 1 byte immediately following the delimiter.
	*/
	var PacketLengthParser = class extends stream_1$7.Transform {
		buffer;
		start;
		opts;
		constructor(options = {}) {
			super(options);
			const { delimiter = 170, packetOverhead = 2, lengthBytes = 1, lengthOffset = 1, maxLen = 255 } = options;
			this.opts = {
				delimiter,
				packetOverhead,
				lengthBytes,
				lengthOffset,
				maxLen
			};
			this.buffer = Buffer.alloc(0);
			this.start = false;
		}
		_transform(chunk, encoding, cb) {
			for (let ndx = 0; ndx < chunk.length; ndx++) {
				const byte = chunk[ndx];
				if (byte === this.opts.delimiter) this.start = true;
				if (true === this.start) {
					this.buffer = Buffer.concat([this.buffer, Buffer.from([byte])]);
					if (this.buffer.length >= this.opts.lengthOffset + this.opts.lengthBytes) {
						const len = this.buffer.readUIntLE(this.opts.lengthOffset, this.opts.lengthBytes);
						if (this.buffer.length == len + this.opts.packetOverhead || len > this.opts.maxLen) {
							this.push(this.buffer);
							this.buffer = Buffer.alloc(0);
							this.start = false;
						}
					}
				}
			}
			cb();
		}
		_flush(cb) {
			this.push(this.buffer);
			this.buffer = Buffer.alloc(0);
			cb();
		}
	};
	exports.PacketLengthParser = PacketLengthParser;
}));
//#endregion
//#region node_modules/@serialport/parser-readline/dist/index.js
var require_dist$11 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReadlineParser = void 0;
	var parser_delimiter_1 = require_dist$14();
	/**
	*  A transform stream that emits data after a newline delimiter is received.
	* @summary To use the `Readline` parser, provide a delimiter (defaults to `\n`). Data is emitted as string controllable by the `encoding` option (defaults to `utf8`).
	*/
	var ReadlineParser = class extends parser_delimiter_1.DelimiterParser {
		constructor(options) {
			const opts = {
				delimiter: Buffer.from("\n", "utf8"),
				encoding: "utf8",
				...options
			};
			if (typeof opts.delimiter === "string") opts.delimiter = Buffer.from(opts.delimiter, opts.encoding);
			super(opts);
		}
	};
	exports.ReadlineParser = ReadlineParser;
}));
//#endregion
//#region node_modules/@serialport/parser-ready/dist/index.js
var require_dist$10 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReadyParser = void 0;
	var stream_1$6 = __require("stream");
	/**
	* A transform stream that waits for a sequence of "ready" bytes before emitting a ready event and emitting data events
	*
	* To use the `Ready` parser provide a byte start sequence. After the bytes have been received a ready event is fired and data events are passed through.
	*/
	var ReadyParser = class extends stream_1$6.Transform {
		delimiter;
		readOffset;
		ready;
		constructor({ delimiter, ...options }) {
			if (delimiter === void 0) throw new TypeError("\"delimiter\" is not a bufferable object");
			if (delimiter.length === 0) throw new TypeError("\"delimiter\" has a 0 or undefined length");
			super(options);
			this.delimiter = Buffer.from(delimiter);
			this.readOffset = 0;
			this.ready = false;
		}
		_transform(chunk, encoding, cb) {
			if (this.ready) {
				this.push(chunk);
				return cb();
			}
			const delimiter = this.delimiter;
			let chunkOffset = 0;
			while (this.readOffset < delimiter.length && chunkOffset < chunk.length) {
				if (delimiter[this.readOffset] === chunk[chunkOffset]) this.readOffset++;
				else this.readOffset = 0;
				chunkOffset++;
			}
			if (this.readOffset === delimiter.length) {
				this.ready = true;
				this.emit("ready");
				const chunkRest = chunk.slice(chunkOffset);
				if (chunkRest.length > 0) this.push(chunkRest);
			}
			cb();
		}
	};
	exports.ReadyParser = ReadyParser;
}));
//#endregion
//#region node_modules/@serialport/parser-regex/dist/index.js
var require_dist$9 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RegexParser = void 0;
	var stream_1$5 = __require("stream");
	/**
	* A transform stream that uses a regular expression to split the incoming text upon.
	*
	* To use the `Regex` parser provide a regular expression to split the incoming text upon. Data is emitted as string controllable by the `encoding` option (defaults to `utf8`).
	*/
	var RegexParser = class extends stream_1$5.Transform {
		regex;
		data;
		constructor({ regex, ...options }) {
			const opts = {
				encoding: "utf8",
				...options
			};
			if (regex === void 0) throw new TypeError("\"options.regex\" must be a regular expression pattern or object");
			if (!(regex instanceof RegExp)) regex = new RegExp(regex.toString());
			super(opts);
			this.regex = regex;
			this.data = "";
		}
		_transform(chunk, encoding, cb) {
			const parts = (this.data + chunk).split(this.regex);
			this.data = parts.pop() || "";
			parts.forEach((part) => {
				this.push(part);
			});
			cb();
		}
		_flush(cb) {
			this.push(this.data);
			this.data = "";
			cb();
		}
	};
	exports.RegexParser = RegexParser;
}));
//#endregion
//#region node_modules/@serialport/parser-slip-encoder/dist/decoder.js
var require_decoder = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SlipDecoder = void 0;
	var stream_1$4 = __require("stream");
	/**
	* A transform stream that decodes slip encoded data.
	* @extends Transform
	*
	* Runs in O(n) time, stripping out slip encoding and emitting decoded data. Optionally custom slip escape and delimiters can be provided.
	*/
	var SlipDecoder = class extends stream_1$4.Transform {
		opts;
		buffer;
		escape;
		start;
		constructor(options = {}) {
			super(options);
			const { START, ESC = 219, END = 192, ESC_START, ESC_END = 220, ESC_ESC = 221 } = options;
			this.opts = {
				START,
				ESC,
				END,
				ESC_START,
				ESC_END,
				ESC_ESC
			};
			this.buffer = Buffer.alloc(0);
			this.escape = false;
			this.start = false;
		}
		_transform(chunk, encoding, cb) {
			for (let ndx = 0; ndx < chunk.length; ndx++) {
				let byte = chunk[ndx];
				if (byte === this.opts.START) {
					this.start = true;
					continue;
				} else if (void 0 == this.opts.START) this.start = true;
				if (this.escape) if (byte === this.opts.ESC_START && this.opts.START) byte = this.opts.START;
				else if (byte === this.opts.ESC_ESC) byte = this.opts.ESC;
				else if (byte === this.opts.ESC_END) byte = this.opts.END;
				else {
					this.escape = false;
					this.push(this.buffer);
					this.buffer = Buffer.alloc(0);
				}
				else {
					if (byte === this.opts.ESC) {
						this.escape = true;
						continue;
					}
					if (byte === this.opts.END) {
						this.push(this.buffer);
						this.buffer = Buffer.alloc(0);
						this.escape = false;
						this.start = false;
						continue;
					}
				}
				this.escape = false;
				if (this.start) this.buffer = Buffer.concat([this.buffer, Buffer.from([byte])]);
			}
			cb();
		}
		_flush(cb) {
			this.push(this.buffer);
			this.buffer = Buffer.alloc(0);
			cb();
		}
	};
	exports.SlipDecoder = SlipDecoder;
}));
//#endregion
//#region node_modules/@serialport/parser-slip-encoder/dist/encoder.js
var require_encoder = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SlipEncoder = void 0;
	var stream_1$3 = __require("stream");
	/**
	* A transform stream that emits SLIP-encoded data for each incoming packet.
	*
	* Runs in O(n) time, adding a 0xC0 character at the end of each
	* received packet and escaping characters, according to RFC 1055.
	*/
	var SlipEncoder = class extends stream_1$3.Transform {
		opts;
		constructor(options = {}) {
			super(options);
			const { START, ESC = 219, END = 192, ESC_START, ESC_END = 220, ESC_ESC = 221, bluetoothQuirk = false } = options;
			this.opts = {
				START,
				ESC,
				END,
				ESC_START,
				ESC_END,
				ESC_ESC,
				bluetoothQuirk
			};
		}
		_transform(chunk, encoding, cb) {
			const chunkLength = chunk.length;
			if (this.opts.bluetoothQuirk && chunkLength === 0) return cb();
			const encoded = Buffer.alloc(chunkLength * 2 + 2);
			let j = 0;
			if (this.opts.bluetoothQuirk == true) encoded[j++] = this.opts.END;
			if (this.opts.START !== void 0) encoded[j++] = this.opts.START;
			for (let i = 0; i < chunkLength; i++) {
				let byte = chunk[i];
				if (byte === this.opts.START && this.opts.ESC_START) {
					encoded[j++] = this.opts.ESC;
					byte = this.opts.ESC_START;
				} else if (byte === this.opts.END) {
					encoded[j++] = this.opts.ESC;
					byte = this.opts.ESC_END;
				} else if (byte === this.opts.ESC) {
					encoded[j++] = this.opts.ESC;
					byte = this.opts.ESC_ESC;
				}
				encoded[j++] = byte;
			}
			encoded[j++] = this.opts.END;
			cb(null, encoded.slice(0, j));
		}
	};
	exports.SlipEncoder = SlipEncoder;
}));
//#endregion
//#region node_modules/@serialport/parser-slip-encoder/dist/index.js
var require_dist$8 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$4) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$4, p)) __createBinding(exports$4, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_decoder(), exports);
	__exportStar(require_encoder(), exports);
}));
//#endregion
//#region node_modules/@serialport/parser-spacepacket/dist/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertHeaderBufferToObj = exports.HEADER_LENGTH = void 0;
	exports.HEADER_LENGTH = 6;
	/**
	* For numbers less than 255, will ensure that their string representation is at least 8 characters long.
	*/
	var toOctetStr = (num) => {
		let str = Number(num).toString(2);
		while (str.length < 8) str = `0${str}`;
		return str;
	};
	/**
	* Converts a Buffer of any length to an Object representation of a Space Packet header, provided
	* the received data is in the correct format.
	* @param buf - The buffer containing the Space Packet Header Data
	*/
	var convertHeaderBufferToObj = (buf) => {
		const headerStr = Array.from(buf.slice(0, exports.HEADER_LENGTH)).reduce((accum, curr) => `${accum}${toOctetStr(curr)}`, "");
		const versionNumber = headerStr.slice(0, 3) === "000" ? 1 : "UNKNOWN_VERSION";
		const type = Number(headerStr[3]);
		const secondaryHeader = Number(headerStr[4]);
		const apid = parseInt(headerStr.slice(5, 16), 2);
		const sequenceFlags = parseInt(headerStr.slice(16, 18), 2);
		const packetName = parseInt(headerStr.slice(18, 32), 2);
		const dataLength = parseInt(headerStr.slice(-16), 2) + 1;
		return {
			versionNumber,
			identification: {
				apid,
				secondaryHeader,
				type
			},
			sequenceControl: {
				packetName,
				sequenceFlags
			},
			dataLength
		};
	};
	exports.convertHeaderBufferToObj = convertHeaderBufferToObj;
}));
//#endregion
//#region node_modules/@serialport/parser-spacepacket/dist/index.js
var require_dist$7 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SpacePacketParser = void 0;
	var stream_1$2 = __require("stream");
	var utils_1 = require_utils();
	/**
	* A Transform stream that accepts a stream of octet data and converts it into an object
	* representation of a CCSDS Space Packet. See https://public.ccsds.org/Pubs/133x0b2e1.pdf for a
	* description of the Space Packet format.
	*/
	var SpacePacketParser = class extends stream_1$2.Transform {
		timeCodeFieldLength;
		ancillaryDataFieldLength;
		dataBuffer;
		headerBuffer;
		dataLength;
		expectingHeader;
		dataSlice;
		header;
		/**
		* A Transform stream that accepts a stream of octet data and emits object representations of
		* CCSDS Space Packets once a packet has been completely received.
		* @param {Object} [options] Configuration options for the stream
		* @param {Number} options.timeCodeFieldLength The length of the time code field within the data
		* @param {Number} options.ancillaryDataFieldLength The length of the ancillary data field within the data
		*/
		constructor(options = {}) {
			super({
				...options,
				objectMode: true
			});
			this.timeCodeFieldLength = options.timeCodeFieldLength || 0;
			this.ancillaryDataFieldLength = options.ancillaryDataFieldLength || 0;
			this.dataSlice = this.timeCodeFieldLength + this.ancillaryDataFieldLength;
			this.dataBuffer = Buffer.alloc(0);
			this.headerBuffer = Buffer.alloc(0);
			this.dataLength = 0;
			this.expectingHeader = true;
		}
		/**
		* Bundle the header, secondary header if present, and the data into a JavaScript object to emit.
		* If more data has been received past the current packet, begin the process of parsing the next
		* packet(s).
		*/
		pushCompletedPacket() {
			if (!this.header) throw new Error("Missing header");
			const timeCode = Buffer.from(this.dataBuffer.slice(0, this.timeCodeFieldLength));
			const ancillaryData = Buffer.from(this.dataBuffer.slice(this.timeCodeFieldLength, this.timeCodeFieldLength + this.ancillaryDataFieldLength));
			const data = Buffer.from(this.dataBuffer.slice(this.dataSlice, this.dataLength));
			const completedPacket = {
				header: { ...this.header },
				data: data.toString()
			};
			if (timeCode.length > 0 || ancillaryData.length > 0) {
				completedPacket.secondaryHeader = {};
				if (timeCode.length) completedPacket.secondaryHeader.timeCode = timeCode.toString();
				if (ancillaryData.length) completedPacket.secondaryHeader.ancillaryData = ancillaryData.toString();
			}
			this.push(completedPacket);
			const nextChunk = Buffer.from(this.dataBuffer.slice(this.dataLength));
			if (nextChunk.length >= utils_1.HEADER_LENGTH) this.extractHeader(nextChunk);
			else {
				this.headerBuffer = nextChunk;
				this.dataBuffer = Buffer.alloc(0);
				this.expectingHeader = true;
				this.dataLength = 0;
				this.header = void 0;
			}
		}
		/**
		* Build the Stream's headerBuffer property from the received Buffer chunk; extract data from it
		* if it's complete. If there's more to the chunk than just the header, initiate handling the
		* packet data.
		* @param chunk -  Build the Stream's headerBuffer property from
		*/
		extractHeader(chunk) {
			const headerAsBuffer = Buffer.concat([this.headerBuffer, chunk]);
			const startOfDataBuffer = headerAsBuffer.slice(utils_1.HEADER_LENGTH);
			if (headerAsBuffer.length >= utils_1.HEADER_LENGTH) {
				this.header = (0, utils_1.convertHeaderBufferToObj)(headerAsBuffer);
				this.dataLength = this.header.dataLength;
				this.headerBuffer = Buffer.alloc(0);
				this.expectingHeader = false;
			} else this.headerBuffer = headerAsBuffer;
			if (startOfDataBuffer.length > 0) {
				this.dataBuffer = Buffer.from(startOfDataBuffer);
				if (this.dataBuffer.length >= this.dataLength) this.pushCompletedPacket();
			}
		}
		_transform(chunk, encoding, cb) {
			if (this.expectingHeader) this.extractHeader(chunk);
			else {
				this.dataBuffer = Buffer.concat([this.dataBuffer, chunk]);
				if (this.dataBuffer.length >= this.dataLength) this.pushCompletedPacket();
			}
			cb();
		}
		_flush(cb) {
			const remaining = Buffer.concat([this.headerBuffer, this.dataBuffer]);
			const remainingArray = Array.from(remaining);
			this.push(remainingArray);
			cb();
		}
	};
	exports.SpacePacketParser = SpacePacketParser;
}));
//#endregion
//#region node_modules/ms/index.js
var require_ms$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region node_modules/debug/src/common.js
var require_common$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms$3();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			let i;
			const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
			const len = split.length;
			for (i = 0; i < len; i++) {
				if (!split[i]) continue;
				namespaces = split[i].replace(/\*/g, ".*?");
				if (namespaces[0] === "-") createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
				else createDebug.names.push(new RegExp("^" + namespaces + "$"));
			}
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			if (name[name.length - 1] === "*") return true;
			let i;
			let len;
			for (i = 0, len = createDebug.skips.length; i < len; i++) if (createDebug.skips[i].test(name)) return false;
			for (i = 0, len = createDebug.names.length; i < len; i++) if (createDebug.names[i].test(name)) return true;
			return false;
		}
		/**
		* Convert regexp to namespace
		*
		* @param {RegExp} regxep
		* @return {String} namespace
		* @api private
		*/
		function toNamespace(regexp) {
			return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region node_modules/debug/src/browser.js
var require_browser$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common$3()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region node_modules/has-flag/index.js
var require_has_flag = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (flag, argv = process.argv) => {
		const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf("--");
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
}));
//#endregion
//#region node_modules/supports-color/index.js
var require_supports_color = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var os$1 = __require("os");
	var tty$4 = __require("tty");
	var hasFlag = require_has_flag();
	var { env } = process;
	var forceColor;
	if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) forceColor = 0;
	else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) forceColor = 1;
	if ("FORCE_COLOR" in env) if (env.FORCE_COLOR === "true") forceColor = 1;
	else if (env.FORCE_COLOR === "false") forceColor = 0;
	else forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	function translateLevel(level) {
		if (level === 0) return false;
		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}
	function supportsColor(haveStream, streamIsTTY) {
		if (forceColor === 0) return 0;
		if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) return 3;
		if (hasFlag("color=256")) return 2;
		if (haveStream && !streamIsTTY && forceColor === void 0) return 0;
		const min = forceColor || 0;
		if (env.TERM === "dumb") return min;
		if (process.platform === "win32") {
			const osRelease = os$1.release().split(".");
			if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) return Number(osRelease[2]) >= 14931 ? 3 : 2;
			return 1;
		}
		if ("CI" in env) {
			if ([
				"TRAVIS",
				"CIRCLECI",
				"APPVEYOR",
				"GITLAB_CI",
				"GITHUB_ACTIONS",
				"BUILDKITE"
			].some((sign) => sign in env) || env.CI_NAME === "codeship") return 1;
			return min;
		}
		if ("TEAMCITY_VERSION" in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		if (env.COLORTERM === "truecolor") return 3;
		if ("TERM_PROGRAM" in env) {
			const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
			switch (env.TERM_PROGRAM) {
				case "iTerm.app": return version >= 3 ? 3 : 2;
				case "Apple_Terminal": return 2;
			}
		}
		if (/-256(color)?$/i.test(env.TERM)) return 2;
		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) return 1;
		if ("COLORTERM" in env) return 1;
		return min;
	}
	function getSupportLevel(stream) {
		return translateLevel(supportsColor(stream, stream && stream.isTTY));
	}
	module.exports = {
		supportsColor: getSupportLevel,
		stdout: translateLevel(supportsColor(true, tty$4.isatty(1))),
		stderr: translateLevel(supportsColor(true, tty$4.isatty(2)))
	};
}));
//#endregion
//#region node_modules/debug/src/node.js
var require_node$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var tty$3 = __require("tty");
	var util$3 = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util$3.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = require_supports_color();
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty$3.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.format()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util$3.format(...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common$3()(exports);
	var { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$3.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$3.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region node_modules/debug/src/index.js
var require_src$3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser$3();
	else module.exports = require_node$3();
}));
//#endregion
//#region node_modules/@serialport/stream/dist/index.js
var require_dist$6 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SerialPortStream = exports.DisconnectedError = void 0;
	var stream_1$1 = __require("stream");
	var debug = (0, __importDefault(require_src$3()).default)("serialport/stream");
	var DisconnectedError = class extends Error {
		disconnected;
		constructor(message) {
			super(message);
			this.disconnected = true;
		}
	};
	exports.DisconnectedError = DisconnectedError;
	var defaultSetFlags = {
		brk: false,
		cts: false,
		dtr: true,
		rts: true
	};
	function allocNewReadPool(poolSize) {
		const pool = Buffer.allocUnsafe(poolSize);
		pool.used = 0;
		return pool;
	}
	var SerialPortStream = class extends stream_1$1.Duplex {
		port;
		_pool;
		_kMinPoolSpace;
		opening;
		closing;
		settings;
		/**
		* Create a new serial port object for the `path`. In the case of invalid arguments or invalid options, when constructing a new SerialPort it will throw an error. The port will open automatically by default, which is the equivalent of calling `port.open(openCallback)` in the next tick. You can disable this by setting the option `autoOpen` to `false`.
		* @emits open
		* @emits data
		* @emits close
		* @emits error
		*/
		constructor(options, openCallback) {
			const settings = {
				autoOpen: true,
				endOnClose: false,
				highWaterMark: 64 * 1024,
				...options
			};
			super({ highWaterMark: settings.highWaterMark });
			if (!settings.binding) throw new TypeError("\"Bindings\" is invalid pass it as `options.binding`");
			if (!settings.path) throw new TypeError(`"path" is not defined: ${settings.path}`);
			if (typeof settings.baudRate !== "number") throw new TypeError(`"baudRate" must be a number: ${settings.baudRate}`);
			this.settings = settings;
			this.opening = false;
			this.closing = false;
			this._pool = allocNewReadPool(this.settings.highWaterMark);
			this._kMinPoolSpace = 128;
			if (this.settings.autoOpen) this.open(openCallback);
		}
		get path() {
			return this.settings.path;
		}
		get baudRate() {
			return this.settings.baudRate;
		}
		get isOpen() {
			return (this.port?.isOpen ?? false) && !this.closing;
		}
		_error(error, callback) {
			if (callback) callback.call(this, error);
			else this.emit("error", error);
		}
		_asyncError(error, callback) {
			process.nextTick(() => this._error(error, callback));
		}
		/**
		* Opens a connection to the given serial port.
		* @param {ErrorCallback=} openCallback - Called after a connection is opened. If this is not provided and an error occurs, it will be emitted on the port's `error` event.
		* @emits open
		*/
		open(openCallback) {
			if (this.isOpen) return this._asyncError(/* @__PURE__ */ new Error("Port is already open"), openCallback);
			if (this.opening) return this._asyncError(/* @__PURE__ */ new Error("Port is opening"), openCallback);
			const { highWaterMark, binding, autoOpen, endOnClose, ...openOptions } = this.settings;
			this.opening = true;
			debug("opening", `path: ${this.path}`);
			this.settings.binding.open(openOptions).then((port) => {
				debug("opened", `path: ${this.path}`);
				this.port = port;
				this.opening = false;
				this.emit("open");
				if (openCallback) openCallback.call(this, null);
			}, (err) => {
				this.opening = false;
				debug("Binding #open had an error", err);
				this._error(err, openCallback);
			});
		}
		/**
		* Changes the baud rate for an open port. Emits an error or calls the callback if the baud rate isn't supported.
		* @param {object=} options Only supports `baudRate`.
		* @param {number=} [options.baudRate] The baud rate of the port to be opened. This should match one of the commonly available baud rates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, or 115200. Custom rates are supported best effort per platform. The device connected to the serial port is not guaranteed to support the requested baud rate, even if the port itself supports that baud rate.
		* @param {ErrorCallback=} [callback] Called once the port's baud rate changes. If `.update` is called without a callback, and there is an error, an error event is emitted.
		* @returns {undefined}
		*/
		update(options, callback) {
			if (!this.isOpen || !this.port) {
				debug("update attempted, but port is not open");
				return this._asyncError(/* @__PURE__ */ new Error("Port is not open"), callback);
			}
			debug("update", `baudRate: ${options.baudRate}`);
			this.port.update(options).then(() => {
				debug("binding.update", "finished");
				this.settings.baudRate = options.baudRate;
				if (callback) callback.call(this, null);
			}, (err) => {
				debug("binding.update", "error", err);
				return this._error(err, callback);
			});
		}
		write(data, encoding, callback) {
			if (Array.isArray(data)) data = Buffer.from(data);
			if (typeof encoding === "function") return super.write(data, encoding);
			return super.write(data, encoding, callback);
		}
		_write(data, encoding, callback) {
			if (!this.isOpen || !this.port) {
				this.once("open", () => {
					this._write(data, encoding, callback);
				});
				return;
			}
			debug("_write", `${data.length} bytes of data`);
			this.port.write(data).then(() => {
				debug("binding.write", "write finished");
				callback(null);
			}, (err) => {
				debug("binding.write", "error", err);
				if (!err.canceled) this._disconnected(err);
				callback(err);
			});
		}
		_writev(data, callback) {
			debug("_writev", `${data.length} chunks of data`);
			const dataV = data.map((write) => write.chunk);
			this._write(Buffer.concat(dataV), void 0, callback);
		}
		_read(bytesToRead) {
			if (!this.isOpen || !this.port) {
				debug("_read", "queueing _read for after open");
				this.once("open", () => {
					this._read(bytesToRead);
				});
				return;
			}
			if (!this._pool || this._pool.length - this._pool.used < this._kMinPoolSpace) {
				debug("_read", "discarding the read buffer pool because it is below kMinPoolSpace");
				this._pool = allocNewReadPool(this.settings.highWaterMark);
			}
			const pool = this._pool;
			const toRead = Math.min(pool.length - pool.used, bytesToRead);
			const start = pool.used;
			debug("_read", `reading`, {
				start,
				toRead
			});
			this.port.read(pool, start, toRead).then(({ bytesRead }) => {
				debug("binding.read", `finished`, { bytesRead });
				if (bytesRead === 0) {
					debug("binding.read", "Zero bytes read closing readable stream");
					this.push(null);
					return;
				}
				pool.used += bytesRead;
				this.push(pool.slice(start, start + bytesRead));
			}, (err) => {
				debug("binding.read", `error`, err);
				if (!err.canceled) this._disconnected(err);
				this._read(bytesToRead);
			});
		}
		_disconnected(err) {
			if (!this.isOpen) {
				debug("disconnected aborted because already closed", err);
				return;
			}
			debug("disconnected", err);
			this.close(void 0, new DisconnectedError(err.message));
		}
		/**
		* Closes an open connection.
		*
		* If there are in progress writes when the port is closed the writes will error.
		* @param {ErrorCallback} callback Called once a connection is closed.
		* @param {Error} disconnectError used internally to propagate a disconnect error
		*/
		close(callback, disconnectError = null) {
			if (!this.isOpen || !this.port) {
				debug("close attempted, but port is not open");
				return this._asyncError(/* @__PURE__ */ new Error("Port is not open"), callback);
			}
			this.closing = true;
			debug("#close");
			this.port.close().then(() => {
				this.closing = false;
				debug("binding.close", "finished");
				this.emit("close", disconnectError);
				if (this.settings.endOnClose) this.emit("end");
				if (callback) callback.call(this, disconnectError);
			}, (err) => {
				this.closing = false;
				debug("binding.close", "had an error", err);
				return this._error(err, callback);
			});
		}
		/**
		* Set control flags on an open port. Uses [`SetCommMask`](https://msdn.microsoft.com/en-us/library/windows/desktop/aa363257(v=vs.85).aspx) for Windows and [`ioctl`](http://linux.die.net/man/4/tty_ioctl) for OS X and Linux.
		*
		* All options are operating system default when the port is opened. Every flag is set on each call to the provided or default values. If options isn't provided default options is used.
		*/
		set(options, callback) {
			if (!this.isOpen || !this.port) {
				debug("set attempted, but port is not open");
				return this._asyncError(/* @__PURE__ */ new Error("Port is not open"), callback);
			}
			const settings = {
				...defaultSetFlags,
				...options
			};
			debug("#set", settings);
			this.port.set(settings).then(() => {
				debug("binding.set", "finished");
				if (callback) callback.call(this, null);
			}, (err) => {
				debug("binding.set", "had an error", err);
				return this._error(err, callback);
			});
		}
		/**
		* Returns the control flags (CTS, DSR, DCD) on the open port.
		* Uses [`GetCommModemStatus`](https://msdn.microsoft.com/en-us/library/windows/desktop/aa363258(v=vs.85).aspx) for Windows and [`ioctl`](http://linux.die.net/man/4/tty_ioctl) for mac and linux.
		*/
		get(callback) {
			if (!this.isOpen || !this.port) {
				debug("get attempted, but port is not open");
				return this._asyncError(/* @__PURE__ */ new Error("Port is not open"), callback);
			}
			debug("#get");
			this.port.get().then((status) => {
				debug("binding.get", "finished");
				callback.call(this, null, status);
			}, (err) => {
				debug("binding.get", "had an error", err);
				return this._error(err, callback);
			});
		}
		/**
		* Flush discards data received but not read, and written but not transmitted by the operating system. For more technical details, see [`tcflush(fd, TCIOFLUSH)`](http://linux.die.net/man/3/tcflush) for Mac/Linux and [`FlushFileBuffers`](http://msdn.microsoft.com/en-us/library/windows/desktop/aa364439) for Windows.
		*/
		flush(callback) {
			if (!this.isOpen || !this.port) {
				debug("flush attempted, but port is not open");
				return this._asyncError(/* @__PURE__ */ new Error("Port is not open"), callback);
			}
			debug("#flush");
			this.port.flush().then(() => {
				debug("binding.flush", "finished");
				if (callback) callback.call(this, null);
			}, (err) => {
				debug("binding.flush", "had an error", err);
				return this._error(err, callback);
			});
		}
		/**
		* Waits until all output data is transmitted to the serial port. After any pending write has completed it calls [`tcdrain()`](http://linux.die.net/man/3/tcdrain) or [FlushFileBuffers()](https://msdn.microsoft.com/en-us/library/windows/desktop/aa364439(v=vs.85).aspx) to ensure it has been written to the device.
		* @example
		Write the `data` and wait until it has finished transmitting to the target serial port before calling the callback. This will queue until the port is open and writes are finished.
		
		```js
		function writeAndDrain (data, callback) {
		port.write(data);
		port.drain(callback);
		}
		```
		*/
		drain(callback) {
			debug("drain");
			if (!this.isOpen || !this.port) {
				debug("drain queuing on port open");
				this.once("open", () => {
					this.drain(callback);
				});
				return;
			}
			this.port.drain().then(() => {
				debug("binding.drain", "finished");
				if (callback) callback.call(this, null);
			}, (err) => {
				debug("binding.drain", "had an error", err);
				return this._error(err, callback);
			});
		}
	};
	exports.SerialPortStream = SerialPortStream;
}));
/**
* The `error` event's callback is called with an error object whenever there is an error.
* @event error
*/
/**
* The `open` event's callback is called with no arguments when the port is opened and ready for writing. This happens if you have the constructor open immediately (which opens in the next tick) or if you open the port manually with `open()`. See [Useage/Opening a Port](#opening-a-port) for more information.
* @event open
*/
/**
* Request a number of bytes from the SerialPort. The `read()` method pulls some data out of the internal buffer and returns it. If no data is available to be read, null is returned. By default, the data is returned as a `Buffer` object unless an encoding has been specified using the `.setEncoding()` method.
* @method SerialPort.prototype.read
* @param {number=} size Specify how many bytes of data to return, if available
* @returns {(string|Buffer|null)} The data from internal buffers
*/
/**
* Listening for the `data` event puts the port in flowing mode. Data is emitted as soon as it's received. Data is a `Buffer` object with a varying amount of data in it. The `readLine` parser converts the data into string lines. See the [parsers](https://serialport.io/docs/api-parsers-overview) section for more information on parsers, and the [Node.js stream documentation](https://nodejs.org/api/stream.html#stream_event_data) for more information on the data event.
* @event data
*/
/**
* The `close` event's callback is called with no arguments when the port is closed. In the case of a disconnect it will be called with a Disconnect Error object (`err.disconnected == true`). In the event of a close error (unlikely), an error event is triggered.
* @event close
*/
/**
* The `pause()` method causes a stream in flowing mode to stop emitting 'data' events, switching out of flowing mode. Any data that becomes available remains in the internal buffer.
* @method SerialPort.prototype.pause
* @see resume
* @returns `this`
*/
/**
* The `resume()` method causes an explicitly paused, `Readable` stream to resume emitting 'data' events, switching the stream into flowing mode.
* @method SerialPort.prototype.resume
* @see pause
* @returns `this`
*/
//#endregion
//#region node_modules/@serialport/binding-mock/dist/index.js
var require_dist$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var debugFactory = require_src$3();
	function _interopDefaultLegacy(e) {
		return e && typeof e === "object" && "default" in e ? e : { "default": e };
	}
	var debug = (/* @__PURE__ */ _interopDefaultLegacy(debugFactory))["default"]("serialport/binding-mock");
	var ports = {};
	var serialNumber = 0;
	function resolveNextTick() {
		return new Promise((resolve) => process.nextTick(() => resolve()));
	}
	var CanceledError = class extends Error {
		constructor(message) {
			super(message);
			this.canceled = true;
		}
	};
	var MockBinding = {
		reset() {
			ports = {};
			serialNumber = 0;
		},
		createPort(path, options = {}) {
			serialNumber++;
			const optWithDefaults = Object.assign({
				echo: false,
				record: false,
				manufacturer: "The J5 Robotics Company",
				vendorId: void 0,
				productId: void 0,
				maxReadSize: 1024
			}, options);
			ports[path] = {
				data: Buffer.alloc(0),
				echo: optWithDefaults.echo,
				record: optWithDefaults.record,
				readyData: optWithDefaults.readyData,
				maxReadSize: optWithDefaults.maxReadSize,
				info: {
					path,
					manufacturer: optWithDefaults.manufacturer,
					serialNumber: `${serialNumber}`,
					pnpId: void 0,
					locationId: void 0,
					vendorId: optWithDefaults.vendorId,
					productId: optWithDefaults.productId
				}
			};
			debug(serialNumber, "created port", JSON.stringify({
				path,
				opt: options
			}));
		},
		async list() {
			debug(null, "list");
			return Object.values(ports).map((port) => port.info);
		},
		async open(options) {
			var _a;
			if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError("\"options\" is not an object");
			if (!options.path) throw new TypeError("\"path\" is not a valid port");
			if (!options.baudRate) throw new TypeError("\"baudRate\" is not a valid baudRate");
			const openOptions = Object.assign({
				dataBits: 8,
				lock: true,
				stopBits: 1,
				parity: "none",
				rtscts: false,
				xon: false,
				xoff: false,
				xany: false,
				hupcl: true
			}, options);
			const { path } = openOptions;
			debug(null, `open: opening path ${path}`);
			const port = ports[path];
			await resolveNextTick();
			if (!port) throw new Error(`Port does not exist - please call MockBinding.createPort('${path}') first`);
			const serialNumber = port.info.serialNumber;
			if ((_a = port.openOpt) === null || _a === void 0 ? void 0 : _a.lock) {
				debug(serialNumber, "open: Port is locked cannot open");
				throw new Error("Port is locked cannot open");
			}
			debug(serialNumber, `open: opened path ${path}`);
			port.openOpt = Object.assign({}, openOptions);
			return new MockPortBinding(port, openOptions);
		}
	};
	/**
	* Mock bindings for pretend serialport access
	*/
	var MockPortBinding = class {
		constructor(port, openOptions) {
			this.port = port;
			this.openOptions = openOptions;
			this.pendingRead = null;
			this.isOpen = true;
			this.lastWrite = null;
			this.recording = Buffer.alloc(0);
			this.writeOperation = null;
			this.serialNumber = port.info.serialNumber;
			if (port.readyData) {
				const data = port.readyData;
				process.nextTick(() => {
					if (this.isOpen) {
						debug(this.serialNumber, "emitting ready data");
						this.emitData(data);
					}
				});
			}
		}
		emitData(data) {
			if (!this.isOpen || !this.port) throw new Error("Port must be open to pretend to receive data");
			const bufferData = Buffer.isBuffer(data) ? data : Buffer.from(data);
			debug(this.serialNumber, "emitting data - pending read:", Boolean(this.pendingRead));
			this.port.data = Buffer.concat([this.port.data, bufferData]);
			if (this.pendingRead) {
				process.nextTick(this.pendingRead);
				this.pendingRead = null;
			}
		}
		async close() {
			debug(this.serialNumber, "close");
			if (!this.isOpen) throw new Error("Port is not open");
			const port = this.port;
			if (!port) throw new Error("already closed");
			port.openOpt = void 0;
			port.data = Buffer.alloc(0);
			debug(this.serialNumber, "port is closed");
			this.serialNumber = void 0;
			this.isOpen = false;
			if (this.pendingRead) this.pendingRead(new CanceledError("port is closed"));
		}
		async read(buffer, offset, length) {
			if (!Buffer.isBuffer(buffer)) throw new TypeError("\"buffer\" is not a Buffer");
			if (typeof offset !== "number" || isNaN(offset)) throw new TypeError(`"offset" is not an integer got "${isNaN(offset) ? "NaN" : typeof offset}"`);
			if (typeof length !== "number" || isNaN(length)) throw new TypeError(`"length" is not an integer got "${isNaN(length) ? "NaN" : typeof length}"`);
			if (buffer.length < offset + length) throw new Error("buffer is too small");
			if (!this.isOpen) throw new Error("Port is not open");
			debug(this.serialNumber, "read", length, "bytes");
			await resolveNextTick();
			if (!this.isOpen || !this.port) throw new CanceledError("Read canceled");
			if (this.port.data.length <= 0) return new Promise((resolve, reject) => {
				this.pendingRead = (err) => {
					if (err) return reject(err);
					this.read(buffer, offset, length).then(resolve, reject);
				};
			});
			const lengthToRead = this.port.maxReadSize > length ? length : this.port.maxReadSize;
			const bytesRead = this.port.data.slice(0, lengthToRead).copy(buffer, offset);
			this.port.data = this.port.data.slice(lengthToRead);
			debug(this.serialNumber, "read", bytesRead, "bytes");
			return {
				bytesRead,
				buffer
			};
		}
		async write(buffer) {
			if (!Buffer.isBuffer(buffer)) throw new TypeError("\"buffer\" is not a Buffer");
			if (!this.isOpen || !this.port) {
				debug("write", "error port is not open");
				throw new Error("Port is not open");
			}
			debug(this.serialNumber, "write", buffer.length, "bytes");
			if (this.writeOperation) throw new Error("Overlapping writes are not supported and should be queued by the serialport object");
			this.writeOperation = (async () => {
				await resolveNextTick();
				if (!this.isOpen || !this.port) throw new Error("Write canceled");
				const data = this.lastWrite = Buffer.from(buffer);
				if (this.port.record) this.recording = Buffer.concat([this.recording, data]);
				if (this.port.echo) process.nextTick(() => {
					if (this.isOpen) this.emitData(data);
				});
				this.writeOperation = null;
				debug(this.serialNumber, "writing finished");
			})();
			return this.writeOperation;
		}
		async update(options) {
			if (typeof options !== "object") throw TypeError("\"options\" is not an object");
			if (typeof options.baudRate !== "number") throw new TypeError("\"options.baudRate\" is not a number");
			debug(this.serialNumber, "update");
			if (!this.isOpen || !this.port) throw new Error("Port is not open");
			await resolveNextTick();
			if (this.port.openOpt) this.port.openOpt.baudRate = options.baudRate;
		}
		async set(options) {
			if (typeof options !== "object") throw new TypeError("\"options\" is not an object");
			debug(this.serialNumber, "set");
			if (!this.isOpen) throw new Error("Port is not open");
			await resolveNextTick();
		}
		async get() {
			debug(this.serialNumber, "get");
			if (!this.isOpen) throw new Error("Port is not open");
			await resolveNextTick();
			return {
				cts: true,
				dsr: false,
				dcd: false
			};
		}
		async getBaudRate() {
			var _a;
			debug(this.serialNumber, "getBaudRate");
			if (!this.isOpen || !this.port) throw new Error("Port is not open");
			await resolveNextTick();
			if (!((_a = this.port.openOpt) === null || _a === void 0 ? void 0 : _a.baudRate)) throw new Error("Internal Error");
			return { baudRate: this.port.openOpt.baudRate };
		}
		async flush() {
			debug(this.serialNumber, "flush");
			if (!this.isOpen || !this.port) throw new Error("Port is not open");
			await resolveNextTick();
			this.port.data = Buffer.alloc(0);
		}
		async drain() {
			debug(this.serialNumber, "drain");
			if (!this.isOpen) throw new Error("Port is not open");
			await this.writeOperation;
			await resolveNextTick();
		}
	};
	exports.CanceledError = CanceledError;
	exports.MockBinding = MockBinding;
	exports.MockPortBinding = MockPortBinding;
}));
//#endregion
//#region node_modules/serialport/dist/serialport-mock.js
var require_serialport_mock = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SerialPortMock = void 0;
	var stream_1 = require_dist$6();
	var binding_mock_1 = require_dist$5();
	var SerialPortMock = class extends stream_1.SerialPortStream {
		static list = binding_mock_1.MockBinding.list;
		static binding = binding_mock_1.MockBinding;
		constructor(options, openCallback) {
			const opts = {
				binding: binding_mock_1.MockBinding,
				...options
			};
			super(opts, openCallback);
		}
	};
	exports.SerialPortMock = SerialPortMock;
}));
//#endregion
//#region node_modules/node-gyp-build/node-gyp-build.js
var require_node_gyp_build$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$1 = __require("fs");
	var path = __require("path");
	var os = __require("os");
	var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : __require;
	var vars = process.config && process.config.variables || {};
	var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
	var abi = process.versions.modules;
	var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
	var arch = process.env.npm_config_arch || os.arch();
	var platform = process.env.npm_config_platform || os.platform();
	var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
	var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
	var uv = (process.versions.uv || "").split(".")[0];
	module.exports = load;
	function load(dir) {
		return runtimeRequire(load.resolve(dir));
	}
	load.resolve = load.path = function(dir) {
		dir = path.resolve(dir || ".");
		try {
			var name = runtimeRequire(path.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
			if (process.env[name + "_PREBUILD"]) dir = process.env[name + "_PREBUILD"];
		} catch (err) {}
		if (!prebuildsOnly) {
			var release = getFirst(path.join(dir, "build/Release"), matchBuild);
			if (release) return release;
			var debug = getFirst(path.join(dir, "build/Debug"), matchBuild);
			if (debug) return debug;
		}
		var prebuild = resolve(dir);
		if (prebuild) return prebuild;
		var nearby = resolve(path.dirname(process.execPath));
		if (nearby) return nearby;
		var target = [
			"platform=" + platform,
			"arch=" + arch,
			"runtime=" + runtime,
			"abi=" + abi,
			"uv=" + uv,
			armv ? "armv=" + armv : "",
			"libc=" + libc,
			"node=" + process.versions.node,
			process.versions.electron ? "electron=" + process.versions.electron : "",
			typeof __webpack_require__ === "function" ? "webpack=true" : ""
		].filter(Boolean).join(" ");
		throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
		function resolve(dir) {
			var tuple = readdirSync(path.join(dir, "prebuilds")).map(parseTuple).filter(matchTuple(platform, arch)).sort(compareTuples)[0];
			if (!tuple) return;
			var prebuilds = path.join(dir, "prebuilds", tuple.name);
			var winner = readdirSync(prebuilds).map(parseTags).filter(matchTags(runtime, abi)).sort(compareTags(runtime))[0];
			if (winner) return path.join(prebuilds, winner.file);
		}
	};
	function readdirSync(dir) {
		try {
			return fs$1.readdirSync(dir);
		} catch (err) {
			return [];
		}
	}
	function getFirst(dir, filter) {
		var files = readdirSync(dir).filter(filter);
		return files[0] && path.join(dir, files[0]);
	}
	function matchBuild(name) {
		return /\.node$/.test(name);
	}
	function parseTuple(name) {
		var arr = name.split("-");
		if (arr.length !== 2) return;
		var platform = arr[0];
		var architectures = arr[1].split("+");
		if (!platform) return;
		if (!architectures.length) return;
		if (!architectures.every(Boolean)) return;
		return {
			name,
			platform,
			architectures
		};
	}
	function matchTuple(platform, arch) {
		return function(tuple) {
			if (tuple == null) return false;
			if (tuple.platform !== platform) return false;
			return tuple.architectures.includes(arch);
		};
	}
	function compareTuples(a, b) {
		return a.architectures.length - b.architectures.length;
	}
	function parseTags(file) {
		var arr = file.split(".");
		var extension = arr.pop();
		var tags = {
			file,
			specificity: 0
		};
		if (extension !== "node") return;
		for (var i = 0; i < arr.length; i++) {
			var tag = arr[i];
			if (tag === "node" || tag === "electron" || tag === "node-webkit") tags.runtime = tag;
			else if (tag === "napi") tags.napi = true;
			else if (tag.slice(0, 3) === "abi") tags.abi = tag.slice(3);
			else if (tag.slice(0, 2) === "uv") tags.uv = tag.slice(2);
			else if (tag.slice(0, 4) === "armv") tags.armv = tag.slice(4);
			else if (tag === "glibc" || tag === "musl") tags.libc = tag;
			else continue;
			tags.specificity++;
		}
		return tags;
	}
	function matchTags(runtime, abi) {
		return function(tags) {
			if (tags == null) return false;
			if (tags.runtime !== runtime && !runtimeAgnostic(tags)) return false;
			if (tags.abi !== abi && !tags.napi) return false;
			if (tags.uv && tags.uv !== uv) return false;
			if (tags.armv && tags.armv !== armv) return false;
			if (tags.libc && tags.libc !== libc) return false;
			return true;
		};
	}
	function runtimeAgnostic(tags) {
		return tags.runtime === "node" && tags.napi;
	}
	function compareTags(runtime) {
		return function(a, b) {
			if (a.runtime !== b.runtime) return a.runtime === runtime ? -1 : 1;
			else if (a.abi !== b.abi) return a.abi ? -1 : 1;
			else if (a.specificity !== b.specificity) return a.specificity > b.specificity ? -1 : 1;
			else return 0;
		};
	}
	function isNwjs() {
		return !!(process.versions && process.versions.nw);
	}
	function isElectron() {
		if (process.versions && process.versions.electron) return true;
		if (process.env.ELECTRON_RUN_AS_NODE) return true;
		return typeof window !== "undefined" && window.process && window.process.type === "renderer";
	}
	function isAlpine(platform) {
		return platform === "linux" && fs$1.existsSync("/etc/alpine-release");
	}
	load.parseTags = parseTags;
	load.matchTags = matchTags;
	load.compareTags = compareTags;
	load.parseTuple = parseTuple;
	load.matchTuple = matchTuple;
	load.compareTuples = compareTuples;
}));
//#endregion
//#region node_modules/node-gyp-build/index.js
var require_node_gyp_build = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	if (typeof process.addon === "function") module.exports = process.addon.bind(process);
	else module.exports = require_node_gyp_build$1();
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/load-bindings.js
var require_load_bindings = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.asyncWrite = exports.asyncRead = exports.asyncUpdate = exports.asyncSet = exports.asyncOpen = exports.asyncList = exports.asyncGetBaudRate = exports.asyncGet = exports.asyncFlush = exports.asyncDrain = exports.asyncClose = void 0;
	var node_gyp_build_1 = __importDefault(require_node_gyp_build());
	var util_1$2 = __require("util");
	var path_1$1 = __require("path");
	var binding = (0, node_gyp_build_1.default)((0, path_1$1.join)(__dirname, "../"));
	exports.asyncClose = binding.close ? (0, util_1$2.promisify)(binding.close) : async () => {
		throw new Error("\"binding.close\" Method not implemented");
	};
	exports.asyncDrain = binding.drain ? (0, util_1$2.promisify)(binding.drain) : async () => {
		throw new Error("\"binding.drain\" Method not implemented");
	};
	exports.asyncFlush = binding.flush ? (0, util_1$2.promisify)(binding.flush) : async () => {
		throw new Error("\"binding.flush\" Method not implemented");
	};
	exports.asyncGet = binding.get ? (0, util_1$2.promisify)(binding.get) : async () => {
		throw new Error("\"binding.get\" Method not implemented");
	};
	exports.asyncGetBaudRate = binding.getBaudRate ? (0, util_1$2.promisify)(binding.getBaudRate) : async () => {
		throw new Error("\"binding.getBaudRate\" Method not implemented");
	};
	exports.asyncList = binding.list ? (0, util_1$2.promisify)(binding.list) : async () => {
		throw new Error("\"binding.list\" Method not implemented");
	};
	exports.asyncOpen = binding.open ? (0, util_1$2.promisify)(binding.open) : async () => {
		throw new Error("\"binding.open\" Method not implemented");
	};
	exports.asyncSet = binding.set ? (0, util_1$2.promisify)(binding.set) : async () => {
		throw new Error("\"binding.set\" Method not implemented");
	};
	exports.asyncUpdate = binding.update ? (0, util_1$2.promisify)(binding.update) : async () => {
		throw new Error("\"binding.update\" Method not implemented");
	};
	exports.asyncRead = binding.read ? (0, util_1$2.promisify)(binding.read) : async () => {
		throw new Error("\"binding.read\" Method not implemented");
	};
	exports.asyncWrite = binding.write ? (0, util_1$2.promisify)(binding.write) : async () => {
		throw new Error("\"binding.write\" Method not implemented");
	};
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BindingsError = void 0;
	var BindingsError = class extends Error {
		constructor(message, { canceled = false } = {}) {
			super(message);
			this.canceled = canceled;
		}
	};
	exports.BindingsError = BindingsError;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/poller.js
var require_poller = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Poller = exports.EVENTS = void 0;
	var debug_1 = __importDefault(require_src$3());
	var events_1 = __require("events");
	var path_1 = __require("path");
	var node_gyp_build_1 = __importDefault(require_node_gyp_build());
	var errors_1 = require_errors();
	var { Poller: PollerBindings } = (0, node_gyp_build_1.default)((0, path_1.join)(__dirname, "../"));
	var logger = (0, debug_1.default)("serialport/bindings-cpp/poller");
	exports.EVENTS = {
		UV_READABLE: 1,
		UV_WRITABLE: 2,
		UV_DISCONNECT: 4
	};
	function handleEvent(error, eventFlag) {
		if (error) {
			logger("error", error);
			this.emit("readable", error);
			this.emit("writable", error);
			this.emit("disconnect", error);
			return;
		}
		if (eventFlag & exports.EVENTS.UV_READABLE) {
			logger("received \"readable\"");
			this.emit("readable", null);
		}
		if (eventFlag & exports.EVENTS.UV_WRITABLE) {
			logger("received \"writable\"");
			this.emit("writable", null);
		}
		if (eventFlag & exports.EVENTS.UV_DISCONNECT) {
			logger("received \"disconnect\"");
			this.emit("disconnect", null);
		}
	}
	/**
	* Polls unix systems for readable or writable states of a file or serialport
	*/
	var Poller = class extends events_1.EventEmitter {
		constructor(fd, FDPoller = PollerBindings) {
			logger("Creating poller");
			super();
			this.poller = new FDPoller(fd, handleEvent.bind(this));
		}
		/**
		* Wait for the next event to occur
		* @param {string} event ('readable'|'writable'|'disconnect')
		* @returns {Poller} returns itself
		*/
		once(event, callback) {
			switch (event) {
				case "readable":
					this.poll(exports.EVENTS.UV_READABLE);
					break;
				case "writable":
					this.poll(exports.EVENTS.UV_WRITABLE);
					break;
				case "disconnect":
					this.poll(exports.EVENTS.UV_DISCONNECT);
					break;
			}
			return super.once(event, callback);
		}
		/**
		* Ask the bindings to listen for an event, it is recommend to use `.once()` for easy use
		* @param {EVENTS} eventFlag polls for an event or group of events based upon a flag.
		*/
		poll(eventFlag = 0) {
			if (eventFlag & exports.EVENTS.UV_READABLE) logger("Polling for \"readable\"");
			if (eventFlag & exports.EVENTS.UV_WRITABLE) logger("Polling for \"writable\"");
			if (eventFlag & exports.EVENTS.UV_DISCONNECT) logger("Polling for \"disconnect\"");
			this.poller.poll(eventFlag);
		}
		/**
		* Stop listening for events and cancel all outstanding listening with an error
		*/
		stop() {
			logger("Stopping poller");
			this.poller.stop();
			this.emitCanceled();
		}
		destroy() {
			logger("Destroying poller");
			this.poller.destroy();
			this.emitCanceled();
		}
		emitCanceled() {
			const err = new errors_1.BindingsError("Canceled", { canceled: true });
			this.emit("readable", err);
			this.emit("writable", err);
			this.emit("disconnect", err);
		}
	};
	exports.Poller = Poller;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/unix-read.js
var require_unix_read = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.unixRead = void 0;
	var util_1$1 = __require("util");
	var fs_1$1 = __require("fs");
	var errors_1 = require_errors();
	var logger = (0, __importDefault(require_src$3()).default)("serialport/bindings-cpp/unixRead");
	var readAsync = (0, util_1$1.promisify)(fs_1$1.read);
	var readable = (binding) => {
		return new Promise((resolve, reject) => {
			if (!binding.poller) throw new Error("No poller on bindings");
			binding.poller.once("readable", (err) => err ? reject(err) : resolve());
		});
	};
	var unixRead = async ({ binding, buffer, offset, length, fsReadAsync = readAsync }) => {
		logger("Starting read");
		if (!binding.isOpen || !binding.fd) throw new errors_1.BindingsError("Port is not open", { canceled: true });
		try {
			const { bytesRead } = await fsReadAsync(binding.fd, buffer, offset, length, null);
			if (bytesRead === 0) return (0, exports.unixRead)({
				binding,
				buffer,
				offset,
				length,
				fsReadAsync
			});
			logger("Finished read", bytesRead, "bytes");
			return {
				bytesRead,
				buffer
			};
		} catch (err) {
			logger("read error", err);
			if (err.code === "EAGAIN" || err.code === "EWOULDBLOCK" || err.code === "EINTR") {
				if (!binding.isOpen) throw new errors_1.BindingsError("Port is not open", { canceled: true });
				logger("waiting for readable because of code:", err.code);
				await readable(binding);
				return (0, exports.unixRead)({
					binding,
					buffer,
					offset,
					length,
					fsReadAsync
				});
			}
			if (err.code === "EBADF" || err.code === "ENXIO" || err.code === "UNKNOWN" || err.errno === -1) {
				err.disconnect = true;
				logger("disconnecting", err);
			}
			throw err;
		}
	};
	exports.unixRead = unixRead;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/unix-write.js
var require_unix_write = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.unixWrite = void 0;
	var fs_1 = __require("fs");
	var debug_1 = __importDefault(require_src$3());
	var util_1 = __require("util");
	var logger = (0, debug_1.default)("serialport/bindings-cpp/unixWrite");
	var writeAsync = (0, util_1.promisify)(fs_1.write);
	var writable = (binding) => {
		return new Promise((resolve, reject) => {
			binding.poller.once("writable", (err) => err ? reject(err) : resolve());
		});
	};
	var unixWrite = async ({ binding, buffer, offset = 0, fsWriteAsync = writeAsync }) => {
		const bytesToWrite = buffer.length - offset;
		logger("Starting write", buffer.length, "bytes offset", offset, "bytesToWrite", bytesToWrite);
		if (!binding.isOpen || !binding.fd) throw new Error("Port is not open");
		try {
			const { bytesWritten } = await fsWriteAsync(binding.fd, buffer, offset, bytesToWrite);
			logger("write returned: wrote", bytesWritten, "bytes");
			if (bytesWritten + offset < buffer.length) {
				if (!binding.isOpen) throw new Error("Port is not open");
				return (0, exports.unixWrite)({
					binding,
					buffer,
					offset: bytesWritten + offset,
					fsWriteAsync
				});
			}
			logger("Finished writing", bytesWritten + offset, "bytes");
		} catch (err) {
			logger("write errored", err);
			if (err.code === "EAGAIN" || err.code === "EWOULDBLOCK" || err.code === "EINTR") {
				if (!binding.isOpen) throw new Error("Port is not open");
				logger("waiting for writable because of code:", err.code);
				await writable(binding);
				return (0, exports.unixWrite)({
					binding,
					buffer,
					offset,
					fsWriteAsync
				});
			}
			if (err.code === "EBADF" || err.code === "ENXIO" || err.code === "UNKNOWN" || err.errno === -1) {
				err.disconnect = true;
				logger("disconnecting", err);
			}
			logger("error", err);
			throw err;
		}
	};
	exports.unixWrite = unixWrite;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/darwin.js
var require_darwin = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DarwinPortBinding = exports.DarwinBinding = void 0;
	var debug_1 = __importDefault(require_src$3());
	var load_bindings_1 = require_load_bindings();
	var poller_1 = require_poller();
	var unix_read_1 = require_unix_read();
	var unix_write_1 = require_unix_write();
	var debug = (0, debug_1.default)("serialport/bindings-cpp");
	exports.DarwinBinding = {
		list() {
			debug("list");
			return (0, load_bindings_1.asyncList)();
		},
		async open(options) {
			if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError("\"options\" is not an object");
			if (!options.path) throw new TypeError("\"path\" is not a valid port");
			if (!options.baudRate) throw new TypeError("\"baudRate\" is not a valid baudRate");
			debug("open");
			const openOptions = Object.assign({
				vmin: 1,
				vtime: 0,
				dataBits: 8,
				lock: true,
				stopBits: 1,
				parity: "none",
				rtscts: false,
				xon: false,
				xoff: false,
				xany: false,
				hupcl: true
			}, options);
			return new DarwinPortBinding(await (0, load_bindings_1.asyncOpen)(openOptions.path, openOptions), openOptions);
		}
	};
	/**
	* The Darwin binding layer for OSX
	*/
	var DarwinPortBinding = class {
		constructor(fd, options) {
			this.fd = fd;
			this.openOptions = options;
			this.poller = new poller_1.Poller(fd);
			this.writeOperation = null;
		}
		get isOpen() {
			return this.fd !== null;
		}
		async close() {
			debug("close");
			if (!this.isOpen) throw new Error("Port is not open");
			const fd = this.fd;
			this.poller.stop();
			this.poller.destroy();
			this.fd = null;
			await (0, load_bindings_1.asyncClose)(fd);
		}
		async read(buffer, offset, length) {
			if (!Buffer.isBuffer(buffer)) throw new TypeError("\"buffer\" is not a Buffer");
			if (typeof offset !== "number" || isNaN(offset)) throw new TypeError(`"offset" is not an integer got "${isNaN(offset) ? "NaN" : typeof offset}"`);
			if (typeof length !== "number" || isNaN(length)) throw new TypeError(`"length" is not an integer got "${isNaN(length) ? "NaN" : typeof length}"`);
			debug("read");
			if (buffer.length < offset + length) throw new Error("buffer is too small");
			if (!this.isOpen) throw new Error("Port is not open");
			return (0, unix_read_1.unixRead)({
				binding: this,
				buffer,
				offset,
				length
			});
		}
		async write(buffer) {
			if (!Buffer.isBuffer(buffer)) throw new TypeError("\"buffer\" is not a Buffer");
			debug("write", buffer.length, "bytes");
			if (!this.isOpen) {
				debug("write", "error port is not open");
				throw new Error("Port is not open");
			}
			this.writeOperation = (async () => {
				if (buffer.length === 0) return;
				await (0, unix_write_1.unixWrite)({
					binding: this,
					buffer
				});
				this.writeOperation = null;
			})();
			return this.writeOperation;
		}
		async update(options) {
			if (!options || typeof options !== "object" || Array.isArray(options)) throw TypeError("\"options\" is not an object");
			if (typeof options.baudRate !== "number") throw new TypeError("\"options.baudRate\" is not a number");
			debug("update");
			if (!this.isOpen) throw new Error("Port is not open");
			await (0, load_bindings_1.asyncUpdate)(this.fd, options);
		}
		async set(options) {
			if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError("\"options\" is not an object");
			debug("set", options);
			if (!this.isOpen) throw new Error("Port is not open");
			await (0, load_bindings_1.asyncSet)(this.fd, options);
		}
		async get() {
			debug("get");
			if (!this.isOpen) throw new Error("Port is not open");
			return (0, load_bindings_1.asyncGet)(this.fd);
		}
		async getBaudRate() {
			debug("getBaudRate");
			if (!this.isOpen) throw new Error("Port is not open");
			throw new Error("getBaudRate is not implemented on darwin");
		}
		async flush() {
			debug("flush");
			if (!this.isOpen) throw new Error("Port is not open");
			await (0, load_bindings_1.asyncFlush)(this.fd);
		}
		async drain() {
			debug("drain");
			if (!this.isOpen) throw new Error("Port is not open");
			await this.writeOperation;
			await (0, load_bindings_1.asyncDrain)(this.fd);
		}
	};
	exports.DarwinPortBinding = DarwinPortBinding;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/node_modules/@serialport/parser-delimiter/dist/index.js
var require_dist$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DelimiterParser = void 0;
	var stream_1 = __require("stream");
	/**
	* A transform stream that emits data each time a byte sequence is received.
	* @extends Transform
	*
	* To use the `Delimiter` parser, provide a delimiter as a string, buffer, or array of bytes. Runs in O(n) time.
	*/
	var DelimiterParser = class extends stream_1.Transform {
		constructor({ delimiter, includeDelimiter = false, ...options }) {
			super(options);
			if (delimiter === void 0) throw new TypeError("\"delimiter\" is not a bufferable object");
			if (delimiter.length === 0) throw new TypeError("\"delimiter\" has a 0 or undefined length");
			this.includeDelimiter = includeDelimiter;
			this.delimiter = Buffer.from(delimiter);
			this.buffer = Buffer.alloc(0);
		}
		_transform(chunk, encoding, cb) {
			let data = Buffer.concat([this.buffer, chunk]);
			let position;
			while ((position = data.indexOf(this.delimiter)) !== -1) {
				this.push(data.slice(0, position + (this.includeDelimiter ? this.delimiter.length : 0)));
				data = data.slice(position + this.delimiter.length);
			}
			this.buffer = data;
			cb();
		}
		_flush(cb) {
			this.push(this.buffer);
			this.buffer = Buffer.alloc(0);
			cb();
		}
	};
	exports.DelimiterParser = DelimiterParser;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/node_modules/@serialport/parser-readline/dist/index.js
var require_dist$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReadlineParser = void 0;
	var parser_delimiter_1 = require_dist$4();
	/**
	*  A transform stream that emits data after a newline delimiter is received.
	* @summary To use the `Readline` parser, provide a delimiter (defaults to `\n`). Data is emitted as string controllable by the `encoding` option (defaults to `utf8`).
	*/
	var ReadlineParser = class extends parser_delimiter_1.DelimiterParser {
		constructor(options) {
			const opts = {
				delimiter: Buffer.from("\n", "utf8"),
				encoding: "utf8",
				...options
			};
			if (typeof opts.delimiter === "string") opts.delimiter = Buffer.from(opts.delimiter, opts.encoding);
			super(opts);
		}
	};
	exports.ReadlineParser = ReadlineParser;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/linux-list.js
var require_linux_list = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.linuxList = void 0;
	var child_process_1 = __require("child_process");
	var parser_readline_1 = require_dist$3();
	function checkPathOfDevice(path) {
		return /(tty(S|WCH|ACM|USB|AMA|MFD|O|XRUSB)|rfcomm)/.test(path) && path;
	}
	function propName(name) {
		return {
			DEVNAME: "path",
			ID_VENDOR_ENC: "manufacturer",
			ID_SERIAL_SHORT: "serialNumber",
			ID_VENDOR_ID: "vendorId",
			ID_MODEL_ID: "productId",
			DEVLINKS: "pnpId",
			/**
			* Workaround for systemd defect
			* see https://github.com/serialport/bindings-cpp/issues/115
			*/
			ID_USB_VENDOR_ENC: "manufacturer",
			ID_USB_SERIAL_SHORT: "serialNumber",
			ID_USB_VENDOR_ID: "vendorId",
			ID_USB_MODEL_ID: "productId"
		}[name.toUpperCase()];
	}
	function decodeHexEscape(str) {
		return str.replace(/\\x([a-fA-F0-9]{2})/g, (a, b) => {
			return String.fromCharCode(parseInt(b, 16));
		});
	}
	function propVal(name, val) {
		if (name === "pnpId") {
			const match = val.match(/\/by-id\/([^\s]+)/);
			return (match === null || match === void 0 ? void 0 : match[1]) || void 0;
		}
		if (name === "manufacturer") return decodeHexEscape(val);
		if (/^0x/.test(val)) return val.substr(2);
		return val;
	}
	function linuxList(spawnCmd = child_process_1.spawn) {
		const ports = [];
		const udevadm = spawnCmd("udevadm", ["info", "-e"]);
		const lines = udevadm.stdout.pipe(new parser_readline_1.ReadlineParser());
		let skipPort = false;
		let port = {
			path: "",
			manufacturer: void 0,
			serialNumber: void 0,
			pnpId: void 0,
			locationId: void 0,
			vendorId: void 0,
			productId: void 0
		};
		lines.on("data", (line) => {
			const lineType = line.slice(0, 1);
			const data = line.slice(3);
			if (lineType === "P") {
				port = {
					path: "",
					manufacturer: void 0,
					serialNumber: void 0,
					pnpId: void 0,
					locationId: void 0,
					vendorId: void 0,
					productId: void 0
				};
				skipPort = false;
				return;
			}
			if (skipPort) return;
			if (lineType === "N") {
				if (checkPathOfDevice(data)) ports.push(port);
				else skipPort = true;
				return;
			}
			if (lineType === "E") {
				const keyValue = data.match(/^(.+)=(.*)/);
				if (!keyValue) return;
				const key = propName(keyValue[1]);
				if (!key) return;
				port[key] = propVal(key, keyValue[2]);
			}
		});
		return new Promise((resolve, reject) => {
			udevadm.on("close", (code) => {
				if (code) reject(/* @__PURE__ */ new Error(`Error listing ports udevadm exited with error code: ${code}`));
			});
			udevadm.on("error", reject);
			lines.on("error", reject);
			lines.on("finish", () => resolve(ports));
		});
	}
	exports.linuxList = linuxList;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/linux.js
var require_linux = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.LinuxPortBinding = exports.LinuxBinding = void 0;
	var debug_1 = __importDefault(require_src$3());
	var linux_list_1 = require_linux_list();
	var poller_1 = require_poller();
	var unix_read_1 = require_unix_read();
	var unix_write_1 = require_unix_write();
	var load_bindings_1 = require_load_bindings();
	var debug = (0, debug_1.default)("serialport/bindings-cpp");
	exports.LinuxBinding = {
		list() {
			debug("list");
			return (0, linux_list_1.linuxList)();
		},
		async open(options) {
			if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError("\"options\" is not an object");
			if (!options.path) throw new TypeError("\"path\" is not a valid port");
			if (!options.baudRate) throw new TypeError("\"baudRate\" is not a valid baudRate");
			debug("open");
			const openOptions = Object.assign({
				vmin: 1,
				vtime: 0,
				dataBits: 8,
				lock: true,
				stopBits: 1,
				parity: "none",
				rtscts: false,
				xon: false,
				xoff: false,
				xany: false,
				hupcl: true
			}, options);
			const fd = await (0, load_bindings_1.asyncOpen)(openOptions.path, openOptions);
			this.fd = fd;
			return new LinuxPortBinding(fd, openOptions);
		}
	};
	/**
	* The linux binding layer
	*/
	var LinuxPortBinding = class {
		constructor(fd, openOptions) {
			this.fd = fd;
			this.openOptions = openOptions;
			this.poller = new poller_1.Poller(fd);
			this.writeOperation = null;
		}
		get isOpen() {
			return this.fd !== null;
		}
		async close() {
			debug("close");
			if (!this.isOpen) throw new Error("Port is not open");
			const fd = this.fd;
			this.poller.stop();
			this.poller.destroy();
			this.fd = null;
			await (0, load_bindings_1.asyncClose)(fd);
		}
		async read(buffer, offset, length) {
			if (!Buffer.isBuffer(buffer)) throw new TypeError("\"buffer\" is not a Buffer");
			if (typeof offset !== "number" || isNaN(offset)) throw new TypeError(`"offset" is not an integer got "${isNaN(offset) ? "NaN" : typeof offset}"`);
			if (typeof length !== "number" || isNaN(length)) throw new TypeError(`"length" is not an integer got "${isNaN(length) ? "NaN" : typeof length}"`);
			debug("read");
			if (buffer.length < offset + length) throw new Error("buffer is too small");
			if (!this.isOpen) throw new Error("Port is not open");
			return (0, unix_read_1.unixRead)({
				binding: this,
				buffer,
				offset,
				length
			});
		}
		async write(buffer) {
			if (!Buffer.isBuffer(buffer)) throw new TypeError("\"buffer\" is not a Buffer");
			debug("write", buffer.length, "bytes");
			if (!this.isOpen) {
				debug("write", "error port is not open");
				throw new Error("Port is not open");
			}
			this.writeOperation = (async () => {
				if (buffer.length === 0) return;
				await (0, unix_write_1.unixWrite)({
					binding: this,
					buffer
				});
				this.writeOperation = null;
			})();
			return this.writeOperation;
		}
		async update(options) {
			if (!options || typeof options !== "object" || Array.isArray(options)) throw TypeError("\"options\" is not an object");
			if (typeof options.baudRate !== "number") throw new TypeError("\"options.baudRate\" is not a number");
			debug("update");
			if (!this.isOpen) throw new Error("Port is not open");
			await (0, load_bindings_1.asyncUpdate)(this.fd, options);
		}
		async set(options) {
			if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError("\"options\" is not an object");
			debug("set");
			if (!this.isOpen) throw new Error("Port is not open");
			await (0, load_bindings_1.asyncSet)(this.fd, options);
		}
		async get() {
			debug("get");
			if (!this.isOpen) throw new Error("Port is not open");
			return (0, load_bindings_1.asyncGet)(this.fd);
		}
		async getBaudRate() {
			debug("getBaudRate");
			if (!this.isOpen) throw new Error("Port is not open");
			return (0, load_bindings_1.asyncGetBaudRate)(this.fd);
		}
		async flush() {
			debug("flush");
			if (!this.isOpen) throw new Error("Port is not open");
			await (0, load_bindings_1.asyncFlush)(this.fd);
		}
		async drain() {
			debug("drain");
			if (!this.isOpen) throw new Error("Port is not open");
			await this.writeOperation;
			await (0, load_bindings_1.asyncDrain)(this.fd);
		}
	};
	exports.LinuxPortBinding = LinuxPortBinding;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/win32-sn-parser.js
var require_win32_sn_parser = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.serialNumParser = void 0;
	var PARSERS = [/USB\\(?:.+)\\(.+)/, /FTDIBUS\\(?:.+)\+(.+?)A?\\.+/];
	var serialNumParser = (pnpId) => {
		if (!pnpId) return null;
		for (const parser of PARSERS) {
			const sn = pnpId.match(parser);
			if (sn) return sn[1];
		}
		return null;
	};
	exports.serialNumParser = serialNumParser;
}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/win32.js
var require_win32 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.WindowsPortBinding = exports.WindowsBinding = void 0;
	var debug_1 = __importDefault(require_src$3());
	var _1 = require_dist$1();
	var load_bindings_1 = require_load_bindings();
	var win32_sn_parser_1 = require_win32_sn_parser();
	var debug = (0, debug_1.default)("serialport/bindings-cpp");
	exports.WindowsBinding = {
		async list() {
			return (await (0, load_bindings_1.asyncList)()).map((port) => {
				if (port.pnpId && !port.serialNumber) {
					const serialNumber = (0, win32_sn_parser_1.serialNumParser)(port.pnpId);
					if (serialNumber) return Object.assign(Object.assign({}, port), { serialNumber });
				}
				return port;
			});
		},
		async open(options) {
			if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError("\"options\" is not an object");
			if (!options.path) throw new TypeError("\"path\" is not a valid port");
			if (!options.baudRate) throw new TypeError("\"baudRate\" is not a valid baudRate");
			debug("open");
			const openOptions = Object.assign({
				dataBits: 8,
				lock: true,
				stopBits: 1,
				parity: "none",
				rtscts: false,
				rtsMode: "handshake",
				xon: false,
				xoff: false,
				xany: false,
				hupcl: true
			}, options);
			return new WindowsPortBinding(await (0, load_bindings_1.asyncOpen)(openOptions.path, openOptions), openOptions);
		}
	};
	/**
	* The Windows binding layer
	*/
	var WindowsPortBinding = class {
		constructor(fd, options) {
			this.fd = fd;
			this.openOptions = options;
			this.writeOperation = null;
		}
		get isOpen() {
			return this.fd !== null;
		}
		async close() {
			debug("close");
			if (!this.isOpen) throw new Error("Port is not open");
			const fd = this.fd;
			this.fd = null;
			await (0, load_bindings_1.asyncClose)(fd);
		}
		async read(buffer, offset, length) {
			if (!Buffer.isBuffer(buffer)) throw new TypeError("\"buffer\" is not a Buffer");
			if (typeof offset !== "number" || isNaN(offset)) throw new TypeError(`"offset" is not an integer got "${isNaN(offset) ? "NaN" : typeof offset}"`);
			if (typeof length !== "number" || isNaN(length)) throw new TypeError(`"length" is not an integer got "${isNaN(length) ? "NaN" : typeof length}"`);
			debug("read");
			if (buffer.length < offset + length) throw new Error("buffer is too small");
			if (!this.isOpen) throw new Error("Port is not open");
			try {
				return {
					bytesRead: await (0, load_bindings_1.asyncRead)(this.fd, buffer, offset, length),
					buffer
				};
			} catch (err) {
				if (!this.isOpen) throw new _1.BindingsError(err.message, { canceled: true });
				throw err;
			}
		}
		async write(buffer) {
			if (!Buffer.isBuffer(buffer)) throw new TypeError("\"buffer\" is not a Buffer");
			debug("write", buffer.length, "bytes");
			if (!this.isOpen) {
				debug("write", "error port is not open");
				throw new Error("Port is not open");
			}
			this.writeOperation = (async () => {
				if (buffer.length === 0) return;
				await (0, load_bindings_1.asyncWrite)(this.fd, buffer);
				this.writeOperation = null;
			})();
			return this.writeOperation;
		}
		async update(options) {
			if (!options || typeof options !== "object" || Array.isArray(options)) throw TypeError("\"options\" is not an object");
			if (typeof options.baudRate !== "number") throw new TypeError("\"options.baudRate\" is not a number");
			debug("update");
			if (!this.isOpen) throw new Error("Port is not open");
			await (0, load_bindings_1.asyncUpdate)(this.fd, options);
		}
		async set(options) {
			if (!options || typeof options !== "object" || Array.isArray(options)) throw new TypeError("\"options\" is not an object");
			debug("set", options);
			if (!this.isOpen) throw new Error("Port is not open");
			await (0, load_bindings_1.asyncSet)(this.fd, options);
		}
		async get() {
			debug("get");
			if (!this.isOpen) throw new Error("Port is not open");
			return (0, load_bindings_1.asyncGet)(this.fd);
		}
		async getBaudRate() {
			debug("getBaudRate");
			if (!this.isOpen) throw new Error("Port is not open");
			return (0, load_bindings_1.asyncGetBaudRate)(this.fd);
		}
		async flush() {
			debug("flush");
			if (!this.isOpen) throw new Error("Port is not open");
			await (0, load_bindings_1.asyncFlush)(this.fd);
		}
		async drain() {
			debug("drain");
			if (!this.isOpen) throw new Error("Port is not open");
			await this.writeOperation;
			await (0, load_bindings_1.asyncDrain)(this.fd);
		}
	};
	exports.WindowsPortBinding = WindowsPortBinding;
}));
//#endregion
//#region node_modules/@serialport/bindings-interface/dist/index.js
var require_dist$2 = /* @__PURE__ */ __commonJSMin((() => {}));
//#endregion
//#region node_modules/@serialport/bindings-cpp/dist/index.js
var require_dist$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$3) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$3, p)) __createBinding(exports$3, m, p);
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.autoDetect = void 0;
	var debug_1 = __importDefault(require_src$3());
	var darwin_1 = require_darwin();
	var linux_1 = require_linux();
	var win32_1 = require_win32();
	var debug = (0, debug_1.default)("serialport/bindings-cpp");
	__exportStar(require_dist$2(), exports);
	__exportStar(require_darwin(), exports);
	__exportStar(require_linux(), exports);
	__exportStar(require_win32(), exports);
	__exportStar(require_errors(), exports);
	/**
	* This is an auto detected binding for your current platform
	*/
	function autoDetect() {
		switch (process.platform) {
			case "win32":
				debug("loading WindowsBinding");
				return win32_1.WindowsBinding;
			case "darwin":
				debug("loading DarwinBinding");
				return darwin_1.DarwinBinding;
			default:
				debug("loading LinuxBinding");
				return linux_1.LinuxBinding;
		}
	}
	exports.autoDetect = autoDetect;
}));
//#endregion
//#region node_modules/serialport/dist/serialport.js
var require_serialport = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SerialPort = void 0;
	var stream_1 = require_dist$6();
	var DetectedBinding = (0, require_dist$1().autoDetect)();
	var SerialPort = class extends stream_1.SerialPortStream {
		static list = DetectedBinding.list;
		static binding = DetectedBinding;
		constructor(options, openCallback) {
			const opts = {
				binding: DetectedBinding,
				...options
			};
			super(opts, openCallback);
		}
	};
	exports.SerialPort = SerialPort;
}));
//#endregion
//#region node_modules/serialport/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$2) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$2, p)) __createBinding(exports$2, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	__exportStar(require_dist$16(), exports);
	__exportStar(require_dist$15(), exports);
	__exportStar(require_dist$14(), exports);
	__exportStar(require_dist$13(), exports);
	__exportStar(require_dist$12(), exports);
	__exportStar(require_dist$11(), exports);
	__exportStar(require_dist$10(), exports);
	__exportStar(require_dist$9(), exports);
	__exportStar(require_dist$8(), exports);
	__exportStar(require_dist$7(), exports);
	__exportStar(require_serialport_mock(), exports);
	__exportStar(require_serialport(), exports);
}));
//#endregion
//#region src/printer.ts
var printer_exports = /* @__PURE__ */ __exportAll({
	FilePrinter: () => FilePrinter,
	NetworkPrinter: () => NetworkPrinter,
	SerialPrinter: () => SerialPrinter,
	createPrinter: () => createPrinter
});
async function createPrinter(config) {
	switch (config.printerType) {
		case "network":
			if (!config.printerHost) throw new Error("PRINTER_HOST es requerido para el modo de impresora de red");
			return new NetworkPrinter(config.printerHost, config.printerPort);
		case "serial": {
			if (!config.serialPath) throw new Error("SERIAL_PATH es requerido para el modo de impresora serial");
			const printer = new SerialPrinter(config.serialPath, config.serialBaudRate);
			await printer.init();
			return printer;
		}
		case "file":
			if (!config.filePath) throw new Error("PRINTER_FILE_PATH es requerido para el modo de impresora de archivo");
			return new FilePrinter(config.filePath);
		default: {
			const exhaustive = config.printerType;
			throw new Error(`Tipo de impresora desconocido: ${exhaustive}`);
		}
	}
}
var NetworkPrinter, SerialPrinter, FilePrinter;
var init_printer = __esmMin((() => {
	NetworkPrinter = class {
		constructor(host, port, timeoutMs = 5e3) {
			this.host = host;
			this.port = port;
			this.timeoutMs = timeoutMs;
		}
		print(bytes) {
			return new Promise((resolve, reject) => {
				const socket = net$1.createConnection({
					host: this.host,
					port: this.port
				}, () => {
					socket.write(Buffer.from(bytes), (err) => {
						if (err) {
							socket.destroy();
							reject(err);
						} else {
							socket.end();
							resolve();
						}
					});
				});
				socket.setTimeout(this.timeoutMs);
				socket.on("timeout", () => {
					socket.destroy();
					reject(/* @__PURE__ */ new Error(`Tiempo de espera agotado conectando a ${this.host}:${this.port}`));
				});
				socket.on("error", reject);
			});
		}
	};
	SerialPrinter = class {
		constructor(path, baudRate) {
			this.path = path;
			this.baudRate = baudRate;
		}
		async init() {
			let SerialPort;
			try {
				({SerialPort} = require_dist());
			} catch {
				throw new Error("El paquete \"serialport\" no está instalado. Ejecuta: npm install serialport");
			}
			this.sp = new SerialPort({
				path: this.path,
				baudRate: this.baudRate
			});
			await new Promise((resolve, reject) => {
				this.sp.on("open", resolve);
				this.sp.on("error", reject);
			});
		}
		print(bytes) {
			return new Promise((resolve, reject) => {
				this.sp.write(Buffer.from(bytes), (err) => {
					if (err) reject(err);
					else this.sp.drain((drainErr) => {
						if (drainErr) reject(drainErr);
						else resolve();
					});
				});
			});
		}
	};
	FilePrinter = class {
		constructor(filePath) {
			this.filePath = filePath;
		}
		async print(bytes) {
			fs$2.appendFileSync(this.filePath, Buffer.from(bytes));
		}
	};
}));
//#endregion
//#region node_modules/xmlhttprequest-ssl/lib/XMLHttpRequest.js
var require_XMLHttpRequest = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Wrapper for built-in http.js to emulate the browser XMLHttpRequest object.
	*
	* This can be used with JS designed for browsers to improve reuse of code and
	* allow the use of existing libraries.
	*
	* Usage: include("XMLHttpRequest.js") and use XMLHttpRequest per W3C specs.
	*
	* @author Dan DeFelippi <dan@driverdan.com>
	* @contributor David Ellis <d.f.ellis@ieee.org>
	* @license MIT
	*/
	var fs = __require("fs");
	var Url = __require("url");
	var spawn = __require("child_process").spawn;
	/**
	* Module exports.
	*/
	module.exports = XMLHttpRequest$2;
	XMLHttpRequest$2.XMLHttpRequest = XMLHttpRequest$2;
	/**
	* `XMLHttpRequest` constructor.
	*
	* Supported options for the `opts` object are:
	*
	*  - `agent`: An http.Agent instance; http.globalAgent may be used; if 'undefined', agent usage is disabled
	*
	* @param {Object} opts optional "options" object
	*/
	function XMLHttpRequest$2(opts) {
		"use strict";
		opts = opts || {};
		/**
		* Private variables
		*/
		var self = this;
		var http = __require("http");
		var https = __require("https");
		var request;
		var response;
		var settings = {};
		var disableHeaderCheck = false;
		var defaultHeaders = {
			"User-Agent": "node-XMLHttpRequest",
			"Accept": "*/*"
		};
		var headers = Object.assign({}, defaultHeaders);
		var forbiddenRequestHeaders = [
			"accept-charset",
			"accept-encoding",
			"access-control-request-headers",
			"access-control-request-method",
			"connection",
			"content-length",
			"content-transfer-encoding",
			"cookie",
			"cookie2",
			"date",
			"expect",
			"host",
			"keep-alive",
			"origin",
			"referer",
			"te",
			"trailer",
			"transfer-encoding",
			"upgrade",
			"via"
		];
		var forbiddenRequestMethods = [
			"TRACE",
			"TRACK",
			"CONNECT"
		];
		var sendFlag = false;
		var errorFlag = false;
		var abortedFlag = false;
		var listeners = {};
		/**
		* Constants
		*/
		this.UNSENT = 0;
		this.OPENED = 1;
		this.HEADERS_RECEIVED = 2;
		this.LOADING = 3;
		this.DONE = 4;
		/**
		* Public vars
		*/
		this.readyState = this.UNSENT;
		this.onreadystatechange = null;
		this.responseText = "";
		this.responseXML = "";
		this.response = Buffer.alloc(0);
		this.status = null;
		this.statusText = null;
		/**
		* Private methods
		*/
		/**
		* Check if the specified header is allowed.
		*
		* @param string header Header to validate
		* @return boolean False if not allowed, otherwise true
		*/
		var isAllowedHttpHeader = function(header) {
			return disableHeaderCheck || header && forbiddenRequestHeaders.indexOf(header.toLowerCase()) === -1;
		};
		/**
		* Check if the specified method is allowed.
		*
		* @param string method Request method to validate
		* @return boolean False if not allowed, otherwise true
		*/
		var isAllowedHttpMethod = function(method) {
			return method && forbiddenRequestMethods.indexOf(method) === -1;
		};
		/**
		* Public methods
		*/
		/**
		* Open the connection. Currently supports local server requests.
		*
		* @param string method Connection method (eg GET, POST)
		* @param string url URL for the connection.
		* @param boolean async Asynchronous connection. Default is true.
		* @param string user Username for basic authentication (optional)
		* @param string password Password for basic authentication (optional)
		*/
		this.open = function(method, url, async, user, password) {
			this.abort();
			errorFlag = false;
			abortedFlag = false;
			if (!isAllowedHttpMethod(method)) throw new Error("SecurityError: Request method not allowed");
			settings = {
				"method": method,
				"url": url.toString(),
				"async": typeof async !== "boolean" ? true : async,
				"user": user || null,
				"password": password || null
			};
			setState(this.OPENED);
		};
		/**
		* Disables or enables isAllowedHttpHeader() check the request. Enabled by default.
		* This does not conform to the W3C spec.
		*
		* @param boolean state Enable or disable header checking.
		*/
		this.setDisableHeaderCheck = function(state) {
			disableHeaderCheck = state;
		};
		/**
		* Sets a header for the request.
		*
		* @param string header Header name
		* @param string value Header value
		* @return boolean Header added
		*/
		this.setRequestHeader = function(header, value) {
			if (this.readyState != this.OPENED) throw new Error("INVALID_STATE_ERR: setRequestHeader can only be called when state is OPEN");
			if (!isAllowedHttpHeader(header)) {
				console.warn("Refused to set unsafe header \"" + header + "\"");
				return false;
			}
			if (sendFlag) throw new Error("INVALID_STATE_ERR: send flag is true");
			headers[header] = value;
			return true;
		};
		/**
		* Gets a header from the server response.
		*
		* @param string header Name of header to get.
		* @return string Text of the header or null if it doesn't exist.
		*/
		this.getResponseHeader = function(header) {
			if (typeof header === "string" && this.readyState > this.OPENED && response.headers[header.toLowerCase()] && !errorFlag) return response.headers[header.toLowerCase()];
			return null;
		};
		/**
		* Gets all the response headers.
		*
		* @return string A string with all response headers separated by CR+LF
		*/
		this.getAllResponseHeaders = function() {
			if (this.readyState < this.HEADERS_RECEIVED || errorFlag) return "";
			var result = "";
			for (var i in response.headers) if (i !== "set-cookie" && i !== "set-cookie2") result += i + ": " + response.headers[i] + "\r\n";
			return result.substr(0, result.length - 2);
		};
		/**
		* Gets a request header
		*
		* @param string name Name of header to get
		* @return string Returns the request header or empty string if not set
		*/
		this.getRequestHeader = function(name) {
			if (typeof name === "string" && headers[name]) return headers[name];
			return "";
		};
		/**
		* Sends the request to the server.
		*
		* @param string data Optional data to send as request body.
		*/
		this.send = function(data) {
			if (this.readyState != this.OPENED) throw new Error("INVALID_STATE_ERR: connection must be opened before send() is called");
			if (sendFlag) throw new Error("INVALID_STATE_ERR: send has already been called");
			var ssl = false, local = false;
			var url = Url.parse(settings.url);
			var host;
			switch (url.protocol) {
				case "https:": ssl = true;
				case "http:":
					host = url.hostname;
					break;
				case "file:":
					local = true;
					break;
				case void 0:
				case "":
					host = "localhost";
					break;
				default: throw new Error("Protocol not supported.");
			}
			if (local) {
				if (settings.method !== "GET") throw new Error("XMLHttpRequest: Only GET method is supported");
				if (settings.async) fs.readFile(unescape(url.pathname), function(error, data) {
					if (error) self.handleError(error, error.errno || -1);
					else {
						self.status = 200;
						self.responseText = data.toString("utf8");
						self.response = data;
						setState(self.DONE);
					}
				});
				else try {
					this.response = fs.readFileSync(unescape(url.pathname));
					this.responseText = this.response.toString("utf8");
					this.status = 200;
					setState(self.DONE);
				} catch (e) {
					this.handleError(e, e.errno || -1);
				}
				return;
			}
			var port = url.port || (ssl ? 443 : 80);
			var uri = url.pathname + (url.search ? url.search : "");
			headers["Host"] = host;
			if (!(ssl && port === 443 || port === 80)) headers["Host"] += ":" + url.port;
			if (settings.user) {
				if (typeof settings.password == "undefined") settings.password = "";
				var authBuf = new Buffer(settings.user + ":" + settings.password);
				headers["Authorization"] = "Basic " + authBuf.toString("base64");
			}
			if (settings.method === "GET" || settings.method === "HEAD") data = null;
			else if (data) {
				headers["Content-Length"] = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data);
				if (!Object.keys(headers).some(function(h) {
					return h.toLowerCase() === "content-type";
				})) headers["Content-Type"] = "text/plain;charset=UTF-8";
			} else if (settings.method === "POST") headers["Content-Length"] = 0;
			var agent = opts.agent || false;
			var options = {
				host,
				port,
				path: uri,
				method: settings.method,
				headers,
				agent
			};
			if (ssl) {
				options.pfx = opts.pfx;
				options.key = opts.key;
				options.passphrase = opts.passphrase;
				options.cert = opts.cert;
				options.ca = opts.ca;
				options.ciphers = opts.ciphers;
				options.rejectUnauthorized = opts.rejectUnauthorized === false ? false : true;
			}
			errorFlag = false;
			if (settings.async) {
				var doRequest = ssl ? https.request : http.request;
				sendFlag = true;
				self.dispatchEvent("readystatechange");
				var responseHandler = function(resp) {
					response = resp;
					if (response.statusCode === 302 || response.statusCode === 303 || response.statusCode === 307) {
						settings.url = response.headers.location;
						var url = Url.parse(settings.url);
						host = url.hostname;
						var newOptions = {
							hostname: url.hostname,
							port: url.port,
							path: url.path,
							method: response.statusCode === 303 ? "GET" : settings.method,
							headers
						};
						if (ssl) {
							newOptions.pfx = opts.pfx;
							newOptions.key = opts.key;
							newOptions.passphrase = opts.passphrase;
							newOptions.cert = opts.cert;
							newOptions.ca = opts.ca;
							newOptions.ciphers = opts.ciphers;
							newOptions.rejectUnauthorized = opts.rejectUnauthorized === false ? false : true;
						}
						request = doRequest(newOptions, responseHandler).on("error", errorHandler);
						request.end();
						return;
					}
					setState(self.HEADERS_RECEIVED);
					self.status = response.statusCode;
					response.on("data", function(chunk) {
						if (chunk) {
							var data = Buffer.from(chunk);
							self.response = Buffer.concat([self.response, data]);
						}
						if (sendFlag) setState(self.LOADING);
					});
					response.on("end", function() {
						if (sendFlag) {
							sendFlag = false;
							setState(self.DONE);
							self.responseText = self.response.toString("utf8");
						}
					});
					response.on("error", function(error) {
						self.handleError(error);
					});
				};
				var errorHandler = function(error) {
					if (request.reusedSocket && error.code === "ECONNRESET") return doRequest(options, responseHandler).on("error", errorHandler);
					self.handleError(error);
				};
				request = doRequest(options, responseHandler).on("error", errorHandler);
				if (opts.autoUnref) request.on("socket", (socket) => {
					socket.unref();
				});
				if (data) request.write(data);
				request.end();
				self.dispatchEvent("loadstart");
			} else {
				var contentFile = ".node-xmlhttprequest-content-" + process.pid;
				var syncFile = ".node-xmlhttprequest-sync-" + process.pid;
				fs.writeFileSync(syncFile, "", "utf8");
				var execString = "var http = require('http'), https = require('https'), fs = require('fs');var doRequest = http" + (ssl ? "s" : "") + ".request;var options = " + JSON.stringify(options) + ";var responseText = '';var responseData = Buffer.alloc(0);var req = doRequest(options, function(response) {response.on('data', function(chunk) {  var data = Buffer.from(chunk);  responseText += data.toString('utf8');  responseData = Buffer.concat([responseData, data]);});response.on('end', function() {fs.writeFileSync('" + contentFile + "', JSON.stringify({err: null, data: {statusCode: response.statusCode, headers: response.headers, text: responseText, data: responseData.toString('base64')}}), 'utf8');fs.unlinkSync('" + syncFile + "');});response.on('error', function(error) {fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');fs.unlinkSync('" + syncFile + "');});}).on('error', function(error) {fs.writeFileSync('" + contentFile + "', 'NODE-XMLHTTPREQUEST-ERROR:' + JSON.stringify(error), 'utf8');fs.unlinkSync('" + syncFile + "');});" + (data ? "req.write('" + JSON.stringify(data).slice(1, -1).replace(/'/g, "\\'") + "');" : "") + "req.end();";
				var syncProc = spawn(process.argv[0], ["-e", execString]);
				while (fs.existsSync(syncFile));
				self.responseText = fs.readFileSync(contentFile, "utf8");
				syncProc.stdin.end();
				fs.unlinkSync(contentFile);
				if (self.responseText.match(/^NODE-XMLHTTPREQUEST-ERROR:/)) {
					var errorObj = JSON.parse(self.responseText.replace(/^NODE-XMLHTTPREQUEST-ERROR:/, ""));
					self.handleError(errorObj, 503);
				} else {
					self.status = self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:([0-9]*),.*/, "$1");
					var resp = JSON.parse(self.responseText.replace(/^NODE-XMLHTTPREQUEST-STATUS:[0-9]*,(.*)/, "$1"));
					response = {
						statusCode: self.status,
						headers: resp.data.headers
					};
					self.responseText = resp.data.text;
					self.response = Buffer.from(resp.data.data, "base64");
					setState(self.DONE, true);
				}
			}
		};
		/**
		* Called when an error is encountered to deal with it.
		* @param  status  {number}    HTTP status code to use rather than the default (0) for XHR errors.
		*/
		this.handleError = function(error, status) {
			this.status = status || 0;
			this.statusText = error;
			this.responseText = error.stack;
			errorFlag = true;
			setState(this.DONE);
		};
		/**
		* Aborts a request.
		*/
		this.abort = function() {
			if (request) {
				request.abort();
				request = null;
			}
			headers = Object.assign({}, defaultHeaders);
			this.responseText = "";
			this.responseXML = "";
			this.response = Buffer.alloc(0);
			errorFlag = abortedFlag = true;
			if (this.readyState !== this.UNSENT && (this.readyState !== this.OPENED || sendFlag) && this.readyState !== this.DONE) {
				sendFlag = false;
				setState(this.DONE);
			}
			this.readyState = this.UNSENT;
		};
		/**
		* Adds an event listener. Preferred method of binding to events.
		*/
		this.addEventListener = function(event, callback) {
			if (!(event in listeners)) listeners[event] = [];
			listeners[event].push(callback);
		};
		/**
		* Remove an event callback that has already been bound.
		* Only works on the matching funciton, cannot be a copy.
		*/
		this.removeEventListener = function(event, callback) {
			if (event in listeners) listeners[event] = listeners[event].filter(function(ev) {
				return ev !== callback;
			});
		};
		/**
		* Dispatch any events, including both "on" methods and events attached using addEventListener.
		*/
		this.dispatchEvent = function(event) {
			if (typeof self["on" + event] === "function") if (this.readyState === this.DONE && settings.async) setTimeout(function() {
				self["on" + event]();
			}, 0);
			else self["on" + event]();
			if (event in listeners) for (let i = 0, len = listeners[event].length; i < len; i++) if (this.readyState === this.DONE) setTimeout(function() {
				listeners[event][i].call(self);
			}, 0);
			else listeners[event][i].call(self);
		};
		/**
		* Changes readyState and calls onreadystatechange.
		*
		* @param int state New state
		*/
		var setState = function(state) {
			if (self.readyState === state || self.readyState === self.UNSENT && abortedFlag) return;
			self.readyState = state;
			if (settings.async || self.readyState < self.OPENED || self.readyState === self.DONE) self.dispatchEvent("readystatechange");
			if (self.readyState === self.DONE) {
				let fire;
				if (abortedFlag) fire = "abort";
				else if (errorFlag) fire = "error";
				else fire = "load";
				self.dispatchEvent(fire);
				self.dispatchEvent("loadend");
			}
		};
	}
}));
//#endregion
//#region node_modules/engine.io-parser/build/esm/commons.js
var PACKET_TYPES, PACKET_TYPES_REVERSE, ERROR_PACKET;
var init_commons = __esmMin((() => {
	PACKET_TYPES = Object.create(null);
	PACKET_TYPES["open"] = "0";
	PACKET_TYPES["close"] = "1";
	PACKET_TYPES["ping"] = "2";
	PACKET_TYPES["pong"] = "3";
	PACKET_TYPES["message"] = "4";
	PACKET_TYPES["upgrade"] = "5";
	PACKET_TYPES["noop"] = "6";
	PACKET_TYPES_REVERSE = Object.create(null);
	Object.keys(PACKET_TYPES).forEach((key) => {
		PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
	});
	ERROR_PACKET = {
		type: "error",
		data: "parser error"
	};
}));
//#endregion
//#region node_modules/engine.io-parser/build/esm/encodePacket.js
function encodePacketToBinary(packet, callback) {
	if (packet.data instanceof ArrayBuffer || ArrayBuffer.isView(packet.data)) return callback(toBuffer(packet.data, false));
	encodePacket(packet, true, (encoded) => {
		if (!TEXT_ENCODER) TEXT_ENCODER = new TextEncoder();
		callback(TEXT_ENCODER.encode(encoded));
	});
}
var encodePacket, toBuffer, TEXT_ENCODER;
var init_encodePacket = __esmMin((() => {
	init_commons();
	encodePacket = ({ type, data }, supportsBinary, callback) => {
		if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) return callback(supportsBinary ? data : "b" + toBuffer(data, true).toString("base64"));
		return callback(PACKET_TYPES[type] + (data || ""));
	};
	toBuffer = (data, forceBufferConversion) => {
		if (Buffer.isBuffer(data) || data instanceof Uint8Array && !forceBufferConversion) return data;
		else if (data instanceof ArrayBuffer) return Buffer.from(data);
		else return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
	};
}));
//#endregion
//#region node_modules/engine.io-parser/build/esm/decodePacket.js
var decodePacket, mapBinary;
var init_decodePacket = __esmMin((() => {
	init_commons();
	decodePacket = (encodedPacket, binaryType) => {
		if (typeof encodedPacket !== "string") return {
			type: "message",
			data: mapBinary(encodedPacket, binaryType)
		};
		const type = encodedPacket.charAt(0);
		if (type === "b") return {
			type: "message",
			data: mapBinary(Buffer.from(encodedPacket.substring(1), "base64"), binaryType)
		};
		if (!PACKET_TYPES_REVERSE[type]) return ERROR_PACKET;
		return encodedPacket.length > 1 ? {
			type: PACKET_TYPES_REVERSE[type],
			data: encodedPacket.substring(1)
		} : { type: PACKET_TYPES_REVERSE[type] };
	};
	mapBinary = (data, binaryType) => {
		switch (binaryType) {
			case "arraybuffer": if (data instanceof ArrayBuffer) return data;
			else if (Buffer.isBuffer(data)) return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
			else return data.buffer;
			default: if (Buffer.isBuffer(data)) return data;
			else return Buffer.from(data);
		}
	};
}));
//#endregion
//#region node_modules/engine.io-parser/build/esm/index.js
function createPacketEncoderStream() {
	return new TransformStream({ transform(packet, controller) {
		encodePacketToBinary(packet, (encodedPacket) => {
			const payloadLength = encodedPacket.length;
			let header;
			if (payloadLength < 126) {
				header = new Uint8Array(1);
				new DataView(header.buffer).setUint8(0, payloadLength);
			} else if (payloadLength < 65536) {
				header = new Uint8Array(3);
				const view = new DataView(header.buffer);
				view.setUint8(0, 126);
				view.setUint16(1, payloadLength);
			} else {
				header = new Uint8Array(9);
				const view = new DataView(header.buffer);
				view.setUint8(0, 127);
				view.setBigUint64(1, BigInt(payloadLength));
			}
			if (packet.data && typeof packet.data !== "string") header[0] |= 128;
			controller.enqueue(header);
			controller.enqueue(encodedPacket);
		});
	} });
}
function totalLength(chunks) {
	return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
}
function concatChunks(chunks, size) {
	if (chunks[0].length === size) return chunks.shift();
	const buffer = new Uint8Array(size);
	let j = 0;
	for (let i = 0; i < size; i++) {
		buffer[i] = chunks[0][j++];
		if (j === chunks[0].length) {
			chunks.shift();
			j = 0;
		}
	}
	if (chunks.length && j < chunks[0].length) chunks[0] = chunks[0].slice(j);
	return buffer;
}
function createPacketDecoderStream(maxPayload, binaryType) {
	if (!TEXT_DECODER) TEXT_DECODER = new TextDecoder();
	const chunks = [];
	let state = 0;
	let expectedLength = -1;
	let isBinary = false;
	return new TransformStream({ transform(chunk, controller) {
		chunks.push(chunk);
		while (true) {
			if (state === 0) {
				if (totalLength(chunks) < 1) break;
				const header = concatChunks(chunks, 1);
				isBinary = (header[0] & 128) === 128;
				expectedLength = header[0] & 127;
				if (expectedLength < 126) state = 3;
				else if (expectedLength === 126) state = 1;
				else state = 2;
			} else if (state === 1) {
				if (totalLength(chunks) < 2) break;
				const headerArray = concatChunks(chunks, 2);
				expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
				state = 3;
			} else if (state === 2) {
				if (totalLength(chunks) < 8) break;
				const headerArray = concatChunks(chunks, 8);
				const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
				const n = view.getUint32(0);
				if (n > Math.pow(2, 21) - 1) {
					controller.enqueue(ERROR_PACKET);
					break;
				}
				expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
				state = 3;
			} else {
				if (totalLength(chunks) < expectedLength) break;
				const data = concatChunks(chunks, expectedLength);
				controller.enqueue(decodePacket(isBinary ? data : TEXT_DECODER.decode(data), binaryType));
				state = 0;
			}
			if (expectedLength === 0 || expectedLength > maxPayload) {
				controller.enqueue(ERROR_PACKET);
				break;
			}
		}
	} });
}
var SEPARATOR, encodePayload, decodePayload, TEXT_DECODER;
var init_esm$1 = __esmMin((() => {
	init_encodePacket();
	init_decodePacket();
	init_commons();
	SEPARATOR = String.fromCharCode(30);
	encodePayload = (packets, callback) => {
		const length = packets.length;
		const encodedPackets = new Array(length);
		let count = 0;
		packets.forEach((packet, i) => {
			encodePacket(packet, false, (encodedPacket) => {
				encodedPackets[i] = encodedPacket;
				if (++count === length) callback(encodedPackets.join(SEPARATOR));
			});
		});
	};
	decodePayload = (encodedPayload, binaryType) => {
		const encodedPackets = encodedPayload.split(SEPARATOR);
		const packets = [];
		for (let i = 0; i < encodedPackets.length; i++) {
			const decodedPacket = decodePacket(encodedPackets[i], binaryType);
			packets.push(decodedPacket);
			if (decodedPacket.type === "error") break;
		}
		return packets;
	};
}));
//#endregion
//#region node_modules/@socket.io/component-emitter/lib/esm/index.js
/**
* Initialize a new `Emitter`.
*
* @api public
*/
function Emitter(obj) {
	if (obj) return mixin(obj);
}
/**
* Mixin the emitter properties.
*
* @param {Object} obj
* @return {Object}
* @api private
*/
function mixin(obj) {
	for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
	return obj;
}
var init_esm = __esmMin((() => {
	/**
	* Listen on the given `event` with `fn`.
	*
	* @param {String} event
	* @param {Function} fn
	* @return {Emitter}
	* @api public
	*/
	Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
		this._callbacks = this._callbacks || {};
		(this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
		return this;
	};
	/**
	* Adds an `event` listener that will be invoked a single
	* time then automatically removed.
	*
	* @param {String} event
	* @param {Function} fn
	* @return {Emitter}
	* @api public
	*/
	Emitter.prototype.once = function(event, fn) {
		function on() {
			this.off(event, on);
			fn.apply(this, arguments);
		}
		on.fn = fn;
		this.on(event, on);
		return this;
	};
	/**
	* Remove the given callback for `event` or all
	* registered callbacks.
	*
	* @param {String} event
	* @param {Function} fn
	* @return {Emitter}
	* @api public
	*/
	Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
		this._callbacks = this._callbacks || {};
		if (0 == arguments.length) {
			this._callbacks = {};
			return this;
		}
		var callbacks = this._callbacks["$" + event];
		if (!callbacks) return this;
		if (1 == arguments.length) {
			delete this._callbacks["$" + event];
			return this;
		}
		var cb;
		for (var i = 0; i < callbacks.length; i++) {
			cb = callbacks[i];
			if (cb === fn || cb.fn === fn) {
				callbacks.splice(i, 1);
				break;
			}
		}
		if (callbacks.length === 0) delete this._callbacks["$" + event];
		return this;
	};
	/**
	* Emit `event` with the given args.
	*
	* @param {String} event
	* @param {Mixed} ...
	* @return {Emitter}
	*/
	Emitter.prototype.emit = function(event) {
		this._callbacks = this._callbacks || {};
		var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
		for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
		if (callbacks) {
			callbacks = callbacks.slice(0);
			for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args);
		}
		return this;
	};
	Emitter.prototype.emitReserved = Emitter.prototype.emit;
	/**
	* Return array of callbacks for `event`.
	*
	* @param {String} event
	* @return {Array}
	* @api public
	*/
	Emitter.prototype.listeners = function(event) {
		this._callbacks = this._callbacks || {};
		return this._callbacks["$" + event] || [];
	};
	/**
	* Check if this emitter has `event` handlers.
	*
	* @param {String} event
	* @return {Boolean}
	* @api public
	*/
	Emitter.prototype.hasListeners = function(event) {
		return !!this.listeners(event).length;
	};
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/globals.node.js
function createCookieJar() {
	return new CookieJar();
}
/**
* @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
*/
function parse$1(setCookieString) {
	const parts = setCookieString.split("; ");
	const i = parts[0].indexOf("=");
	if (i === -1) return;
	const name = parts[0].substring(0, i).trim();
	if (!name.length) return;
	let value = parts[0].substring(i + 1).trim();
	if (value.charCodeAt(0) === 34) value = value.slice(1, -1);
	const cookie = {
		name,
		value
	};
	for (let j = 1; j < parts.length; j++) {
		const subParts = parts[j].split("=");
		if (subParts.length !== 2) continue;
		const key = subParts[0].trim();
		const value = subParts[1].trim();
		switch (key) {
			case "Expires":
				cookie.expires = new Date(value);
				break;
			case "Max-Age":
				const expiration = /* @__PURE__ */ new Date();
				expiration.setUTCSeconds(expiration.getUTCSeconds() + parseInt(value, 10));
				cookie.expires = expiration;
				break;
			default:
		}
	}
	return cookie;
}
var nextTick, globalThisShim, defaultBinaryType, CookieJar;
var init_globals_node = __esmMin((() => {
	nextTick = process.nextTick;
	globalThisShim = global;
	defaultBinaryType = "nodebuffer";
	CookieJar = class {
		constructor() {
			this._cookies = /* @__PURE__ */ new Map();
		}
		parseCookies(values) {
			if (!values) return;
			values.forEach((value) => {
				const parsed = parse$1(value);
				if (parsed) this._cookies.set(parsed.name, parsed);
			});
		}
		get cookies() {
			const now = Date.now();
			this._cookies.forEach((cookie, name) => {
				var _a;
				if (((_a = cookie.expires) === null || _a === void 0 ? void 0 : _a.getTime()) < now) this._cookies.delete(name);
			});
			return this._cookies.entries();
		}
		addCookies(xhr) {
			const cookies = [];
			for (const [name, cookie] of this.cookies) cookies.push(`${name}=${cookie.value}`);
			if (cookies.length) {
				xhr.setDisableHeaderCheck(true);
				xhr.setRequestHeader("cookie", cookies.join("; "));
			}
		}
		appendCookies(headers) {
			for (const [name, cookie] of this.cookies) headers.append("cookie", `${name}=${cookie.value}`);
		}
	};
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/util.js
function pick(obj, ...attr) {
	return attr.reduce((acc, k) => {
		if (obj.hasOwnProperty(k)) acc[k] = obj[k];
		return acc;
	}, {});
}
function installTimerFunctions(obj, opts) {
	if (opts.useNativeTimers) {
		obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
		obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
	} else {
		obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
		obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
	}
}
function byteLength(obj) {
	if (typeof obj === "string") return utf8Length(obj);
	return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
function utf8Length(str) {
	let c = 0, length = 0;
	for (let i = 0, l = str.length; i < l; i++) {
		c = str.charCodeAt(i);
		if (c < 128) length += 1;
		else if (c < 2048) length += 2;
		else if (c < 55296 || c >= 57344) length += 3;
		else {
			i++;
			length += 4;
		}
	}
	return length;
}
/**
* Generates a random 8-characters string.
*/
function randomString() {
	return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}
var NATIVE_SET_TIMEOUT, NATIVE_CLEAR_TIMEOUT, BASE64_OVERHEAD;
var init_util = __esmMin((() => {
	init_globals_node();
	NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
	NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
	BASE64_OVERHEAD = 1.33;
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/contrib/parseqs.js
/**
* Compiles a querystring
* Returns string representation of the object
*
* @param {Object}
* @api private
*/
function encode(obj) {
	let str = "";
	for (let i in obj) if (obj.hasOwnProperty(i)) {
		if (str.length) str += "&";
		str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
	}
	return str;
}
/**
* Parses a simple querystring into an object
*
* @param {String} qs
* @api private
*/
function decode(qs) {
	let qry = {};
	let pairs = qs.split("&");
	for (let i = 0, l = pairs.length; i < l; i++) {
		let pair = pairs[i].split("=");
		qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	}
	return qry;
}
var init_parseqs = __esmMin((() => {}));
//#endregion
//#region node_modules/engine.io-client/node_modules/ms/index.js
var require_ms$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region node_modules/engine.io-client/node_modules/debug/src/common.js
var require_common$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms$2();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
				starIndex = templateIndex;
				matchIndex = searchIndex;
				templateIndex++;
			} else {
				searchIndex++;
				templateIndex++;
			}
			else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region node_modules/engine.io-client/node_modules/debug/src/browser.js
var require_browser$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common$2()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region node_modules/engine.io-client/node_modules/debug/src/node.js
var require_node$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var tty$2 = __require("tty");
	var util$2 = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util$2.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = require_supports_color();
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty$2.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util$2.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common$2()(exports);
	var { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$2.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region node_modules/engine.io-client/node_modules/debug/src/index.js
var require_src$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser$2();
	else module.exports = require_node$2();
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/transport.js
var import_src$10, debug$10, TransportError, Transport;
var init_transport = __esmMin((() => {
	init_esm$1();
	init_esm();
	init_util();
	init_parseqs();
	import_src$10 = /* @__PURE__ */ __toESM(require_src$2());
	debug$10 = (0, import_src$10.default)("engine.io-client:transport");
	TransportError = class extends Error {
		constructor(reason, description, context) {
			super(reason);
			this.description = description;
			this.context = context;
			this.type = "TransportError";
		}
	};
	Transport = class extends Emitter {
		/**
		* Transport abstract constructor.
		*
		* @param {Object} opts - options
		* @protected
		*/
		constructor(opts) {
			super();
			this.writable = false;
			installTimerFunctions(this, opts);
			this.opts = opts;
			this.query = opts.query;
			this.socket = opts.socket;
			this.supportsBinary = !opts.forceBase64;
		}
		/**
		* Emits an error.
		*
		* @param {String} reason
		* @param description
		* @param context - the error context
		* @return {Transport} for chaining
		* @protected
		*/
		onError(reason, description, context) {
			super.emitReserved("error", new TransportError(reason, description, context));
			return this;
		}
		/**
		* Opens the transport.
		*/
		open() {
			this.readyState = "opening";
			this.doOpen();
			return this;
		}
		/**
		* Closes the transport.
		*/
		close() {
			if (this.readyState === "opening" || this.readyState === "open") {
				this.doClose();
				this.onClose();
			}
			return this;
		}
		/**
		* Sends multiple packets.
		*
		* @param {Array} packets
		*/
		send(packets) {
			if (this.readyState === "open") this.write(packets);
			else debug$10("transport is not open, discarding packets");
		}
		/**
		* Called upon open
		*
		* @protected
		*/
		onOpen() {
			this.readyState = "open";
			this.writable = true;
			super.emitReserved("open");
		}
		/**
		* Called with data.
		*
		* @param {String} data
		* @protected
		*/
		onData(data) {
			const packet = decodePacket(data, this.socket.binaryType);
			this.onPacket(packet);
		}
		/**
		* Called with a decoded packet.
		*
		* @protected
		*/
		onPacket(packet) {
			super.emitReserved("packet", packet);
		}
		/**
		* Called upon close.
		*
		* @protected
		*/
		onClose(details) {
			this.readyState = "closed";
			super.emitReserved("close", details);
		}
		/**
		* Pauses the transport, in order not to lose packets during an upgrade.
		*
		* @param onPause
		*/
		pause(onPause) {}
		createUri(schema, query = {}) {
			return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
		}
		_hostname() {
			const hostname = this.opts.hostname;
			return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
		}
		_port() {
			if (this.opts.port && (this.opts.secure && Number(this.opts.port) !== 443 || !this.opts.secure && Number(this.opts.port) !== 80)) return ":" + this.opts.port;
			else return "";
		}
		_query(query) {
			const encodedQuery = encode(query);
			return encodedQuery.length ? "?" + encodedQuery : "";
		}
	};
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/transports/polling.js
var import_src$9, debug$9, Polling;
var init_polling = __esmMin((() => {
	init_transport();
	init_util();
	init_esm$1();
	import_src$9 = /* @__PURE__ */ __toESM(require_src$2());
	debug$9 = (0, import_src$9.default)("engine.io-client:polling");
	Polling = class extends Transport {
		constructor() {
			super(...arguments);
			this._polling = false;
		}
		get name() {
			return "polling";
		}
		/**
		* Opens the socket (triggers polling). We write a PING message to determine
		* when the transport is open.
		*
		* @protected
		*/
		doOpen() {
			this._poll();
		}
		/**
		* Pauses polling.
		*
		* @param {Function} onPause - callback upon buffers are flushed and transport is paused
		* @package
		*/
		pause(onPause) {
			this.readyState = "pausing";
			const pause = () => {
				debug$9("paused");
				this.readyState = "paused";
				onPause();
			};
			if (this._polling || !this.writable) {
				let total = 0;
				if (this._polling) {
					debug$9("we are currently polling - waiting to pause");
					total++;
					this.once("pollComplete", function() {
						debug$9("pre-pause polling complete");
						--total || pause();
					});
				}
				if (!this.writable) {
					debug$9("we are currently writing - waiting to pause");
					total++;
					this.once("drain", function() {
						debug$9("pre-pause writing complete");
						--total || pause();
					});
				}
			} else pause();
		}
		/**
		* Starts polling cycle.
		*
		* @private
		*/
		_poll() {
			debug$9("polling");
			this._polling = true;
			this.doPoll();
			this.emitReserved("poll");
		}
		/**
		* Overloads onData to detect payloads.
		*
		* @protected
		*/
		onData(data) {
			debug$9("polling got data %s", data);
			const callback = (packet) => {
				if ("opening" === this.readyState && packet.type === "open") this.onOpen();
				if ("close" === packet.type) {
					this.onClose({ description: "transport closed by the server" });
					return false;
				}
				this.onPacket(packet);
			};
			decodePayload(data, this.socket.binaryType).forEach(callback);
			if ("closed" !== this.readyState) {
				this._polling = false;
				this.emitReserved("pollComplete");
				if ("open" === this.readyState) this._poll();
				else debug$9("ignoring poll - transport state \"%s\"", this.readyState);
			}
		}
		/**
		* For polling, send a close packet.
		*
		* @protected
		*/
		doClose() {
			const close = () => {
				debug$9("writing close packet");
				this.write([{ type: "close" }]);
			};
			if ("open" === this.readyState) {
				debug$9("transport open - closing");
				close();
			} else {
				debug$9("transport not open - deferring close");
				this.once("open", close);
			}
		}
		/**
		* Writes a packets payload.
		*
		* @param {Array} packets - data packets
		* @protected
		*/
		write(packets) {
			this.writable = false;
			encodePayload(packets, (data) => {
				this.doWrite(data, () => {
					this.writable = true;
					this.emitReserved("drain");
				});
			});
		}
		/**
		* Generates uri for connection.
		*
		* @private
		*/
		uri() {
			const schema = this.opts.secure ? "https" : "http";
			const query = this.query || {};
			if (false !== this.opts.timestampRequests) query[this.opts.timestampParam] = randomString();
			if (!this.supportsBinary && !query.sid) query.b64 = 1;
			return this.createUri(schema, query);
		}
	};
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/contrib/has-cors.js
var value, hasCORS;
var init_has_cors = __esmMin((() => {
	value = false;
	try {
		value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
	} catch (err) {}
	hasCORS = value;
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/transports/polling-xhr.js
function empty() {}
function unloadHandler() {
	for (let i in Request.requests) if (Request.requests.hasOwnProperty(i)) Request.requests[i].abort();
}
function newRequest(opts) {
	const xdomain = opts.xdomain;
	try {
		if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) return new XMLHttpRequest();
	} catch (e) {}
	if (!xdomain) try {
		return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
	} catch (e) {}
}
var import_src$8, debug$8, BaseXHR, Request;
var init_polling_xhr = __esmMin((() => {
	init_polling();
	init_esm();
	init_util();
	init_globals_node();
	init_has_cors();
	import_src$8 = /* @__PURE__ */ __toESM(require_src$2());
	debug$8 = (0, import_src$8.default)("engine.io-client:polling");
	BaseXHR = class extends Polling {
		/**
		* XHR Polling constructor.
		*
		* @param {Object} opts
		* @package
		*/
		constructor(opts) {
			super(opts);
			if (typeof location !== "undefined") {
				const isSSL = "https:" === location.protocol;
				let port = location.port;
				if (!port) port = isSSL ? "443" : "80";
				this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
			}
		}
		/**
		* Sends data.
		*
		* @param {String} data - data to send.
		* @param {Function} fn - called upon flush.
		* @private
		*/
		doWrite(data, fn) {
			const req = this.request({
				method: "POST",
				data
			});
			req.on("success", fn);
			req.on("error", (xhrStatus, context) => {
				this.onError("xhr post error", xhrStatus, context);
			});
		}
		/**
		* Starts a poll cycle.
		*
		* @private
		*/
		doPoll() {
			debug$8("xhr poll");
			const req = this.request();
			req.on("data", this.onData.bind(this));
			req.on("error", (xhrStatus, context) => {
				this.onError("xhr poll error", xhrStatus, context);
			});
			this.pollXhr = req;
		}
	};
	Request = class Request extends Emitter {
		/**
		* Request constructor
		*
		* @param {Object} options
		* @package
		*/
		constructor(createRequest, uri, opts) {
			super();
			this.createRequest = createRequest;
			installTimerFunctions(this, opts);
			this._opts = opts;
			this._method = opts.method || "GET";
			this._uri = uri;
			this._data = void 0 !== opts.data ? opts.data : null;
			this._create();
		}
		/**
		* Creates the XHR object and sends the request.
		*
		* @private
		*/
		_create() {
			var _a;
			const opts = pick(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
			opts.xdomain = !!this._opts.xd;
			const xhr = this._xhr = this.createRequest(opts);
			try {
				debug$8("xhr open %s: %s", this._method, this._uri);
				xhr.open(this._method, this._uri, true);
				try {
					if (this._opts.extraHeaders) {
						xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
						for (let i in this._opts.extraHeaders) if (this._opts.extraHeaders.hasOwnProperty(i)) xhr.setRequestHeader(i, this._opts.extraHeaders[i]);
					}
				} catch (e) {}
				if ("POST" === this._method) try {
					xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
				} catch (e) {}
				try {
					xhr.setRequestHeader("Accept", "*/*");
				} catch (e) {}
				(_a = this._opts.cookieJar) === null || _a === void 0 || _a.addCookies(xhr);
				if ("withCredentials" in xhr) xhr.withCredentials = this._opts.withCredentials;
				if (this._opts.requestTimeout) xhr.timeout = this._opts.requestTimeout;
				xhr.onreadystatechange = () => {
					var _a;
					if (xhr.readyState === 3) (_a = this._opts.cookieJar) === null || _a === void 0 || _a.parseCookies(xhr.getResponseHeader("set-cookie"));
					if (4 !== xhr.readyState) return;
					if (200 === xhr.status || 1223 === xhr.status) this._onLoad();
					else this.setTimeoutFn(() => {
						this._onError(typeof xhr.status === "number" ? xhr.status : 0);
					}, 0);
				};
				debug$8("xhr data %s", this._data);
				xhr.send(this._data);
			} catch (e) {
				this.setTimeoutFn(() => {
					this._onError(e);
				}, 0);
				return;
			}
			if (typeof document !== "undefined") {
				this._index = Request.requestsCount++;
				Request.requests[this._index] = this;
			}
		}
		/**
		* Called upon error.
		*
		* @private
		*/
		_onError(err) {
			this.emitReserved("error", err, this._xhr);
			this._cleanup(true);
		}
		/**
		* Cleans up house.
		*
		* @private
		*/
		_cleanup(fromError) {
			if ("undefined" === typeof this._xhr || null === this._xhr) return;
			this._xhr.onreadystatechange = empty;
			if (fromError) try {
				this._xhr.abort();
			} catch (e) {}
			if (typeof document !== "undefined") delete Request.requests[this._index];
			this._xhr = null;
		}
		/**
		* Called upon load.
		*
		* @private
		*/
		_onLoad() {
			const data = this._xhr.responseText;
			if (data !== null) {
				this.emitReserved("data", data);
				this.emitReserved("success");
				this._cleanup();
			}
		}
		/**
		* Aborts the request.
		*
		* @package
		*/
		abort() {
			this._cleanup();
		}
	};
	Request.requestsCount = 0;
	Request.requests = {};
	/**
	* Aborts pending requests when unloading the window. This is needed to prevent
	* memory leaks (e.g. when using IE) and to ensure that no spurious error is
	* emitted.
	*/
	if (typeof document !== "undefined") {
		if (typeof attachEvent === "function") attachEvent("onunload", unloadHandler);
		else if (typeof addEventListener === "function") {
			const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
			addEventListener(terminationEvent, unloadHandler, false);
		}
	}
	(function() {
		const xhr = newRequest({ xdomain: false });
		return xhr && xhr.responseType !== null;
	})();
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/transports/polling-xhr.node.js
var import_XMLHttpRequest, XMLHttpRequest$1, XHR;
var init_polling_xhr_node = __esmMin((() => {
	import_XMLHttpRequest = /* @__PURE__ */ __toESM(require_XMLHttpRequest());
	init_polling_xhr();
	XMLHttpRequest$1 = import_XMLHttpRequest.default || import_XMLHttpRequest;
	XHR = class extends BaseXHR {
		request(opts = {}) {
			var _a;
			Object.assign(opts, {
				xd: this.xd,
				cookieJar: (_a = this.socket) === null || _a === void 0 ? void 0 : _a._cookieJar
			}, this.opts);
			return new Request((opts) => new XMLHttpRequest$1(opts), this.uri(), opts);
		}
	};
}));
//#endregion
//#region node_modules/ws/lib/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var BINARY_TYPES = [
		"nodebuffer",
		"arraybuffer",
		"fragments"
	];
	var hasBlob = typeof Blob !== "undefined";
	if (hasBlob) BINARY_TYPES.push("blob");
	module.exports = {
		BINARY_TYPES,
		CLOSE_TIMEOUT: 3e4,
		EMPTY_BUFFER: Buffer.alloc(0),
		GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
		hasBlob,
		kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
		kListener: Symbol("kListener"),
		kStatusCode: Symbol("status-code"),
		kWebSocket: Symbol("websocket"),
		NOOP: () => {}
	};
}));
//#endregion
//#region __vite-optional-peer-dep:bufferutil:ws
var __vite_optional_peer_dep_bufferutil_ws_exports = /* @__PURE__ */ __exportAll({ default: () => __vite_optional_peer_dep_bufferutil_ws_default });
var __vite_optional_peer_dep_bufferutil_ws_default;
var init___vite_optional_peer_dep_bufferutil_ws = __esmMin((() => {
	__vite_optional_peer_dep_bufferutil_ws_default = {};
	throw new Error(`Could not resolve "bufferutil" imported by "ws". Is it installed?`);
}));
//#endregion
//#region node_modules/ws/lib/buffer-util.js
var require_buffer_util = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { EMPTY_BUFFER } = require_constants();
	var FastBuffer = Buffer[Symbol.species];
	/**
	* Merges an array of buffers into a new buffer.
	*
	* @param {Buffer[]} list The array of buffers to concat
	* @param {Number} totalLength The total length of buffers in the list
	* @return {Buffer} The resulting buffer
	* @public
	*/
	function concat(list, totalLength) {
		if (list.length === 0) return EMPTY_BUFFER;
		if (list.length === 1) return list[0];
		const target = Buffer.allocUnsafe(totalLength);
		let offset = 0;
		for (let i = 0; i < list.length; i++) {
			const buf = list[i];
			target.set(buf, offset);
			offset += buf.length;
		}
		if (offset < totalLength) return new FastBuffer(target.buffer, target.byteOffset, offset);
		return target;
	}
	/**
	* Masks a buffer using the given mask.
	*
	* @param {Buffer} source The buffer to mask
	* @param {Buffer} mask The mask to use
	* @param {Buffer} output The buffer where to store the result
	* @param {Number} offset The offset at which to start writing
	* @param {Number} length The number of bytes to mask.
	* @public
	*/
	function _mask(source, mask, output, offset, length) {
		for (let i = 0; i < length; i++) output[offset + i] = source[i] ^ mask[i & 3];
	}
	/**
	* Unmasks a buffer using the given mask.
	*
	* @param {Buffer} buffer The buffer to unmask
	* @param {Buffer} mask The mask to use
	* @public
	*/
	function _unmask(buffer, mask) {
		for (let i = 0; i < buffer.length; i++) buffer[i] ^= mask[i & 3];
	}
	/**
	* Converts a buffer to an `ArrayBuffer`.
	*
	* @param {Buffer} buf The buffer to convert
	* @return {ArrayBuffer} Converted buffer
	* @public
	*/
	function toArrayBuffer(buf) {
		if (buf.length === buf.buffer.byteLength) return buf.buffer;
		return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
	}
	/**
	* Converts `data` to a `Buffer`.
	*
	* @param {*} data The data to convert
	* @return {Buffer} The buffer
	* @throws {TypeError}
	* @public
	*/
	function toBuffer(data) {
		toBuffer.readOnly = true;
		if (Buffer.isBuffer(data)) return data;
		let buf;
		if (data instanceof ArrayBuffer) buf = new FastBuffer(data);
		else if (ArrayBuffer.isView(data)) buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
		else {
			buf = Buffer.from(data);
			toBuffer.readOnly = false;
		}
		return buf;
	}
	module.exports = {
		concat,
		mask: _mask,
		toArrayBuffer,
		toBuffer,
		unmask: _unmask
	};
	/* istanbul ignore else  */
	if (!process.env.WS_NO_BUFFER_UTIL) try {
		const bufferUtil = (init___vite_optional_peer_dep_bufferutil_ws(), __toCommonJS(__vite_optional_peer_dep_bufferutil_ws_exports));
		module.exports.mask = function(source, mask, output, offset, length) {
			if (length < 48) _mask(source, mask, output, offset, length);
			else bufferUtil.mask(source, mask, output, offset, length);
		};
		module.exports.unmask = function(buffer, mask) {
			if (buffer.length < 32) _unmask(buffer, mask);
			else bufferUtil.unmask(buffer, mask);
		};
	} catch (e) {}
}));
//#endregion
//#region node_modules/ws/lib/limiter.js
var require_limiter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var kDone = Symbol("kDone");
	var kRun = Symbol("kRun");
	/**
	* A very simple job queue with adjustable concurrency. Adapted from
	* https://github.com/STRML/async-limiter
	*/
	var Limiter = class {
		/**
		* Creates a new `Limiter`.
		*
		* @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
		*     to run concurrently
		*/
		constructor(concurrency) {
			this[kDone] = () => {
				this.pending--;
				this[kRun]();
			};
			this.concurrency = concurrency || Infinity;
			this.jobs = [];
			this.pending = 0;
		}
		/**
		* Adds a job to the queue.
		*
		* @param {Function} job The job to run
		* @public
		*/
		add(job) {
			this.jobs.push(job);
			this[kRun]();
		}
		/**
		* Removes a job from the queue and runs it if possible.
		*
		* @private
		*/
		[kRun]() {
			if (this.pending === this.concurrency) return;
			if (this.jobs.length) {
				const job = this.jobs.shift();
				this.pending++;
				job(this[kDone]);
			}
		}
	};
	module.exports = Limiter;
}));
//#endregion
//#region node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var zlib = __require("zlib");
	var bufferUtil = require_buffer_util();
	var Limiter = require_limiter();
	var { kStatusCode } = require_constants();
	var FastBuffer = Buffer[Symbol.species];
	var TRAILER = Buffer.from([
		0,
		0,
		255,
		255
	]);
	var kPerMessageDeflate = Symbol("permessage-deflate");
	var kTotalLength = Symbol("total-length");
	var kCallback = Symbol("callback");
	var kBuffers = Symbol("buffers");
	var kError = Symbol("error");
	var zlibLimiter;
	/**
	* permessage-deflate implementation.
	*/
	var PerMessageDeflate = class {
		/**
		* Creates a PerMessageDeflate instance.
		*
		* @param {Object} [options] Configuration options
		* @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
		*     for, or request, a custom client window size
		* @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
		*     acknowledge disabling of client context takeover
		* @param {Number} [options.concurrencyLimit=10] The number of concurrent
		*     calls to zlib
		* @param {Boolean} [options.isServer=false] Create the instance in either
		*     server or client mode
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
		*     use of a custom server window size
		* @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
		*     disabling of server context takeover
		* @param {Number} [options.threshold=1024] Size (in bytes) below which
		*     messages should not be compressed if context takeover is disabled
		* @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
		*     deflate
		* @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
		*     inflate
		*/
		constructor(options) {
			this._options = options || {};
			this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
			this._maxPayload = this._options.maxPayload | 0;
			this._isServer = !!this._options.isServer;
			this._deflate = null;
			this._inflate = null;
			this.params = null;
			if (!zlibLimiter) zlibLimiter = new Limiter(this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10);
		}
		/**
		* @type {String}
		*/
		static get extensionName() {
			return "permessage-deflate";
		}
		/**
		* Create an extension negotiation offer.
		*
		* @return {Object} Extension parameters
		* @public
		*/
		offer() {
			const params = {};
			if (this._options.serverNoContextTakeover) params.server_no_context_takeover = true;
			if (this._options.clientNoContextTakeover) params.client_no_context_takeover = true;
			if (this._options.serverMaxWindowBits) params.server_max_window_bits = this._options.serverMaxWindowBits;
			if (this._options.clientMaxWindowBits) params.client_max_window_bits = this._options.clientMaxWindowBits;
			else if (this._options.clientMaxWindowBits == null) params.client_max_window_bits = true;
			return params;
		}
		/**
		* Accept an extension negotiation offer/response.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Object} Accepted configuration
		* @public
		*/
		accept(configurations) {
			configurations = this.normalizeParams(configurations);
			this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
			return this.params;
		}
		/**
		* Releases all resources used by the extension.
		*
		* @public
		*/
		cleanup() {
			if (this._inflate) {
				this._inflate.close();
				this._inflate = null;
			}
			if (this._deflate) {
				const callback = this._deflate[kCallback];
				this._deflate.close();
				this._deflate = null;
				if (callback) callback(/* @__PURE__ */ new Error("The deflate stream was closed while data was being processed"));
			}
		}
		/**
		*  Accept an extension negotiation offer.
		*
		* @param {Array} offers The extension negotiation offers
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsServer(offers) {
			const opts = this._options;
			const accepted = offers.find((params) => {
				if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) return false;
				return true;
			});
			if (!accepted) throw new Error("None of the extension offers can be accepted");
			if (opts.serverNoContextTakeover) accepted.server_no_context_takeover = true;
			if (opts.clientNoContextTakeover) accepted.client_no_context_takeover = true;
			if (typeof opts.serverMaxWindowBits === "number") accepted.server_max_window_bits = opts.serverMaxWindowBits;
			if (typeof opts.clientMaxWindowBits === "number") accepted.client_max_window_bits = opts.clientMaxWindowBits;
			else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) delete accepted.client_max_window_bits;
			return accepted;
		}
		/**
		* Accept the extension negotiation response.
		*
		* @param {Array} response The extension negotiation response
		* @return {Object} Accepted configuration
		* @private
		*/
		acceptAsClient(response) {
			const params = response[0];
			if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) throw new Error("Unexpected parameter \"client_no_context_takeover\"");
			if (!params.client_max_window_bits) {
				if (typeof this._options.clientMaxWindowBits === "number") params.client_max_window_bits = this._options.clientMaxWindowBits;
			} else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) throw new Error("Unexpected or invalid parameter \"client_max_window_bits\"");
			return params;
		}
		/**
		* Normalize parameters.
		*
		* @param {Array} configurations The extension negotiation offers/reponse
		* @return {Array} The offers/response with normalized parameters
		* @private
		*/
		normalizeParams(configurations) {
			configurations.forEach((params) => {
				Object.keys(params).forEach((key) => {
					let value = params[key];
					if (value.length > 1) throw new Error(`Parameter "${key}" must have only a single value`);
					value = value[0];
					if (key === "client_max_window_bits") {
						if (value !== true) {
							const num = +value;
							if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
							value = num;
						} else if (!this._isServer) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else if (key === "server_max_window_bits") {
						const num = +value;
						if (!Number.isInteger(num) || num < 8 || num > 15) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
						value = num;
					} else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
						if (value !== true) throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
					} else throw new Error(`Unknown parameter "${key}"`);
					params[key] = value;
				});
			});
			return configurations;
		}
		/**
		* Decompress data. Concurrency limited.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		decompress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._decompress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Compress data. Concurrency limited.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @public
		*/
		compress(data, fin, callback) {
			zlibLimiter.add((done) => {
				this._compress(data, fin, (err, result) => {
					done();
					callback(err, result);
				});
			});
		}
		/**
		* Decompress data.
		*
		* @param {Buffer} data Compressed data
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_decompress(data, fin, callback) {
			const endpoint = this._isServer ? "client" : "server";
			if (!this._inflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._inflate = zlib.createInflateRaw({
					...this._options.zlibInflateOptions,
					windowBits
				});
				this._inflate[kPerMessageDeflate] = this;
				this._inflate[kTotalLength] = 0;
				this._inflate[kBuffers] = [];
				this._inflate.on("error", inflateOnError);
				this._inflate.on("data", inflateOnData);
			}
			this._inflate[kCallback] = callback;
			this._inflate.write(data);
			if (fin) this._inflate.write(TRAILER);
			this._inflate.flush(() => {
				const err = this._inflate[kError];
				if (err) {
					this._inflate.close();
					this._inflate = null;
					callback(err);
					return;
				}
				const data = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
				if (this._inflate._readableState.endEmitted) {
					this._inflate.close();
					this._inflate = null;
				} else {
					this._inflate[kTotalLength] = 0;
					this._inflate[kBuffers] = [];
					if (fin && this.params[`${endpoint}_no_context_takeover`]) this._inflate.reset();
				}
				callback(null, data);
			});
		}
		/**
		* Compress data.
		*
		* @param {(Buffer|String)} data Data to compress
		* @param {Boolean} fin Specifies whether or not this is the last fragment
		* @param {Function} callback Callback
		* @private
		*/
		_compress(data, fin, callback) {
			const endpoint = this._isServer ? "server" : "client";
			if (!this._deflate) {
				const key = `${endpoint}_max_window_bits`;
				const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
				this._deflate = zlib.createDeflateRaw({
					...this._options.zlibDeflateOptions,
					windowBits
				});
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				this._deflate.on("data", deflateOnData);
			}
			this._deflate[kCallback] = callback;
			this._deflate.write(data);
			this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
				if (!this._deflate) return;
				let data = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
				if (fin) data = new FastBuffer(data.buffer, data.byteOffset, data.length - 4);
				this._deflate[kCallback] = null;
				this._deflate[kTotalLength] = 0;
				this._deflate[kBuffers] = [];
				if (fin && this.params[`${endpoint}_no_context_takeover`]) this._deflate.reset();
				callback(null, data);
			});
		}
	};
	module.exports = PerMessageDeflate;
	/**
	* The listener of the `zlib.DeflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function deflateOnData(chunk) {
		this[kBuffers].push(chunk);
		this[kTotalLength] += chunk.length;
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function inflateOnData(chunk) {
		this[kTotalLength] += chunk.length;
		if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
			this[kBuffers].push(chunk);
			return;
		}
		this[kError] = /* @__PURE__ */ new RangeError("Max payload size exceeded");
		this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
		this[kError][kStatusCode] = 1009;
		this.removeListener("data", inflateOnData);
		this.reset();
	}
	/**
	* The listener of the `zlib.InflateRaw` stream `'error'` event.
	*
	* @param {Error} err The emitted error
	* @private
	*/
	function inflateOnError(err) {
		this[kPerMessageDeflate]._inflate = null;
		if (this[kError]) {
			this[kCallback](this[kError]);
			return;
		}
		err[kStatusCode] = 1007;
		this[kCallback](err);
	}
}));
//#endregion
//#region __vite-optional-peer-dep:utf-8-validate:ws
var __vite_optional_peer_dep_utf_8_validate_ws_exports = /* @__PURE__ */ __exportAll({ default: () => __vite_optional_peer_dep_utf_8_validate_ws_default });
var __vite_optional_peer_dep_utf_8_validate_ws_default;
var init___vite_optional_peer_dep_utf_8_validate_ws = __esmMin((() => {
	__vite_optional_peer_dep_utf_8_validate_ws_default = {};
	throw new Error(`Could not resolve "utf-8-validate" imported by "ws". Is it installed?`);
}));
//#endregion
//#region node_modules/ws/lib/validation.js
var require_validation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { isUtf8 } = __require("buffer");
	var { hasBlob } = require_constants();
	var tokenChars = [
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		1,
		1,
		0,
		1,
		1,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		0,
		0,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		1,
		0,
		1,
		0,
		1,
		0
	];
	/**
	* Checks if a status code is allowed in a close frame.
	*
	* @param {Number} code The status code
	* @return {Boolean} `true` if the status code is valid, else `false`
	* @public
	*/
	function isValidStatusCode(code) {
		return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
	}
	/**
	* Checks if a given buffer contains only correct UTF-8.
	* Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	* Markus Kuhn.
	*
	* @param {Buffer} buf The buffer to check
	* @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	* @public
	*/
	function _isValidUTF8(buf) {
		const len = buf.length;
		let i = 0;
		while (i < len) if ((buf[i] & 128) === 0) i++;
		else if ((buf[i] & 224) === 192) {
			if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) return false;
			i += 2;
		} else if ((buf[i] & 240) === 224) {
			if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) return false;
			i += 3;
		} else if ((buf[i] & 248) === 240) {
			if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) return false;
			i += 4;
		} else return false;
		return true;
	}
	/**
	* Determines whether a value is a `Blob`.
	*
	* @param {*} value The value to be tested
	* @return {Boolean} `true` if `value` is a `Blob`, else `false`
	* @private
	*/
	function isBlob(value) {
		return hasBlob && typeof value === "object" && typeof value.arrayBuffer === "function" && typeof value.type === "string" && typeof value.stream === "function" && (value[Symbol.toStringTag] === "Blob" || value[Symbol.toStringTag] === "File");
	}
	module.exports = {
		isBlob,
		isValidStatusCode,
		isValidUTF8: _isValidUTF8,
		tokenChars
	};
	if (isUtf8) module.exports.isValidUTF8 = function(buf) {
		return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
	};
	else if (!process.env.WS_NO_UTF_8_VALIDATE) try {
		const isValidUTF8 = (init___vite_optional_peer_dep_utf_8_validate_ws(), __toCommonJS(__vite_optional_peer_dep_utf_8_validate_ws_exports));
		module.exports.isValidUTF8 = function(buf) {
			return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
		};
	} catch (e) {}
}));
//#endregion
//#region node_modules/ws/lib/receiver.js
var require_receiver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Writable } = __require("stream");
	var PerMessageDeflate = require_permessage_deflate();
	var { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } = require_constants();
	var { concat, toArrayBuffer, unmask } = require_buffer_util();
	var { isValidStatusCode, isValidUTF8 } = require_validation();
	var FastBuffer = Buffer[Symbol.species];
	var GET_INFO = 0;
	var GET_PAYLOAD_LENGTH_16 = 1;
	var GET_PAYLOAD_LENGTH_64 = 2;
	var GET_MASK = 3;
	var GET_DATA = 4;
	var INFLATING = 5;
	var DEFER_EVENT = 6;
	/**
	* HyBi Receiver implementation.
	*
	* @extends Writable
	*/
	var Receiver = class extends Writable {
		/**
		* Creates a Receiver instance.
		*
		* @param {Object} [options] Options object
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {String} [options.binaryType=nodebuffer] The type for binary data
		* @param {Object} [options.extensions] An object containing the negotiated
		*     extensions
		* @param {Boolean} [options.isServer=false] Specifies whether to operate in
		*     client or server mode
		* @param {Number} [options.maxPayload=0] The maximum allowed message length
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		*/
		constructor(options = {}) {
			super();
			this._allowSynchronousEvents = options.allowSynchronousEvents !== void 0 ? options.allowSynchronousEvents : true;
			this._binaryType = options.binaryType || BINARY_TYPES[0];
			this._extensions = options.extensions || {};
			this._isServer = !!options.isServer;
			this._maxPayload = options.maxPayload | 0;
			this._skipUTF8Validation = !!options.skipUTF8Validation;
			this[kWebSocket] = void 0;
			this._bufferedBytes = 0;
			this._buffers = [];
			this._compressed = false;
			this._payloadLength = 0;
			this._mask = void 0;
			this._fragmented = 0;
			this._masked = false;
			this._fin = false;
			this._opcode = 0;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._fragments = [];
			this._errored = false;
			this._loop = false;
			this._state = GET_INFO;
		}
		/**
		* Implements `Writable.prototype._write()`.
		*
		* @param {Buffer} chunk The chunk of data to write
		* @param {String} encoding The character encoding of `chunk`
		* @param {Function} cb Callback
		* @private
		*/
		_write(chunk, encoding, cb) {
			if (this._opcode === 8 && this._state == GET_INFO) return cb();
			this._bufferedBytes += chunk.length;
			this._buffers.push(chunk);
			this.startLoop(cb);
		}
		/**
		* Consumes `n` bytes from the buffered data.
		*
		* @param {Number} n The number of bytes to consume
		* @return {Buffer} The consumed bytes
		* @private
		*/
		consume(n) {
			this._bufferedBytes -= n;
			if (n === this._buffers[0].length) return this._buffers.shift();
			if (n < this._buffers[0].length) {
				const buf = this._buffers[0];
				this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				return new FastBuffer(buf.buffer, buf.byteOffset, n);
			}
			const dst = Buffer.allocUnsafe(n);
			do {
				const buf = this._buffers[0];
				const offset = dst.length - n;
				if (n >= buf.length) dst.set(this._buffers.shift(), offset);
				else {
					dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
					this._buffers[0] = new FastBuffer(buf.buffer, buf.byteOffset + n, buf.length - n);
				}
				n -= buf.length;
			} while (n > 0);
			return dst;
		}
		/**
		* Starts the parsing loop.
		*
		* @param {Function} cb Callback
		* @private
		*/
		startLoop(cb) {
			this._loop = true;
			do
				switch (this._state) {
					case GET_INFO:
						this.getInfo(cb);
						break;
					case GET_PAYLOAD_LENGTH_16:
						this.getPayloadLength16(cb);
						break;
					case GET_PAYLOAD_LENGTH_64:
						this.getPayloadLength64(cb);
						break;
					case GET_MASK:
						this.getMask();
						break;
					case GET_DATA:
						this.getData(cb);
						break;
					case INFLATING:
					case DEFER_EVENT:
						this._loop = false;
						return;
				}
			while (this._loop);
			if (!this._errored) cb();
		}
		/**
		* Reads the first two bytes of a frame.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getInfo(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			const buf = this.consume(2);
			if ((buf[0] & 48) !== 0) {
				cb(this.createError(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3"));
				return;
			}
			const compressed = (buf[0] & 64) === 64;
			if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
				cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
				return;
			}
			this._fin = (buf[0] & 128) === 128;
			this._opcode = buf[0] & 15;
			this._payloadLength = buf[1] & 127;
			if (this._opcode === 0) {
				if (compressed) {
					cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
					return;
				}
				if (!this._fragmented) {
					cb(this.createError(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE"));
					return;
				}
				this._opcode = this._fragmented;
			} else if (this._opcode === 1 || this._opcode === 2) {
				if (this._fragmented) {
					cb(this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE"));
					return;
				}
				this._compressed = compressed;
			} else if (this._opcode > 7 && this._opcode < 11) {
				if (!this._fin) {
					cb(this.createError(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN"));
					return;
				}
				if (compressed) {
					cb(this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1"));
					return;
				}
				if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
					cb(this.createError(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"));
					return;
				}
			} else {
				cb(this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE"));
				return;
			}
			if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
			this._masked = (buf[1] & 128) === 128;
			if (this._isServer) {
				if (!this._masked) {
					cb(this.createError(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK"));
					return;
				}
			} else if (this._masked) {
				cb(this.createError(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK"));
				return;
			}
			if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
			else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
			else this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+16).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength16(cb) {
			if (this._bufferedBytes < 2) {
				this._loop = false;
				return;
			}
			this._payloadLength = this.consume(2).readUInt16BE(0);
			this.haveLength(cb);
		}
		/**
		* Gets extended payload length (7+64).
		*
		* @param {Function} cb Callback
		* @private
		*/
		getPayloadLength64(cb) {
			if (this._bufferedBytes < 8) {
				this._loop = false;
				return;
			}
			const buf = this.consume(8);
			const num = buf.readUInt32BE(0);
			if (num > Math.pow(2, 21) - 1) {
				cb(this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"));
				return;
			}
			this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
			this.haveLength(cb);
		}
		/**
		* Payload length has been read.
		*
		* @param {Function} cb Callback
		* @private
		*/
		haveLength(cb) {
			if (this._payloadLength && this._opcode < 8) {
				this._totalPayloadLength += this._payloadLength;
				if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
					cb(this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
					return;
				}
			}
			if (this._masked) this._state = GET_MASK;
			else this._state = GET_DATA;
		}
		/**
		* Reads mask bytes.
		*
		* @private
		*/
		getMask() {
			if (this._bufferedBytes < 4) {
				this._loop = false;
				return;
			}
			this._mask = this.consume(4);
			this._state = GET_DATA;
		}
		/**
		* Reads data bytes.
		*
		* @param {Function} cb Callback
		* @private
		*/
		getData(cb) {
			let data = EMPTY_BUFFER;
			if (this._payloadLength) {
				if (this._bufferedBytes < this._payloadLength) {
					this._loop = false;
					return;
				}
				data = this.consume(this._payloadLength);
				if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) unmask(data, this._mask);
			}
			if (this._opcode > 7) {
				this.controlMessage(data, cb);
				return;
			}
			if (this._compressed) {
				this._state = INFLATING;
				this.decompress(data, cb);
				return;
			}
			if (data.length) {
				this._messageLength = this._totalPayloadLength;
				this._fragments.push(data);
			}
			this.dataMessage(cb);
		}
		/**
		* Decompresses data.
		*
		* @param {Buffer} data Compressed data
		* @param {Function} cb Callback
		* @private
		*/
		decompress(data, cb) {
			this._extensions[PerMessageDeflate.extensionName].decompress(data, this._fin, (err, buf) => {
				if (err) return cb(err);
				if (buf.length) {
					this._messageLength += buf.length;
					if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
						cb(this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
						return;
					}
					this._fragments.push(buf);
				}
				this.dataMessage(cb);
				if (this._state === GET_INFO) this.startLoop(cb);
			});
		}
		/**
		* Handles a data message.
		*
		* @param {Function} cb Callback
		* @private
		*/
		dataMessage(cb) {
			if (!this._fin) {
				this._state = GET_INFO;
				return;
			}
			const messageLength = this._messageLength;
			const fragments = this._fragments;
			this._totalPayloadLength = 0;
			this._messageLength = 0;
			this._fragmented = 0;
			this._fragments = [];
			if (this._opcode === 2) {
				let data;
				if (this._binaryType === "nodebuffer") data = concat(fragments, messageLength);
				else if (this._binaryType === "arraybuffer") data = toArrayBuffer(concat(fragments, messageLength));
				else if (this._binaryType === "blob") data = new Blob(fragments);
				else data = fragments;
				if (this._allowSynchronousEvents) {
					this.emit("message", data, true);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", data, true);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			} else {
				const buf = concat(fragments, messageLength);
				if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
					cb(this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8"));
					return;
				}
				if (this._state === INFLATING || this._allowSynchronousEvents) {
					this.emit("message", buf, false);
					this._state = GET_INFO;
				} else {
					this._state = DEFER_EVENT;
					setImmediate(() => {
						this.emit("message", buf, false);
						this._state = GET_INFO;
						this.startLoop(cb);
					});
				}
			}
		}
		/**
		* Handles a control message.
		*
		* @param {Buffer} data Data to handle
		* @return {(Error|RangeError|undefined)} A possible error
		* @private
		*/
		controlMessage(data, cb) {
			if (this._opcode === 8) {
				if (data.length === 0) {
					this._loop = false;
					this.emit("conclude", 1005, EMPTY_BUFFER);
					this.end();
				} else {
					const code = data.readUInt16BE(0);
					if (!isValidStatusCode(code)) {
						cb(this.createError(RangeError, `invalid status code ${code}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE"));
						return;
					}
					const buf = new FastBuffer(data.buffer, data.byteOffset + 2, data.length - 2);
					if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
						cb(this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8"));
						return;
					}
					this._loop = false;
					this.emit("conclude", code, buf);
					this.end();
				}
				this._state = GET_INFO;
				return;
			}
			if (this._allowSynchronousEvents) {
				this.emit(this._opcode === 9 ? "ping" : "pong", data);
				this._state = GET_INFO;
			} else {
				this._state = DEFER_EVENT;
				setImmediate(() => {
					this.emit(this._opcode === 9 ? "ping" : "pong", data);
					this._state = GET_INFO;
					this.startLoop(cb);
				});
			}
		}
		/**
		* Builds an error object.
		*
		* @param {function(new:Error|RangeError)} ErrorCtor The error constructor
		* @param {String} message The error message
		* @param {Boolean} prefix Specifies whether or not to add a default prefix to
		*     `message`
		* @param {Number} statusCode The status code
		* @param {String} errorCode The exposed error code
		* @return {(Error|RangeError)} The error
		* @private
		*/
		createError(ErrorCtor, message, prefix, statusCode, errorCode) {
			this._loop = false;
			this._errored = true;
			const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
			Error.captureStackTrace(err, this.createError);
			err.code = errorCode;
			err[kStatusCode] = statusCode;
			return err;
		}
	};
	module.exports = Receiver;
}));
//#endregion
//#region node_modules/ws/lib/sender.js
var require_sender = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { Duplex: Duplex$3 } = __require("stream");
	var { randomFillSync } = __require("crypto");
	var { types: { isUint8Array } } = __require("util");
	var PerMessageDeflate = require_permessage_deflate();
	var { EMPTY_BUFFER, kWebSocket, NOOP } = require_constants();
	var { isBlob, isValidStatusCode } = require_validation();
	var { mask: applyMask, toBuffer } = require_buffer_util();
	var kByteLength = Symbol("kByteLength");
	var maskBuffer = Buffer.alloc(4);
	var RANDOM_POOL_SIZE = 8 * 1024;
	var randomPool;
	var randomPoolPointer = RANDOM_POOL_SIZE;
	var DEFAULT = 0;
	var DEFLATING = 1;
	var GET_BLOB_DATA = 2;
	module.exports = class Sender {
		/**
		* Creates a Sender instance.
		*
		* @param {Duplex} socket The connection socket
		* @param {Object} [extensions] An object containing the negotiated extensions
		* @param {Function} [generateMask] The function used to generate the masking
		*     key
		*/
		constructor(socket, extensions, generateMask) {
			this._extensions = extensions || {};
			if (generateMask) {
				this._generateMask = generateMask;
				this._maskBuffer = Buffer.alloc(4);
			}
			this._socket = socket;
			this._firstFragment = true;
			this._compress = false;
			this._bufferedBytes = 0;
			this._queue = [];
			this._state = DEFAULT;
			this.onerror = NOOP;
			this[kWebSocket] = void 0;
		}
		/**
		* Frames a piece of data according to the HyBi WebSocket protocol.
		*
		* @param {(Buffer|String)} data The data to frame
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @return {(Buffer|String)[]} The framed data
		* @public
		*/
		static frame(data, options) {
			let mask;
			let merge = false;
			let offset = 2;
			let skipMasking = false;
			if (options.mask) {
				mask = options.maskBuffer || maskBuffer;
				if (options.generateMask) options.generateMask(mask);
				else {
					if (randomPoolPointer === RANDOM_POOL_SIZE) {
						/* istanbul ignore else  */
						if (randomPool === void 0) randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
						randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
						randomPoolPointer = 0;
					}
					mask[0] = randomPool[randomPoolPointer++];
					mask[1] = randomPool[randomPoolPointer++];
					mask[2] = randomPool[randomPoolPointer++];
					mask[3] = randomPool[randomPoolPointer++];
				}
				skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
				offset = 6;
			}
			let dataLength;
			if (typeof data === "string") if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) dataLength = options[kByteLength];
			else {
				data = Buffer.from(data);
				dataLength = data.length;
			}
			else {
				dataLength = data.length;
				merge = options.mask && options.readOnly && !skipMasking;
			}
			let payloadLength = dataLength;
			if (dataLength >= 65536) {
				offset += 8;
				payloadLength = 127;
			} else if (dataLength > 125) {
				offset += 2;
				payloadLength = 126;
			}
			const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
			target[0] = options.fin ? options.opcode | 128 : options.opcode;
			if (options.rsv1) target[0] |= 64;
			target[1] = payloadLength;
			if (payloadLength === 126) target.writeUInt16BE(dataLength, 2);
			else if (payloadLength === 127) {
				target[2] = target[3] = 0;
				target.writeUIntBE(dataLength, 4, 6);
			}
			if (!options.mask) return [target, data];
			target[1] |= 128;
			target[offset - 4] = mask[0];
			target[offset - 3] = mask[1];
			target[offset - 2] = mask[2];
			target[offset - 1] = mask[3];
			if (skipMasking) return [target, data];
			if (merge) {
				applyMask(data, mask, target, offset, dataLength);
				return [target];
			}
			applyMask(data, mask, data, 0, dataLength);
			return [target, data];
		}
		/**
		* Sends a close message to the other peer.
		*
		* @param {Number} [code] The status code component of the body
		* @param {(String|Buffer)} [data] The message component of the body
		* @param {Boolean} [mask=false] Specifies whether or not to mask the message
		* @param {Function} [cb] Callback
		* @public
		*/
		close(code, data, mask, cb) {
			let buf;
			if (code === void 0) buf = EMPTY_BUFFER;
			else if (typeof code !== "number" || !isValidStatusCode(code)) throw new TypeError("First argument must be a valid error code number");
			else if (data === void 0 || !data.length) {
				buf = Buffer.allocUnsafe(2);
				buf.writeUInt16BE(code, 0);
			} else {
				const length = Buffer.byteLength(data);
				if (length > 123) throw new RangeError("The message must not be greater than 123 bytes");
				buf = Buffer.allocUnsafe(2 + length);
				buf.writeUInt16BE(code, 0);
				if (typeof data === "string") buf.write(data, 2);
				else if (isUint8Array(data)) buf.set(data, 2);
				else throw new TypeError("Second argument must be a string or a Uint8Array");
			}
			const options = {
				[kByteLength]: buf.length,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 8,
				readOnly: false,
				rsv1: false
			};
			if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				buf,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(buf, options), cb);
		}
		/**
		* Sends a ping message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		ping(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 9,
				readOnly,
				rsv1: false
			};
			if (isBlob(data)) if (this._state !== DEFAULT) this.enqueue([
				this.getBlobData,
				data,
				false,
				options,
				cb
			]);
			else this.getBlobData(data, false, options, cb);
			else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(data, options), cb);
		}
		/**
		* Sends a pong message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Boolean} [mask=false] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		pong(data, mask, cb) {
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (byteLength > 125) throw new RangeError("The data size must not be greater than 125 bytes");
			const options = {
				[kByteLength]: byteLength,
				fin: true,
				generateMask: this._generateMask,
				mask,
				maskBuffer: this._maskBuffer,
				opcode: 10,
				readOnly,
				rsv1: false
			};
			if (isBlob(data)) if (this._state !== DEFAULT) this.enqueue([
				this.getBlobData,
				data,
				false,
				options,
				cb
			]);
			else this.getBlobData(data, false, options, cb);
			else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				false,
				options,
				cb
			]);
			else this.sendFrame(Sender.frame(data, options), cb);
		}
		/**
		* Sends a data message to the other peer.
		*
		* @param {*} data The message to send
		* @param {Object} options Options object
		* @param {Boolean} [options.binary=false] Specifies whether `data` is binary
		*     or text
		* @param {Boolean} [options.compress=false] Specifies whether or not to
		*     compress `data`
		* @param {Boolean} [options.fin=false] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Function} [cb] Callback
		* @public
		*/
		send(data, options, cb) {
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			let opcode = options.binary ? 2 : 1;
			let rsv1 = options.compress;
			let byteLength;
			let readOnly;
			if (typeof data === "string") {
				byteLength = Buffer.byteLength(data);
				readOnly = false;
			} else if (isBlob(data)) {
				byteLength = data.size;
				readOnly = false;
			} else {
				data = toBuffer(data);
				byteLength = data.length;
				readOnly = toBuffer.readOnly;
			}
			if (this._firstFragment) {
				this._firstFragment = false;
				if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) rsv1 = byteLength >= perMessageDeflate._threshold;
				this._compress = rsv1;
			} else {
				rsv1 = false;
				opcode = 0;
			}
			if (options.fin) this._firstFragment = true;
			const opts = {
				[kByteLength]: byteLength,
				fin: options.fin,
				generateMask: this._generateMask,
				mask: options.mask,
				maskBuffer: this._maskBuffer,
				opcode,
				readOnly,
				rsv1
			};
			if (isBlob(data)) if (this._state !== DEFAULT) this.enqueue([
				this.getBlobData,
				data,
				this._compress,
				opts,
				cb
			]);
			else this.getBlobData(data, this._compress, opts, cb);
			else if (this._state !== DEFAULT) this.enqueue([
				this.dispatch,
				data,
				this._compress,
				opts,
				cb
			]);
			else this.dispatch(data, this._compress, opts, cb);
		}
		/**
		* Gets the contents of a blob as binary data.
		*
		* @param {Blob} blob The blob
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     the data
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		getBlobData(blob, compress, options, cb) {
			this._bufferedBytes += options[kByteLength];
			this._state = GET_BLOB_DATA;
			blob.arrayBuffer().then((arrayBuffer) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while the blob was being read");
					process.nextTick(callCallbacks, this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				const data = toBuffer(arrayBuffer);
				if (!compress) {
					this._state = DEFAULT;
					this.sendFrame(Sender.frame(data, options), cb);
					this.dequeue();
				} else this.dispatch(data, compress, options, cb);
			}).catch((err) => {
				process.nextTick(onError, this, err, cb);
			});
		}
		/**
		* Dispatches a message.
		*
		* @param {(Buffer|String)} data The message to send
		* @param {Boolean} [compress=false] Specifies whether or not to compress
		*     `data`
		* @param {Object} options Options object
		* @param {Boolean} [options.fin=false] Specifies whether or not to set the
		*     FIN bit
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Boolean} [options.mask=false] Specifies whether or not to mask
		*     `data`
		* @param {Buffer} [options.maskBuffer] The buffer used to store the masking
		*     key
		* @param {Number} options.opcode The opcode
		* @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
		*     modified
		* @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
		*     RSV1 bit
		* @param {Function} [cb] Callback
		* @private
		*/
		dispatch(data, compress, options, cb) {
			if (!compress) {
				this.sendFrame(Sender.frame(data, options), cb);
				return;
			}
			const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
			this._bufferedBytes += options[kByteLength];
			this._state = DEFLATING;
			perMessageDeflate.compress(data, options.fin, (_, buf) => {
				if (this._socket.destroyed) {
					const err = /* @__PURE__ */ new Error("The socket was closed while data was being compressed");
					callCallbacks(this, err, cb);
					return;
				}
				this._bufferedBytes -= options[kByteLength];
				this._state = DEFAULT;
				options.readOnly = false;
				this.sendFrame(Sender.frame(buf, options), cb);
				this.dequeue();
			});
		}
		/**
		* Executes queued send operations.
		*
		* @private
		*/
		dequeue() {
			while (this._state === DEFAULT && this._queue.length) {
				const params = this._queue.shift();
				this._bufferedBytes -= params[3][kByteLength];
				Reflect.apply(params[0], this, params.slice(1));
			}
		}
		/**
		* Enqueues a send operation.
		*
		* @param {Array} params Send operation parameters.
		* @private
		*/
		enqueue(params) {
			this._bufferedBytes += params[3][kByteLength];
			this._queue.push(params);
		}
		/**
		* Sends a frame.
		*
		* @param {(Buffer | String)[]} list The frame to send
		* @param {Function} [cb] Callback
		* @private
		*/
		sendFrame(list, cb) {
			if (list.length === 2) {
				this._socket.cork();
				this._socket.write(list[0]);
				this._socket.write(list[1], cb);
				this._socket.uncork();
			} else this._socket.write(list[0], cb);
		}
	};
	/**
	* Calls queued callbacks with an error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error to call the callbacks with
	* @param {Function} [cb] The first callback
	* @private
	*/
	function callCallbacks(sender, err, cb) {
		if (typeof cb === "function") cb(err);
		for (let i = 0; i < sender._queue.length; i++) {
			const params = sender._queue[i];
			const callback = params[params.length - 1];
			if (typeof callback === "function") callback(err);
		}
	}
	/**
	* Handles a `Sender` error.
	*
	* @param {Sender} sender The `Sender` instance
	* @param {Error} err The error
	* @param {Function} [cb] The first pending callback
	* @private
	*/
	function onError(sender, err, cb) {
		callCallbacks(sender, err, cb);
		sender.onerror(err);
	}
}));
//#endregion
//#region node_modules/ws/lib/event-target.js
var require_event_target = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { kForOnEventAttribute, kListener } = require_constants();
	var kCode = Symbol("kCode");
	var kData = Symbol("kData");
	var kError = Symbol("kError");
	var kMessage = Symbol("kMessage");
	var kReason = Symbol("kReason");
	var kTarget = Symbol("kTarget");
	var kType = Symbol("kType");
	var kWasClean = Symbol("kWasClean");
	/**
	* Class representing an event.
	*/
	var Event = class {
		/**
		* Create a new `Event`.
		*
		* @param {String} type The name of the event
		* @throws {TypeError} If the `type` argument is not specified
		*/
		constructor(type) {
			this[kTarget] = null;
			this[kType] = type;
		}
		/**
		* @type {*}
		*/
		get target() {
			return this[kTarget];
		}
		/**
		* @type {String}
		*/
		get type() {
			return this[kType];
		}
	};
	Object.defineProperty(Event.prototype, "target", { enumerable: true });
	Object.defineProperty(Event.prototype, "type", { enumerable: true });
	/**
	* Class representing a close event.
	*
	* @extends Event
	*/
	var CloseEvent = class extends Event {
		/**
		* Create a new `CloseEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {Number} [options.code=0] The status code explaining why the
		*     connection was closed
		* @param {String} [options.reason=''] A human-readable string explaining why
		*     the connection was closed
		* @param {Boolean} [options.wasClean=false] Indicates whether or not the
		*     connection was cleanly closed
		*/
		constructor(type, options = {}) {
			super(type);
			this[kCode] = options.code === void 0 ? 0 : options.code;
			this[kReason] = options.reason === void 0 ? "" : options.reason;
			this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
		}
		/**
		* @type {Number}
		*/
		get code() {
			return this[kCode];
		}
		/**
		* @type {String}
		*/
		get reason() {
			return this[kReason];
		}
		/**
		* @type {Boolean}
		*/
		get wasClean() {
			return this[kWasClean];
		}
	};
	Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
	/**
	* Class representing an error event.
	*
	* @extends Event
	*/
	var ErrorEvent = class extends Event {
		/**
		* Create a new `ErrorEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.error=null] The error that generated this event
		* @param {String} [options.message=''] The error message
		*/
		constructor(type, options = {}) {
			super(type);
			this[kError] = options.error === void 0 ? null : options.error;
			this[kMessage] = options.message === void 0 ? "" : options.message;
		}
		/**
		* @type {*}
		*/
		get error() {
			return this[kError];
		}
		/**
		* @type {String}
		*/
		get message() {
			return this[kMessage];
		}
	};
	Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
	/**
	* Class representing a message event.
	*
	* @extends Event
	*/
	var MessageEvent = class extends Event {
		/**
		* Create a new `MessageEvent`.
		*
		* @param {String} type The name of the event
		* @param {Object} [options] A dictionary object that allows for setting
		*     attributes via object members of the same name
		* @param {*} [options.data=null] The message content
		*/
		constructor(type, options = {}) {
			super(type);
			this[kData] = options.data === void 0 ? null : options.data;
		}
		/**
		* @type {*}
		*/
		get data() {
			return this[kData];
		}
	};
	Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
	module.exports = {
		CloseEvent,
		ErrorEvent,
		Event,
		EventTarget: {
			/**
			* Register an event listener.
			*
			* @param {String} type A string representing the event type to listen for
			* @param {(Function|Object)} handler The listener to add
			* @param {Object} [options] An options object specifies characteristics about
			*     the event listener
			* @param {Boolean} [options.once=false] A `Boolean` indicating that the
			*     listener should be invoked at most once after being added. If `true`,
			*     the listener would be automatically removed when invoked.
			* @public
			*/
			addEventListener(type, handler, options = {}) {
				for (const listener of this.listeners(type)) if (!options[kForOnEventAttribute] && listener[kListener] === handler && !listener[kForOnEventAttribute]) return;
				let wrapper;
				if (type === "message") wrapper = function onMessage(data, isBinary) {
					const event = new MessageEvent("message", { data: isBinary ? data : data.toString() });
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "close") wrapper = function onClose(code, message) {
					const event = new CloseEvent("close", {
						code,
						reason: message.toString(),
						wasClean: this._closeFrameReceived && this._closeFrameSent
					});
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "error") wrapper = function onError(error) {
					const event = new ErrorEvent("error", {
						error,
						message: error.message
					});
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else if (type === "open") wrapper = function onOpen() {
					const event = new Event("open");
					event[kTarget] = this;
					callListener(handler, this, event);
				};
				else return;
				wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
				wrapper[kListener] = handler;
				if (options.once) this.once(type, wrapper);
				else this.on(type, wrapper);
			},
			/**
			* Remove an event listener.
			*
			* @param {String} type A string representing the event type to remove
			* @param {(Function|Object)} handler The listener to remove
			* @public
			*/
			removeEventListener(type, handler) {
				for (const listener of this.listeners(type)) if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
					this.removeListener(type, listener);
					break;
				}
			}
		},
		MessageEvent
	};
	/**
	* Call an event listener
	*
	* @param {(Function|Object)} listener The listener to call
	* @param {*} thisArg The value to use as `this`` when calling the listener
	* @param {Event} event The event to pass to the listener
	* @private
	*/
	function callListener(listener, thisArg, event) {
		if (typeof listener === "object" && listener.handleEvent) listener.handleEvent.call(listener, event);
		else listener.call(thisArg, event);
	}
}));
//#endregion
//#region node_modules/ws/lib/extension.js
var require_extension = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { tokenChars } = require_validation();
	/**
	* Adds an offer to the map of extension offers or a parameter to the map of
	* parameters.
	*
	* @param {Object} dest The map of extension offers or parameters
	* @param {String} name The extension or parameter name
	* @param {(Object|Boolean|String)} elem The extension parameters or the
	*     parameter value
	* @private
	*/
	function push(dest, name, elem) {
		if (dest[name] === void 0) dest[name] = [elem];
		else dest[name].push(elem);
	}
	/**
	* Parses the `Sec-WebSocket-Extensions` header into an object.
	*
	* @param {String} header The field value of the header
	* @return {Object} The parsed object
	* @public
	*/
	function parse(header) {
		const offers = Object.create(null);
		let params = Object.create(null);
		let mustUnescape = false;
		let isEscaping = false;
		let inQuotes = false;
		let extensionName;
		let paramName;
		let start = -1;
		let code = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			code = header.charCodeAt(i);
			if (extensionName === void 0) if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (i !== 0 && (code === 32 || code === 9)) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const name = header.slice(start, end);
				if (code === 44) {
					push(offers, name, params);
					params = Object.create(null);
				} else extensionName = name;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (paramName === void 0) if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 32 || code === 9) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				push(params, header.slice(start, end), true);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				start = end = -1;
			} else if (code === 61 && start !== -1 && end === -1) {
				paramName = header.slice(start, i);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (isEscaping) {
				if (tokenChars[code] !== 1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (start === -1) start = i;
				else if (!mustUnescape) mustUnescape = true;
				isEscaping = false;
			} else if (inQuotes) if (tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (code === 34 && start !== -1) {
				inQuotes = false;
				end = i;
			} else if (code === 92) isEscaping = true;
			else throw new SyntaxError(`Unexpected character at index ${i}`);
			else if (code === 34 && header.charCodeAt(i - 1) === 61) inQuotes = true;
			else if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (start !== -1 && (code === 32 || code === 9)) {
				if (end === -1) end = i;
			} else if (code === 59 || code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				let value = header.slice(start, end);
				if (mustUnescape) {
					value = value.replace(/\\/g, "");
					mustUnescape = false;
				}
				push(params, paramName, value);
				if (code === 44) {
					push(offers, extensionName, params);
					params = Object.create(null);
					extensionName = void 0;
				}
				paramName = void 0;
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || inQuotes || code === 32 || code === 9) throw new SyntaxError("Unexpected end of input");
		if (end === -1) end = i;
		const token = header.slice(start, end);
		if (extensionName === void 0) push(offers, token, params);
		else {
			if (paramName === void 0) push(params, token, true);
			else if (mustUnescape) push(params, paramName, token.replace(/\\/g, ""));
			else push(params, paramName, token);
			push(offers, extensionName, params);
		}
		return offers;
	}
	/**
	* Builds the `Sec-WebSocket-Extensions` header field value.
	*
	* @param {Object} extensions The map of extensions and parameters to format
	* @return {String} A string representing the given object
	* @public
	*/
	function format(extensions) {
		return Object.keys(extensions).map((extension) => {
			let configurations = extensions[extension];
			if (!Array.isArray(configurations)) configurations = [configurations];
			return configurations.map((params) => {
				return [extension].concat(Object.keys(params).map((k) => {
					let values = params[k];
					if (!Array.isArray(values)) values = [values];
					return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
				})).join("; ");
			}).join(", ");
		}).join(", ");
	}
	module.exports = {
		format,
		parse
	};
}));
//#endregion
//#region node_modules/ws/lib/websocket.js
var require_websocket = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$2 = __require("events");
	var https = __require("https");
	var http$1 = __require("http");
	var net = __require("net");
	var tls = __require("tls");
	var { randomBytes, createHash: createHash$1 } = __require("crypto");
	var { Duplex: Duplex$2, Readable } = __require("stream");
	var { URL: URL$1 } = __require("url");
	var PerMessageDeflate = require_permessage_deflate();
	var Receiver = require_receiver();
	var Sender = require_sender();
	var { isBlob } = require_validation();
	var { BINARY_TYPES, CLOSE_TIMEOUT, EMPTY_BUFFER, GUID, kForOnEventAttribute, kListener, kStatusCode, kWebSocket, NOOP } = require_constants();
	var { EventTarget: { addEventListener, removeEventListener } } = require_event_target();
	var { format, parse } = require_extension();
	var { toBuffer } = require_buffer_util();
	var kAborted = Symbol("kAborted");
	var protocolVersions = [8, 13];
	var readyStates = [
		"CONNECTING",
		"OPEN",
		"CLOSING",
		"CLOSED"
	];
	var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
	/**
	* Class representing a WebSocket.
	*
	* @extends EventEmitter
	*/
	var WebSocket = class WebSocket extends EventEmitter$2 {
		/**
		* Create a new `WebSocket`.
		*
		* @param {(String|URL)} address The URL to which to connect
		* @param {(String|String[])} [protocols] The subprotocols
		* @param {Object} [options] Connection options
		*/
		constructor(address, protocols, options) {
			super();
			this._binaryType = BINARY_TYPES[0];
			this._closeCode = 1006;
			this._closeFrameReceived = false;
			this._closeFrameSent = false;
			this._closeMessage = EMPTY_BUFFER;
			this._closeTimer = null;
			this._errorEmitted = false;
			this._extensions = {};
			this._paused = false;
			this._protocol = "";
			this._readyState = WebSocket.CONNECTING;
			this._receiver = null;
			this._sender = null;
			this._socket = null;
			if (address !== null) {
				this._bufferedAmount = 0;
				this._isServer = false;
				this._redirects = 0;
				if (protocols === void 0) protocols = [];
				else if (!Array.isArray(protocols)) if (typeof protocols === "object" && protocols !== null) {
					options = protocols;
					protocols = [];
				} else protocols = [protocols];
				initAsClient(this, address, protocols, options);
			} else {
				this._autoPong = options.autoPong;
				this._closeTimeout = options.closeTimeout;
				this._isServer = true;
			}
		}
		/**
		* For historical reasons, the custom "nodebuffer" type is used by the default
		* instead of "blob".
		*
		* @type {String}
		*/
		get binaryType() {
			return this._binaryType;
		}
		set binaryType(type) {
			if (!BINARY_TYPES.includes(type)) return;
			this._binaryType = type;
			if (this._receiver) this._receiver._binaryType = type;
		}
		/**
		* @type {Number}
		*/
		get bufferedAmount() {
			if (!this._socket) return this._bufferedAmount;
			return this._socket._writableState.length + this._sender._bufferedBytes;
		}
		/**
		* @type {String}
		*/
		get extensions() {
			return Object.keys(this._extensions).join();
		}
		/**
		* @type {Boolean}
		*/
		get isPaused() {
			return this._paused;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onclose() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onerror() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onopen() {
			return null;
		}
		/**
		* @type {Function}
		*/
		/* istanbul ignore next */
		get onmessage() {
			return null;
		}
		/**
		* @type {String}
		*/
		get protocol() {
			return this._protocol;
		}
		/**
		* @type {Number}
		*/
		get readyState() {
			return this._readyState;
		}
		/**
		* @type {String}
		*/
		get url() {
			return this._url;
		}
		/**
		* Set up the socket and the internal resources.
		*
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Object} options Options object
		* @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Function} [options.generateMask] The function used to generate the
		*     masking key
		* @param {Number} [options.maxPayload=0] The maximum allowed message size
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @private
		*/
		setSocket(socket, head, options) {
			const receiver = new Receiver({
				allowSynchronousEvents: options.allowSynchronousEvents,
				binaryType: this.binaryType,
				extensions: this._extensions,
				isServer: this._isServer,
				maxPayload: options.maxPayload,
				skipUTF8Validation: options.skipUTF8Validation
			});
			const sender = new Sender(socket, this._extensions, options.generateMask);
			this._receiver = receiver;
			this._sender = sender;
			this._socket = socket;
			receiver[kWebSocket] = this;
			sender[kWebSocket] = this;
			socket[kWebSocket] = this;
			receiver.on("conclude", receiverOnConclude);
			receiver.on("drain", receiverOnDrain);
			receiver.on("error", receiverOnError);
			receiver.on("message", receiverOnMessage);
			receiver.on("ping", receiverOnPing);
			receiver.on("pong", receiverOnPong);
			sender.onerror = senderOnError;
			if (socket.setTimeout) socket.setTimeout(0);
			if (socket.setNoDelay) socket.setNoDelay();
			if (head.length > 0) socket.unshift(head);
			socket.on("close", socketOnClose);
			socket.on("data", socketOnData);
			socket.on("end", socketOnEnd);
			socket.on("error", socketOnError);
			this._readyState = WebSocket.OPEN;
			this.emit("open");
		}
		/**
		* Emit the `'close'` event.
		*
		* @private
		*/
		emitClose() {
			if (!this._socket) {
				this._readyState = WebSocket.CLOSED;
				this.emit("close", this._closeCode, this._closeMessage);
				return;
			}
			if (this._extensions[PerMessageDeflate.extensionName]) this._extensions[PerMessageDeflate.extensionName].cleanup();
			this._receiver.removeAllListeners();
			this._readyState = WebSocket.CLOSED;
			this.emit("close", this._closeCode, this._closeMessage);
		}
		/**
		* Start a closing handshake.
		*
		*          +----------+   +-----------+   +----------+
		*     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
		*    |     +----------+   +-----------+   +----------+     |
		*          +----------+   +-----------+         |
		* CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
		*          +----------+   +-----------+   |
		*    |           |                        |   +---+        |
		*                +------------------------+-->|fin| - - - -
		*    |         +---+                      |   +---+
		*     - - - - -|fin|<---------------------+
		*              +---+
		*
		* @param {Number} [code] Status code explaining why the connection is closing
		* @param {(String|Buffer)} [data] The reason why the connection is
		*     closing
		* @public
		*/
		close(code, data) {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) {
				abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
				return;
			}
			if (this.readyState === WebSocket.CLOSING) {
				if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) this._socket.end();
				return;
			}
			this._readyState = WebSocket.CLOSING;
			this._sender.close(code, data, !this._isServer, (err) => {
				if (err) return;
				this._closeFrameSent = true;
				if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) this._socket.end();
			});
			setCloseTimer(this);
		}
		/**
		* Pause the socket.
		*
		* @public
		*/
		pause() {
			if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) return;
			this._paused = true;
			this._socket.pause();
		}
		/**
		* Send a ping.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the ping is sent
		* @public
		*/
		ping(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.ping(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Send a pong.
		*
		* @param {*} [data] The data to send
		* @param {Boolean} [mask] Indicates whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when the pong is sent
		* @public
		*/
		pong(data, mask, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof data === "function") {
				cb = data;
				data = mask = void 0;
			} else if (typeof mask === "function") {
				cb = mask;
				mask = void 0;
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			if (mask === void 0) mask = !this._isServer;
			this._sender.pong(data || EMPTY_BUFFER, mask, cb);
		}
		/**
		* Resume the socket.
		*
		* @public
		*/
		resume() {
			if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) return;
			this._paused = false;
			if (!this._receiver._writableState.needDrain) this._socket.resume();
		}
		/**
		* Send a data message.
		*
		* @param {*} data The message to send
		* @param {Object} [options] Options object
		* @param {Boolean} [options.binary] Specifies whether `data` is binary or
		*     text
		* @param {Boolean} [options.compress] Specifies whether or not to compress
		*     `data`
		* @param {Boolean} [options.fin=true] Specifies whether the fragment is the
		*     last one
		* @param {Boolean} [options.mask] Specifies whether or not to mask `data`
		* @param {Function} [cb] Callback which is executed when data is written out
		* @public
		*/
		send(data, options, cb) {
			if (this.readyState === WebSocket.CONNECTING) throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
			if (typeof options === "function") {
				cb = options;
				options = {};
			}
			if (typeof data === "number") data = data.toString();
			if (this.readyState !== WebSocket.OPEN) {
				sendAfterClose(this, data, cb);
				return;
			}
			const opts = {
				binary: typeof data !== "string",
				mask: !this._isServer,
				compress: true,
				fin: true,
				...options
			};
			if (!this._extensions[PerMessageDeflate.extensionName]) opts.compress = false;
			this._sender.send(data || EMPTY_BUFFER, opts, cb);
		}
		/**
		* Forcibly close the connection.
		*
		* @public
		*/
		terminate() {
			if (this.readyState === WebSocket.CLOSED) return;
			if (this.readyState === WebSocket.CONNECTING) {
				abortHandshake(this, this._req, "WebSocket was closed before the connection was established");
				return;
			}
			if (this._socket) {
				this._readyState = WebSocket.CLOSING;
				this._socket.destroy();
			}
		}
	};
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} CONNECTING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CONNECTING", {
		enumerable: true,
		value: readyStates.indexOf("CONNECTING")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} OPEN
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "OPEN", {
		enumerable: true,
		value: readyStates.indexOf("OPEN")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSING
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSING", {
		enumerable: true,
		value: readyStates.indexOf("CLOSING")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket
	*/
	Object.defineProperty(WebSocket, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	/**
	* @constant {Number} CLOSED
	* @memberof WebSocket.prototype
	*/
	Object.defineProperty(WebSocket.prototype, "CLOSED", {
		enumerable: true,
		value: readyStates.indexOf("CLOSED")
	});
	[
		"binaryType",
		"bufferedAmount",
		"extensions",
		"isPaused",
		"protocol",
		"readyState",
		"url"
	].forEach((property) => {
		Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});
	[
		"open",
		"error",
		"close",
		"message"
	].forEach((method) => {
		Object.defineProperty(WebSocket.prototype, `on${method}`, {
			enumerable: true,
			get() {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) return listener[kListener];
				return null;
			},
			set(handler) {
				for (const listener of this.listeners(method)) if (listener[kForOnEventAttribute]) {
					this.removeListener(method, listener);
					break;
				}
				if (typeof handler !== "function") return;
				this.addEventListener(method, handler, { [kForOnEventAttribute]: true });
			}
		});
	});
	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;
	module.exports = WebSocket;
	/**
	* Initialize a WebSocket client.
	*
	* @param {WebSocket} websocket The client to initialize
	* @param {(String|URL)} address The URL to which to connect
	* @param {Array} protocols The subprotocols
	* @param {Object} [options] Connection options
	* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether any
	*     of the `'message'`, `'ping'`, and `'pong'` events can be emitted multiple
	*     times in the same tick
	* @param {Boolean} [options.autoPong=true] Specifies whether or not to
	*     automatically send a pong in response to a ping
	* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to wait
	*     for the closing handshake to finish after `websocket.close()` is called
	* @param {Function} [options.finishRequest] A function which can be used to
	*     customize the headers of each http request before it is sent
	* @param {Boolean} [options.followRedirects=false] Whether or not to follow
	*     redirects
	* @param {Function} [options.generateMask] The function used to generate the
	*     masking key
	* @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	*     handshake request
	* @param {Number} [options.maxPayload=104857600] The maximum allowed message
	*     size
	* @param {Number} [options.maxRedirects=10] The maximum number of redirects
	*     allowed
	* @param {String} [options.origin] Value of the `Origin` or
	*     `Sec-WebSocket-Origin` header
	* @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	*     permessage-deflate
	* @param {Number} [options.protocolVersion=13] Value of the
	*     `Sec-WebSocket-Version` header
	* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	*     not to skip UTF-8 validation for text and close messages
	* @private
	*/
	function initAsClient(websocket, address, protocols, options) {
		const opts = {
			allowSynchronousEvents: true,
			autoPong: true,
			closeTimeout: CLOSE_TIMEOUT,
			protocolVersion: protocolVersions[1],
			maxPayload: 100 * 1024 * 1024,
			skipUTF8Validation: false,
			perMessageDeflate: true,
			followRedirects: false,
			maxRedirects: 10,
			...options,
			socketPath: void 0,
			hostname: void 0,
			protocol: void 0,
			timeout: void 0,
			method: "GET",
			host: void 0,
			path: void 0,
			port: void 0
		};
		websocket._autoPong = opts.autoPong;
		websocket._closeTimeout = opts.closeTimeout;
		if (!protocolVersions.includes(opts.protocolVersion)) throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
		let parsedUrl;
		if (address instanceof URL$1) parsedUrl = address;
		else try {
			parsedUrl = new URL$1(address);
		} catch {
			throw new SyntaxError(`Invalid URL: ${address}`);
		}
		if (parsedUrl.protocol === "http:") parsedUrl.protocol = "ws:";
		else if (parsedUrl.protocol === "https:") parsedUrl.protocol = "wss:";
		websocket._url = parsedUrl.href;
		const isSecure = parsedUrl.protocol === "wss:";
		const isIpcUrl = parsedUrl.protocol === "ws+unix:";
		let invalidUrlMessage;
		if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) invalidUrlMessage = "The URL's protocol must be one of \"ws:\", \"wss:\", \"http:\", \"https:\", or \"ws+unix:\"";
		else if (isIpcUrl && !parsedUrl.pathname) invalidUrlMessage = "The URL's pathname is empty";
		else if (parsedUrl.hash) invalidUrlMessage = "The URL contains a fragment identifier";
		if (invalidUrlMessage) {
			const err = new SyntaxError(invalidUrlMessage);
			if (websocket._redirects === 0) throw err;
			else {
				emitErrorAndClose(websocket, err);
				return;
			}
		}
		const defaultPort = isSecure ? 443 : 80;
		const key = randomBytes(16).toString("base64");
		const request = isSecure ? https.request : http$1.request;
		const protocolSet = /* @__PURE__ */ new Set();
		let perMessageDeflate;
		opts.createConnection = opts.createConnection || (isSecure ? tlsConnect : netConnect);
		opts.defaultPort = opts.defaultPort || defaultPort;
		opts.port = parsedUrl.port || defaultPort;
		opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
		opts.headers = {
			...opts.headers,
			"Sec-WebSocket-Version": opts.protocolVersion,
			"Sec-WebSocket-Key": key,
			Connection: "Upgrade",
			Upgrade: "websocket"
		};
		opts.path = parsedUrl.pathname + parsedUrl.search;
		opts.timeout = opts.handshakeTimeout;
		if (opts.perMessageDeflate) {
			perMessageDeflate = new PerMessageDeflate({
				...opts.perMessageDeflate,
				isServer: false,
				maxPayload: opts.maxPayload
			});
			opts.headers["Sec-WebSocket-Extensions"] = format({ [PerMessageDeflate.extensionName]: perMessageDeflate.offer() });
		}
		if (protocols.length) {
			for (const protocol of protocols) {
				if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) throw new SyntaxError("An invalid or duplicated subprotocol was specified");
				protocolSet.add(protocol);
			}
			opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
		}
		if (opts.origin) if (opts.protocolVersion < 13) opts.headers["Sec-WebSocket-Origin"] = opts.origin;
		else opts.headers.Origin = opts.origin;
		if (parsedUrl.username || parsedUrl.password) opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
		if (isIpcUrl) {
			const parts = opts.path.split(":");
			opts.socketPath = parts[0];
			opts.path = parts[1];
		}
		let req;
		if (opts.followRedirects) {
			if (websocket._redirects === 0) {
				websocket._originalIpc = isIpcUrl;
				websocket._originalSecure = isSecure;
				websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
				const headers = options && options.headers;
				options = {
					...options,
					headers: {}
				};
				if (headers) for (const [key, value] of Object.entries(headers)) options.headers[key.toLowerCase()] = value;
			} else if (websocket.listenerCount("redirect") === 0) {
				const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
				if (!isSameHost || websocket._originalSecure && !isSecure) {
					delete opts.headers.authorization;
					delete opts.headers.cookie;
					if (!isSameHost) delete opts.headers.host;
					opts.auth = void 0;
				}
			}
			if (opts.auth && !options.headers.authorization) options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
			req = websocket._req = request(opts);
			if (websocket._redirects) websocket.emit("redirect", websocket.url, req);
		} else req = websocket._req = request(opts);
		if (opts.timeout) req.on("timeout", () => {
			abortHandshake(websocket, req, "Opening handshake has timed out");
		});
		req.on("error", (err) => {
			if (req === null || req[kAborted]) return;
			req = websocket._req = null;
			emitErrorAndClose(websocket, err);
		});
		req.on("response", (res) => {
			const location = res.headers.location;
			const statusCode = res.statusCode;
			if (location && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
				if (++websocket._redirects > opts.maxRedirects) {
					abortHandshake(websocket, req, "Maximum redirects exceeded");
					return;
				}
				req.abort();
				let addr;
				try {
					addr = new URL$1(location, address);
				} catch (e) {
					emitErrorAndClose(websocket, /* @__PURE__ */ new SyntaxError(`Invalid URL: ${location}`));
					return;
				}
				initAsClient(websocket, addr, protocols, options);
			} else if (!websocket.emit("unexpected-response", req, res)) abortHandshake(websocket, req, `Unexpected server response: ${res.statusCode}`);
		});
		req.on("upgrade", (res, socket, head) => {
			websocket.emit("upgrade", res);
			if (websocket.readyState !== WebSocket.CONNECTING) return;
			req = websocket._req = null;
			const upgrade = res.headers.upgrade;
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshake(websocket, socket, "Invalid Upgrade header");
				return;
			}
			const digest = createHash$1("sha1").update(key + GUID).digest("base64");
			if (res.headers["sec-websocket-accept"] !== digest) {
				abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
				return;
			}
			const serverProt = res.headers["sec-websocket-protocol"];
			let protError;
			if (serverProt !== void 0) {
				if (!protocolSet.size) protError = "Server sent a subprotocol but none was requested";
				else if (!protocolSet.has(serverProt)) protError = "Server sent an invalid subprotocol";
			} else if (protocolSet.size) protError = "Server sent no subprotocol";
			if (protError) {
				abortHandshake(websocket, socket, protError);
				return;
			}
			if (serverProt) websocket._protocol = serverProt;
			const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
			if (secWebSocketExtensions !== void 0) {
				if (!perMessageDeflate) {
					abortHandshake(websocket, socket, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
					return;
				}
				let extensions;
				try {
					extensions = parse(secWebSocketExtensions);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				const extensionNames = Object.keys(extensions);
				if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
					abortHandshake(websocket, socket, "Server indicated an extension that was not requested");
					return;
				}
				try {
					perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
				} catch (err) {
					abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Extensions header");
					return;
				}
				websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
			}
			websocket.setSocket(socket, head, {
				allowSynchronousEvents: opts.allowSynchronousEvents,
				generateMask: opts.generateMask,
				maxPayload: opts.maxPayload,
				skipUTF8Validation: opts.skipUTF8Validation
			});
		});
		if (opts.finishRequest) opts.finishRequest(req, websocket);
		else req.end();
	}
	/**
	* Emit the `'error'` and `'close'` events.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {Error} The error to emit
	* @private
	*/
	function emitErrorAndClose(websocket, err) {
		websocket._readyState = WebSocket.CLOSING;
		websocket._errorEmitted = true;
		websocket.emit("error", err);
		websocket.emitClose();
	}
	/**
	* Create a `net.Socket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {net.Socket} The newly created socket used to start the connection
	* @private
	*/
	function netConnect(options) {
		options.path = options.socketPath;
		return net.connect(options);
	}
	/**
	* Create a `tls.TLSSocket` and initiate a connection.
	*
	* @param {Object} options Connection options
	* @return {tls.TLSSocket} The newly created socket used to start the connection
	* @private
	*/
	function tlsConnect(options) {
		options.path = void 0;
		if (!options.servername && options.servername !== "") options.servername = net.isIP(options.host) ? "" : options.host;
		return tls.connect(options);
	}
	/**
	* Abort the handshake and emit an error.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	*     abort or the socket to destroy
	* @param {String} message The error message
	* @private
	*/
	function abortHandshake(websocket, stream, message) {
		websocket._readyState = WebSocket.CLOSING;
		const err = new Error(message);
		Error.captureStackTrace(err, abortHandshake);
		if (stream.setHeader) {
			stream[kAborted] = true;
			stream.abort();
			if (stream.socket && !stream.socket.destroyed) stream.socket.destroy();
			process.nextTick(emitErrorAndClose, websocket, err);
		} else {
			stream.destroy(err);
			stream.once("error", websocket.emit.bind(websocket, "error"));
			stream.once("close", websocket.emitClose.bind(websocket));
		}
	}
	/**
	* Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	* when the `readyState` attribute is `CLOSING` or `CLOSED`.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @param {*} [data] The data to send
	* @param {Function} [cb] Callback
	* @private
	*/
	function sendAfterClose(websocket, data, cb) {
		if (data) {
			const length = isBlob(data) ? data.size : toBuffer(data).length;
			if (websocket._socket) websocket._sender._bufferedBytes += length;
			else websocket._bufferedAmount += length;
		}
		if (cb) {
			const err = /* @__PURE__ */ new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`);
			process.nextTick(cb, err);
		}
	}
	/**
	* The listener of the `Receiver` `'conclude'` event.
	*
	* @param {Number} code The status code
	* @param {Buffer} reason The reason for closing
	* @private
	*/
	function receiverOnConclude(code, reason) {
		const websocket = this[kWebSocket];
		websocket._closeFrameReceived = true;
		websocket._closeMessage = reason;
		websocket._closeCode = code;
		if (websocket._socket[kWebSocket] === void 0) return;
		websocket._socket.removeListener("data", socketOnData);
		process.nextTick(resume, websocket._socket);
		if (code === 1005) websocket.close();
		else websocket.close(code, reason);
	}
	/**
	* The listener of the `Receiver` `'drain'` event.
	*
	* @private
	*/
	function receiverOnDrain() {
		const websocket = this[kWebSocket];
		if (!websocket.isPaused) websocket._socket.resume();
	}
	/**
	* The listener of the `Receiver` `'error'` event.
	*
	* @param {(RangeError|Error)} err The emitted error
	* @private
	*/
	function receiverOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket._socket[kWebSocket] !== void 0) {
			websocket._socket.removeListener("data", socketOnData);
			process.nextTick(resume, websocket._socket);
			websocket.close(err[kStatusCode]);
		}
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* The listener of the `Receiver` `'finish'` event.
	*
	* @private
	*/
	function receiverOnFinish() {
		this[kWebSocket].emitClose();
	}
	/**
	* The listener of the `Receiver` `'message'` event.
	*
	* @param {Buffer|ArrayBuffer|Buffer[])} data The message
	* @param {Boolean} isBinary Specifies whether the message is binary or not
	* @private
	*/
	function receiverOnMessage(data, isBinary) {
		this[kWebSocket].emit("message", data, isBinary);
	}
	/**
	* The listener of the `Receiver` `'ping'` event.
	*
	* @param {Buffer} data The data included in the ping frame
	* @private
	*/
	function receiverOnPing(data) {
		const websocket = this[kWebSocket];
		if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
		websocket.emit("ping", data);
	}
	/**
	* The listener of the `Receiver` `'pong'` event.
	*
	* @param {Buffer} data The data included in the pong frame
	* @private
	*/
	function receiverOnPong(data) {
		this[kWebSocket].emit("pong", data);
	}
	/**
	* Resume a readable stream
	*
	* @param {Readable} stream The readable stream
	* @private
	*/
	function resume(stream) {
		stream.resume();
	}
	/**
	* The `Sender` error event handler.
	*
	* @param {Error} The error
	* @private
	*/
	function senderOnError(err) {
		const websocket = this[kWebSocket];
		if (websocket.readyState === WebSocket.CLOSED) return;
		if (websocket.readyState === WebSocket.OPEN) {
			websocket._readyState = WebSocket.CLOSING;
			setCloseTimer(websocket);
		}
		this._socket.end();
		if (!websocket._errorEmitted) {
			websocket._errorEmitted = true;
			websocket.emit("error", err);
		}
	}
	/**
	* Set a timer to destroy the underlying raw socket of a WebSocket.
	*
	* @param {WebSocket} websocket The WebSocket instance
	* @private
	*/
	function setCloseTimer(websocket) {
		websocket._closeTimer = setTimeout(websocket._socket.destroy.bind(websocket._socket), websocket._closeTimeout);
	}
	/**
	* The listener of the socket `'close'` event.
	*
	* @private
	*/
	function socketOnClose() {
		const websocket = this[kWebSocket];
		this.removeListener("close", socketOnClose);
		this.removeListener("data", socketOnData);
		this.removeListener("end", socketOnEnd);
		websocket._readyState = WebSocket.CLOSING;
		if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
			const chunk = this.read(this._readableState.length);
			websocket._receiver.write(chunk);
		}
		websocket._receiver.end();
		this[kWebSocket] = void 0;
		clearTimeout(websocket._closeTimer);
		if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) websocket.emitClose();
		else {
			websocket._receiver.on("error", receiverOnFinish);
			websocket._receiver.on("finish", receiverOnFinish);
		}
	}
	/**
	* The listener of the socket `'data'` event.
	*
	* @param {Buffer} chunk A chunk of data
	* @private
	*/
	function socketOnData(chunk) {
		if (!this[kWebSocket]._receiver.write(chunk)) this.pause();
	}
	/**
	* The listener of the socket `'end'` event.
	*
	* @private
	*/
	function socketOnEnd() {
		const websocket = this[kWebSocket];
		websocket._readyState = WebSocket.CLOSING;
		websocket._receiver.end();
		this.end();
	}
	/**
	* The listener of the socket `'error'` event.
	*
	* @private
	*/
	function socketOnError() {
		const websocket = this[kWebSocket];
		this.removeListener("error", socketOnError);
		this.on("error", NOOP);
		if (websocket) {
			websocket._readyState = WebSocket.CLOSING;
			this.destroy();
		}
	}
}));
//#endregion
//#region node_modules/ws/lib/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	require_websocket();
	var { Duplex: Duplex$1 } = __require("stream");
	/**
	* Emits the `'close'` event on a stream.
	*
	* @param {Duplex} stream The stream.
	* @private
	*/
	function emitClose(stream) {
		stream.emit("close");
	}
	/**
	* The listener of the `'end'` event.
	*
	* @private
	*/
	function duplexOnEnd() {
		if (!this.destroyed && this._writableState.finished) this.destroy();
	}
	/**
	* The listener of the `'error'` event.
	*
	* @param {Error} err The error
	* @private
	*/
	function duplexOnError(err) {
		this.removeListener("error", duplexOnError);
		this.destroy();
		if (this.listenerCount("error") === 0) this.emit("error", err);
	}
	/**
	* Wraps a `WebSocket` in a duplex stream.
	*
	* @param {WebSocket} ws The `WebSocket` to wrap
	* @param {Object} [options] The options for the `Duplex` constructor
	* @return {Duplex} The duplex stream
	* @public
	*/
	function createWebSocketStream(ws, options) {
		let terminateOnDestroy = true;
		const duplex = new Duplex$1({
			...options,
			autoDestroy: false,
			emitClose: false,
			objectMode: false,
			writableObjectMode: false
		});
		ws.on("message", function message(msg, isBinary) {
			const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
			if (!duplex.push(data)) ws.pause();
		});
		ws.once("error", function error(err) {
			if (duplex.destroyed) return;
			terminateOnDestroy = false;
			duplex.destroy(err);
		});
		ws.once("close", function close() {
			if (duplex.destroyed) return;
			duplex.push(null);
		});
		duplex._destroy = function(err, callback) {
			if (ws.readyState === ws.CLOSED) {
				callback(err);
				process.nextTick(emitClose, duplex);
				return;
			}
			let called = false;
			ws.once("error", function error(err) {
				called = true;
				callback(err);
			});
			ws.once("close", function close() {
				if (!called) callback(err);
				process.nextTick(emitClose, duplex);
			});
			if (terminateOnDestroy) ws.terminate();
		};
		duplex._final = function(callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._final(callback);
				});
				return;
			}
			if (ws._socket === null) return;
			if (ws._socket._writableState.finished) {
				callback();
				if (duplex._readableState.endEmitted) duplex.destroy();
			} else {
				ws._socket.once("finish", function finish() {
					callback();
				});
				ws.close();
			}
		};
		duplex._read = function() {
			if (ws.isPaused) ws.resume();
		};
		duplex._write = function(chunk, encoding, callback) {
			if (ws.readyState === ws.CONNECTING) {
				ws.once("open", function open() {
					duplex._write(chunk, encoding, callback);
				});
				return;
			}
			ws.send(chunk, callback);
		};
		duplex.on("end", duplexOnEnd);
		duplex.on("error", duplexOnError);
		return duplex;
	}
	module.exports = createWebSocketStream;
}));
//#endregion
//#region node_modules/ws/lib/subprotocol.js
var require_subprotocol = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { tokenChars } = require_validation();
	/**
	* Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	*
	* @param {String} header The field value of the header
	* @return {Set} The subprotocol names
	* @public
	*/
	function parse(header) {
		const protocols = /* @__PURE__ */ new Set();
		let start = -1;
		let end = -1;
		let i = 0;
		for (; i < header.length; i++) {
			const code = header.charCodeAt(i);
			if (end === -1 && tokenChars[code] === 1) {
				if (start === -1) start = i;
			} else if (i !== 0 && (code === 32 || code === 9)) {
				if (end === -1 && start !== -1) end = i;
			} else if (code === 44) {
				if (start === -1) throw new SyntaxError(`Unexpected character at index ${i}`);
				if (end === -1) end = i;
				const protocol = header.slice(start, end);
				if (protocols.has(protocol)) throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
				protocols.add(protocol);
				start = end = -1;
			} else throw new SyntaxError(`Unexpected character at index ${i}`);
		}
		if (start === -1 || end !== -1) throw new SyntaxError("Unexpected end of input");
		const protocol = header.slice(start, i);
		if (protocols.has(protocol)) throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
		protocols.add(protocol);
		return protocols;
	}
	module.exports = { parse };
}));
//#endregion
//#region node_modules/ws/lib/websocket-server.js
var require_websocket_server = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$1 = __require("events");
	var http = __require("http");
	var { Duplex } = __require("stream");
	var { createHash } = __require("crypto");
	var extension = require_extension();
	var PerMessageDeflate = require_permessage_deflate();
	var subprotocol = require_subprotocol();
	var WebSocket = require_websocket();
	var { CLOSE_TIMEOUT, GUID, kWebSocket } = require_constants();
	var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
	var RUNNING = 0;
	var CLOSING = 1;
	var CLOSED = 2;
	/**
	* Class representing a WebSocket server.
	*
	* @extends EventEmitter
	*/
	var WebSocketServer = class extends EventEmitter$1 {
		/**
		* Create a `WebSocketServer` instance.
		*
		* @param {Object} options Configuration options
		* @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
		*     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
		*     multiple times in the same tick
		* @param {Boolean} [options.autoPong=true] Specifies whether or not to
		*     automatically send a pong in response to a ping
		* @param {Number} [options.backlog=511] The maximum length of the queue of
		*     pending connections
		* @param {Boolean} [options.clientTracking=true] Specifies whether or not to
		*     track clients
		* @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
		*     wait for the closing handshake to finish after `websocket.close()` is
		*     called
		* @param {Function} [options.handleProtocols] A hook to handle protocols
		* @param {String} [options.host] The hostname where to bind the server
		* @param {Number} [options.maxPayload=104857600] The maximum allowed message
		*     size
		* @param {Boolean} [options.noServer=false] Enable no server mode
		* @param {String} [options.path] Accept only connections matching this path
		* @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
		*     permessage-deflate
		* @param {Number} [options.port] The port where to bind the server
		* @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
		*     server to use
		* @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
		*     not to skip UTF-8 validation for text and close messages
		* @param {Function} [options.verifyClient] A hook to reject connections
		* @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
		*     class to use. It must be the `WebSocket` class or class that extends it
		* @param {Function} [callback] A listener for the `listening` event
		*/
		constructor(options, callback) {
			super();
			options = {
				allowSynchronousEvents: true,
				autoPong: true,
				maxPayload: 100 * 1024 * 1024,
				skipUTF8Validation: false,
				perMessageDeflate: false,
				handleProtocols: null,
				clientTracking: true,
				closeTimeout: CLOSE_TIMEOUT,
				verifyClient: null,
				noServer: false,
				backlog: null,
				server: null,
				host: null,
				path: null,
				port: null,
				WebSocket,
				...options
			};
			if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) throw new TypeError("One and only one of the \"port\", \"server\", or \"noServer\" options must be specified");
			if (options.port != null) {
				this._server = http.createServer((req, res) => {
					const body = http.STATUS_CODES[426];
					res.writeHead(426, {
						"Content-Length": body.length,
						"Content-Type": "text/plain"
					});
					res.end(body);
				});
				this._server.listen(options.port, options.host, options.backlog, callback);
			} else if (options.server) this._server = options.server;
			if (this._server) {
				const emitConnection = this.emit.bind(this, "connection");
				this._removeListeners = addListeners(this._server, {
					listening: this.emit.bind(this, "listening"),
					error: this.emit.bind(this, "error"),
					upgrade: (req, socket, head) => {
						this.handleUpgrade(req, socket, head, emitConnection);
					}
				});
			}
			if (options.perMessageDeflate === true) options.perMessageDeflate = {};
			if (options.clientTracking) {
				this.clients = /* @__PURE__ */ new Set();
				this._shouldEmitClose = false;
			}
			this.options = options;
			this._state = RUNNING;
		}
		/**
		* Returns the bound address, the address family name, and port of the server
		* as reported by the operating system if listening on an IP socket.
		* If the server is listening on a pipe or UNIX domain socket, the name is
		* returned as a string.
		*
		* @return {(Object|String|null)} The address of the server
		* @public
		*/
		address() {
			if (this.options.noServer) throw new Error("The server is operating in \"noServer\" mode");
			if (!this._server) return null;
			return this._server.address();
		}
		/**
		* Stop the server from accepting new connections and emit the `'close'` event
		* when all existing connections are closed.
		*
		* @param {Function} [cb] A one-time listener for the `'close'` event
		* @public
		*/
		close(cb) {
			if (this._state === CLOSED) {
				if (cb) this.once("close", () => {
					cb(/* @__PURE__ */ new Error("The server is not running"));
				});
				process.nextTick(emitClose, this);
				return;
			}
			if (cb) this.once("close", cb);
			if (this._state === CLOSING) return;
			this._state = CLOSING;
			if (this.options.noServer || this.options.server) {
				if (this._server) {
					this._removeListeners();
					this._removeListeners = this._server = null;
				}
				if (this.clients) if (!this.clients.size) process.nextTick(emitClose, this);
				else this._shouldEmitClose = true;
				else process.nextTick(emitClose, this);
			} else {
				const server = this._server;
				this._removeListeners();
				this._removeListeners = this._server = null;
				server.close(() => {
					emitClose(this);
				});
			}
		}
		/**
		* See if a given request should be handled by this server instance.
		*
		* @param {http.IncomingMessage} req Request object to inspect
		* @return {Boolean} `true` if the request is valid, else `false`
		* @public
		*/
		shouldHandle(req) {
			if (this.options.path) {
				const index = req.url.indexOf("?");
				if ((index !== -1 ? req.url.slice(0, index) : req.url) !== this.options.path) return false;
			}
			return true;
		}
		/**
		* Handle a HTTP Upgrade request.
		*
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @public
		*/
		handleUpgrade(req, socket, head, cb) {
			socket.on("error", socketOnError);
			const key = req.headers["sec-websocket-key"];
			const upgrade = req.headers.upgrade;
			const version = +req.headers["sec-websocket-version"];
			if (req.method !== "GET") {
				abortHandshakeOrEmitwsClientError(this, req, socket, 405, "Invalid HTTP method");
				return;
			}
			if (upgrade === void 0 || upgrade.toLowerCase() !== "websocket") {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid Upgrade header");
				return;
			}
			if (key === void 0 || !keyRegex.test(key)) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Missing or invalid Sec-WebSocket-Key header");
				return;
			}
			if (version !== 13 && version !== 8) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Missing or invalid Sec-WebSocket-Version header", { "Sec-WebSocket-Version": "13, 8" });
				return;
			}
			if (!this.shouldHandle(req)) {
				abortHandshake(socket, 400);
				return;
			}
			const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
			let protocols = /* @__PURE__ */ new Set();
			if (secWebSocketProtocol !== void 0) try {
				protocols = subprotocol.parse(secWebSocketProtocol);
			} catch (err) {
				abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid Sec-WebSocket-Protocol header");
				return;
			}
			const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
			const extensions = {};
			if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
				const perMessageDeflate = new PerMessageDeflate({
					...this.options.perMessageDeflate,
					isServer: true,
					maxPayload: this.options.maxPayload
				});
				try {
					const offers = extension.parse(secWebSocketExtensions);
					if (offers[PerMessageDeflate.extensionName]) {
						perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
						extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
					}
				} catch (err) {
					abortHandshakeOrEmitwsClientError(this, req, socket, 400, "Invalid or unacceptable Sec-WebSocket-Extensions header");
					return;
				}
			}
			if (this.options.verifyClient) {
				const info = {
					origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
					secure: !!(req.socket.authorized || req.socket.encrypted),
					req
				};
				if (this.options.verifyClient.length === 2) {
					this.options.verifyClient(info, (verified, code, message, headers) => {
						if (!verified) return abortHandshake(socket, code || 401, message, headers);
						this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
					});
					return;
				}
				if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
			}
			this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
		}
		/**
		* Upgrade the connection to WebSocket.
		*
		* @param {Object} extensions The accepted extensions
		* @param {String} key The value of the `Sec-WebSocket-Key` header
		* @param {Set} protocols The subprotocols
		* @param {http.IncomingMessage} req The request object
		* @param {Duplex} socket The network socket between the server and client
		* @param {Buffer} head The first packet of the upgraded stream
		* @param {Function} cb Callback
		* @throws {Error} If called more than once with the same socket
		* @private
		*/
		completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
			if (!socket.readable || !socket.writable) return socket.destroy();
			if (socket[kWebSocket]) throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
			if (this._state > RUNNING) return abortHandshake(socket, 503);
			const headers = [
				"HTTP/1.1 101 Switching Protocols",
				"Upgrade: websocket",
				"Connection: Upgrade",
				`Sec-WebSocket-Accept: ${createHash("sha1").update(key + GUID).digest("base64")}`
			];
			const ws = new this.options.WebSocket(null, void 0, this.options);
			if (protocols.size) {
				const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
				if (protocol) {
					headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
					ws._protocol = protocol;
				}
			}
			if (extensions[PerMessageDeflate.extensionName]) {
				const params = extensions[PerMessageDeflate.extensionName].params;
				const value = extension.format({ [PerMessageDeflate.extensionName]: [params] });
				headers.push(`Sec-WebSocket-Extensions: ${value}`);
				ws._extensions = extensions;
			}
			this.emit("headers", headers, req);
			socket.write(headers.concat("\r\n").join("\r\n"));
			socket.removeListener("error", socketOnError);
			ws.setSocket(socket, head, {
				allowSynchronousEvents: this.options.allowSynchronousEvents,
				maxPayload: this.options.maxPayload,
				skipUTF8Validation: this.options.skipUTF8Validation
			});
			if (this.clients) {
				this.clients.add(ws);
				ws.on("close", () => {
					this.clients.delete(ws);
					if (this._shouldEmitClose && !this.clients.size) process.nextTick(emitClose, this);
				});
			}
			cb(ws, req);
		}
	};
	module.exports = WebSocketServer;
	/**
	* Add event listeners on an `EventEmitter` using a map of <event, listener>
	* pairs.
	*
	* @param {EventEmitter} server The event emitter
	* @param {Object.<String, Function>} map The listeners to add
	* @return {Function} A function that will remove the added listeners when
	*     called
	* @private
	*/
	function addListeners(server, map) {
		for (const event of Object.keys(map)) server.on(event, map[event]);
		return function removeListeners() {
			for (const event of Object.keys(map)) server.removeListener(event, map[event]);
		};
	}
	/**
	* Emit a `'close'` event on an `EventEmitter`.
	*
	* @param {EventEmitter} server The event emitter
	* @private
	*/
	function emitClose(server) {
		server._state = CLOSED;
		server.emit("close");
	}
	/**
	* Handle socket errors.
	*
	* @private
	*/
	function socketOnError() {
		this.destroy();
	}
	/**
	* Close the connection when preconditions are not fulfilled.
	*
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} [message] The HTTP response body
	* @param {Object} [headers] Additional HTTP response headers
	* @private
	*/
	function abortHandshake(socket, code, message, headers) {
		message = message || http.STATUS_CODES[code];
		headers = {
			Connection: "close",
			"Content-Type": "text/html",
			"Content-Length": Buffer.byteLength(message),
			...headers
		};
		socket.once("finish", socket.destroy);
		socket.end(`HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
	}
	/**
	* Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
	* one listener for it, otherwise call `abortHandshake()`.
	*
	* @param {WebSocketServer} server The WebSocket server
	* @param {http.IncomingMessage} req The request object
	* @param {Duplex} socket The socket of the upgrade request
	* @param {Number} code The HTTP response status code
	* @param {String} message The HTTP response body
	* @param {Object} [headers] The HTTP response headers
	* @private
	*/
	function abortHandshakeOrEmitwsClientError(server, req, socket, code, message, headers) {
		if (server.listenerCount("wsClientError")) {
			const err = new Error(message);
			Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
			server.emit("wsClientError", err, socket, req);
		} else abortHandshake(socket, code, message, headers);
	}
})), import_websocket;
var init_wrapper = __esmMin((() => {
	require_stream();
	require_extension();
	require_permessage_deflate();
	require_receiver();
	require_sender();
	require_subprotocol();
	import_websocket = /* @__PURE__ */ __toESM(require_websocket(), 1);
	require_websocket_server();
})), import_src$7, debug$7, isReactNative, BaseWS;
var init_websocket = __esmMin((() => {
	init_transport();
	init_util();
	init_esm$1();
	init_globals_node();
	import_src$7 = /* @__PURE__ */ __toESM(require_src$2());
	debug$7 = (0, import_src$7.default)("engine.io-client:websocket");
	isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
	BaseWS = class extends Transport {
		get name() {
			return "websocket";
		}
		doOpen() {
			const uri = this.uri();
			const protocols = this.opts.protocols;
			const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
			if (this.opts.extraHeaders) opts.headers = this.opts.extraHeaders;
			try {
				this.ws = this.createSocket(uri, protocols, opts);
			} catch (err) {
				return this.emitReserved("error", err);
			}
			this.ws.binaryType = this.socket.binaryType;
			this.addEventListeners();
		}
		/**
		* Adds event listeners to the socket
		*
		* @private
		*/
		addEventListeners() {
			this.ws.onopen = () => {
				if (this.opts.autoUnref) this.ws._socket.unref();
				this.onOpen();
			};
			this.ws.onclose = (closeEvent) => this.onClose({
				description: "websocket connection closed",
				context: closeEvent
			});
			this.ws.onmessage = (ev) => this.onData(ev.data);
			this.ws.onerror = (e) => this.onError("websocket error", e);
		}
		write(packets) {
			this.writable = false;
			for (let i = 0; i < packets.length; i++) {
				const packet = packets[i];
				const lastPacket = i === packets.length - 1;
				encodePacket(packet, this.supportsBinary, (data) => {
					try {
						this.doWrite(packet, data);
					} catch (e) {
						debug$7("websocket closed before onclose event");
					}
					if (lastPacket) nextTick(() => {
						this.writable = true;
						this.emitReserved("drain");
					}, this.setTimeoutFn);
				});
			}
		}
		doClose() {
			if (typeof this.ws !== "undefined") {
				this.ws.onerror = () => {};
				this.ws.close();
				this.ws = null;
			}
		}
		/**
		* Generates uri for connection.
		*
		* @private
		*/
		uri() {
			const schema = this.opts.secure ? "wss" : "ws";
			const query = this.query || {};
			if (this.opts.timestampRequests) query[this.opts.timestampParam] = randomString();
			if (!this.supportsBinary) query.b64 = 1;
			return this.createUri(schema, query);
		}
	};
	globalThisShim.WebSocket || globalThisShim.MozWebSocket;
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/transports/websocket.node.js
var WS;
var init_websocket_node = __esmMin((() => {
	init_wrapper();
	init_websocket();
	WS = class extends BaseWS {
		createSocket(uri, protocols, opts) {
			var _a;
			if ((_a = this.socket) === null || _a === void 0 ? void 0 : _a._cookieJar) {
				opts.headers = opts.headers || {};
				opts.headers.cookie = typeof opts.headers.cookie === "string" ? [opts.headers.cookie] : opts.headers.cookie || [];
				for (const [name, cookie] of this.socket._cookieJar.cookies) opts.headers.cookie.push(`${name}=${cookie.value}`);
			}
			return new import_websocket.default(uri, protocols, opts);
		}
		doWrite(packet, data) {
			const opts = {};
			if (packet.options) opts.compress = packet.options.compress;
			if (this.opts.perMessageDeflate) {
				if (("string" === typeof data ? Buffer.byteLength(data) : data.length) < this.opts.perMessageDeflate.threshold) opts.compress = false;
			}
			this.ws.send(data, opts);
		}
	};
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/transports/webtransport.js
var import_src$6, debug$6, WT;
var init_webtransport = __esmMin((() => {
	init_transport();
	init_globals_node();
	init_esm$1();
	import_src$6 = /* @__PURE__ */ __toESM(require_src$2());
	debug$6 = (0, import_src$6.default)("engine.io-client:webtransport");
	WT = class extends Transport {
		get name() {
			return "webtransport";
		}
		doOpen() {
			try {
				this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
			} catch (err) {
				return this.emitReserved("error", err);
			}
			this._transport.closed.then(() => {
				debug$6("transport closed gracefully");
				this.onClose();
			}).catch((err) => {
				debug$6("transport closed due to %s", err);
				this.onError("webtransport error", err);
			});
			this._transport.ready.then(() => {
				this._transport.createBidirectionalStream().then((stream) => {
					const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
					const reader = stream.readable.pipeThrough(decoderStream).getReader();
					const encoderStream = createPacketEncoderStream();
					encoderStream.readable.pipeTo(stream.writable);
					this._writer = encoderStream.writable.getWriter();
					const read = () => {
						reader.read().then(({ done, value }) => {
							if (done) {
								debug$6("session is closed");
								return;
							}
							debug$6("received chunk: %o", value);
							this.onPacket(value);
							read();
						}).catch((err) => {
							debug$6("an error occurred while reading: %s", err);
						});
					};
					read();
					const packet = { type: "open" };
					if (this.query.sid) packet.data = `{"sid":"${this.query.sid}"}`;
					this._writer.write(packet).then(() => this.onOpen());
				});
			});
		}
		write(packets) {
			this.writable = false;
			for (let i = 0; i < packets.length; i++) {
				const packet = packets[i];
				const lastPacket = i === packets.length - 1;
				this._writer.write(packet).then(() => {
					if (lastPacket) nextTick(() => {
						this.writable = true;
						this.emitReserved("drain");
					}, this.setTimeoutFn);
				});
			}
		}
		doClose() {
			var _a;
			(_a = this._transport) === null || _a === void 0 || _a.close();
		}
	};
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/transports/index.js
var transports;
var init_transports = __esmMin((() => {
	init_polling_xhr_node();
	init_websocket_node();
	init_webtransport();
	transports = {
		websocket: WS,
		webtransport: WT,
		polling: XHR
	};
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/contrib/parseuri.js
function parse(str) {
	if (str.length > 8e3) throw "URI too long";
	const src = str, b = str.indexOf("["), e = str.indexOf("]");
	if (b != -1 && e != -1) str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
	let m = re.exec(str || ""), uri = {}, i = 14;
	while (i--) uri[parts[i]] = m[i] || "";
	if (b != -1 && e != -1) {
		uri.source = src;
		uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
		uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
		uri.ipv6uri = true;
	}
	uri.pathNames = pathNames(uri, uri["path"]);
	uri.queryKey = queryKey(uri, uri["query"]);
	return uri;
}
function pathNames(obj, path) {
	const names = path.replace(/\/{2,9}/g, "/").split("/");
	if (path.slice(0, 1) == "/" || path.length === 0) names.splice(0, 1);
	if (path.slice(-1) == "/") names.splice(names.length - 1, 1);
	return names;
}
function queryKey(uri, query) {
	const data = {};
	query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
		if ($1) data[$1] = $2;
	});
	return data;
}
var re, parts;
var init_parseuri = __esmMin((() => {
	re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
	parts = [
		"source",
		"protocol",
		"authority",
		"userInfo",
		"user",
		"password",
		"host",
		"port",
		"relative",
		"path",
		"directory",
		"file",
		"query",
		"anchor"
	];
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/socket.js
var import_src$5, debug$5, withEventListeners, OFFLINE_EVENT_LISTENERS, SocketWithoutUpgrade, SocketWithUpgrade, Socket$1;
var init_socket$1 = __esmMin((() => {
	init_transports();
	init_util();
	init_parseqs();
	init_parseuri();
	init_esm();
	init_esm$1();
	init_globals_node();
	import_src$5 = /* @__PURE__ */ __toESM(require_src$2());
	debug$5 = (0, import_src$5.default)("engine.io-client:socket");
	withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
	OFFLINE_EVENT_LISTENERS = [];
	if (withEventListeners) addEventListener("offline", () => {
		debug$5("closing %d connection(s) because the network was lost", OFFLINE_EVENT_LISTENERS.length);
		OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
	}, false);
	SocketWithoutUpgrade = class SocketWithoutUpgrade extends Emitter {
		/**
		* Socket constructor.
		*
		* @param {String|Object} uri - uri or options
		* @param {Object} opts - options
		*/
		constructor(uri, opts) {
			super();
			this.binaryType = defaultBinaryType;
			this.writeBuffer = [];
			this._prevBufferLen = 0;
			this._pingInterval = -1;
			this._pingTimeout = -1;
			this._maxPayload = -1;
			/**
			* The expiration timestamp of the {@link _pingTimeoutTimer} object is tracked, in case the timer is throttled and the
			* callback is not fired on time. This can happen for example when a laptop is suspended or when a phone is locked.
			*/
			this._pingTimeoutTime = Infinity;
			if (uri && "object" === typeof uri) {
				opts = uri;
				uri = null;
			}
			if (uri) {
				const parsedUri = parse(uri);
				opts.hostname = parsedUri.host;
				opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
				opts.port = parsedUri.port;
				if (parsedUri.query) opts.query = parsedUri.query;
			} else if (opts.host) opts.hostname = parse(opts.host).host;
			installTimerFunctions(this, opts);
			this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
			if (opts.hostname && !opts.port) opts.port = this.secure ? "443" : "80";
			this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
			this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
			this.transports = [];
			this._transportsByName = {};
			opts.transports.forEach((t) => {
				const transportName = t.prototype.name;
				this.transports.push(transportName);
				this._transportsByName[transportName] = t;
			});
			this.opts = Object.assign({
				path: "/engine.io",
				agent: false,
				withCredentials: false,
				upgrade: true,
				timestampParam: "t",
				rememberUpgrade: false,
				addTrailingSlash: true,
				rejectUnauthorized: true,
				perMessageDeflate: { threshold: 1024 },
				transportOptions: {},
				closeOnBeforeunload: false
			}, opts);
			this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
			if (typeof this.opts.query === "string") this.opts.query = decode(this.opts.query);
			if (withEventListeners) {
				if (this.opts.closeOnBeforeunload) {
					this._beforeunloadEventListener = () => {
						if (this.transport) {
							this.transport.removeAllListeners();
							this.transport.close();
						}
					};
					addEventListener("beforeunload", this._beforeunloadEventListener, false);
				}
				if (this.hostname !== "localhost") {
					debug$5("adding listener for the 'offline' event");
					this._offlineEventListener = () => {
						this._onClose("transport close", { description: "network connection lost" });
					};
					OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
				}
			}
			if (this.opts.withCredentials) this._cookieJar = createCookieJar();
			this._open();
		}
		/**
		* Creates transport of the given type.
		*
		* @param {String} name - transport name
		* @return {Transport}
		* @private
		*/
		createTransport(name) {
			debug$5("creating transport \"%s\"", name);
			const query = Object.assign({}, this.opts.query);
			query.EIO = 4;
			query.transport = name;
			if (this.id) query.sid = this.id;
			const opts = Object.assign({}, this.opts, {
				query,
				socket: this,
				hostname: this.hostname,
				secure: this.secure,
				port: this.port
			}, this.opts.transportOptions[name]);
			debug$5("options: %j", opts);
			return new this._transportsByName[name](opts);
		}
		/**
		* Initializes transport to use and starts probe.
		*
		* @private
		*/
		_open() {
			if (this.transports.length === 0) {
				this.setTimeoutFn(() => {
					this.emitReserved("error", "No transports available");
				}, 0);
				return;
			}
			const transportName = this.opts.rememberUpgrade && SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
			this.readyState = "opening";
			const transport = this.createTransport(transportName);
			transport.open();
			this.setTransport(transport);
		}
		/**
		* Sets the current transport. Disables the existing one (if any).
		*
		* @private
		*/
		setTransport(transport) {
			debug$5("setting transport %s", transport.name);
			if (this.transport) {
				debug$5("clearing existing transport %s", this.transport.name);
				this.transport.removeAllListeners();
			}
			this.transport = transport;
			transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
		}
		/**
		* Called when connection is deemed open.
		*
		* @private
		*/
		onOpen() {
			debug$5("socket open");
			this.readyState = "open";
			SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
			this.emitReserved("open");
			this.flush();
		}
		/**
		* Handles a packet.
		*
		* @private
		*/
		_onPacket(packet) {
			if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
				debug$5("socket receive: type \"%s\", data \"%s\"", packet.type, packet.data);
				this.emitReserved("packet", packet);
				this.emitReserved("heartbeat");
				switch (packet.type) {
					case "open":
						this.onHandshake(JSON.parse(packet.data));
						break;
					case "ping":
						this._sendPacket("pong");
						this.emitReserved("ping");
						this.emitReserved("pong");
						this._resetPingTimeout();
						break;
					case "error":
						const err = /* @__PURE__ */ new Error("server error");
						err.code = packet.data;
						this._onError(err);
						break;
					case "message":
						this.emitReserved("data", packet.data);
						this.emitReserved("message", packet.data);
						break;
				}
			} else debug$5("packet received with socket readyState \"%s\"", this.readyState);
		}
		/**
		* Called upon handshake completion.
		*
		* @param {Object} data - handshake obj
		* @private
		*/
		onHandshake(data) {
			this.emitReserved("handshake", data);
			this.id = data.sid;
			this.transport.query.sid = data.sid;
			this._pingInterval = data.pingInterval;
			this._pingTimeout = data.pingTimeout;
			this._maxPayload = data.maxPayload;
			this.onOpen();
			if ("closed" === this.readyState) return;
			this._resetPingTimeout();
		}
		/**
		* Sets and resets ping timeout timer based on server pings.
		*
		* @private
		*/
		_resetPingTimeout() {
			this.clearTimeoutFn(this._pingTimeoutTimer);
			const delay = this._pingInterval + this._pingTimeout;
			this._pingTimeoutTime = Date.now() + delay;
			this._pingTimeoutTimer = this.setTimeoutFn(() => {
				this._onClose("ping timeout");
			}, delay);
			if (this.opts.autoUnref) this._pingTimeoutTimer.unref();
		}
		/**
		* Called on `drain` event
		*
		* @private
		*/
		_onDrain() {
			this.writeBuffer.splice(0, this._prevBufferLen);
			this._prevBufferLen = 0;
			if (0 === this.writeBuffer.length) this.emitReserved("drain");
			else this.flush();
		}
		/**
		* Flush write buffers.
		*
		* @private
		*/
		flush() {
			if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
				const packets = this._getWritablePackets();
				debug$5("flushing %d packets in socket", packets.length);
				this.transport.send(packets);
				this._prevBufferLen = packets.length;
				this.emitReserved("flush");
			}
		}
		/**
		* Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
		* long-polling)
		*
		* @private
		*/
		_getWritablePackets() {
			if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1)) return this.writeBuffer;
			let payloadSize = 1;
			for (let i = 0; i < this.writeBuffer.length; i++) {
				const data = this.writeBuffer[i].data;
				if (data) payloadSize += byteLength(data);
				if (i > 0 && payloadSize > this._maxPayload) {
					debug$5("only send %d out of %d packets", i, this.writeBuffer.length);
					return this.writeBuffer.slice(0, i);
				}
				payloadSize += 2;
			}
			debug$5("payload size is %d (max: %d)", payloadSize, this._maxPayload);
			return this.writeBuffer;
		}
		/**
		* Checks whether the heartbeat timer has expired but the socket has not yet been notified.
		*
		* Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
		* `write()` method then the message would not be buffered by the Socket.IO client.
		*
		* @return {boolean}
		* @private
		*/
		_hasPingExpired() {
			if (!this._pingTimeoutTime) return true;
			const hasExpired = Date.now() > this._pingTimeoutTime;
			if (hasExpired) {
				debug$5("throttled timer detected, scheduling connection close");
				this._pingTimeoutTime = 0;
				nextTick(() => {
					this._onClose("ping timeout");
				}, this.setTimeoutFn);
			}
			return hasExpired;
		}
		/**
		* Sends a message.
		*
		* @param {String} msg - message.
		* @param {Object} options.
		* @param {Function} fn - callback function.
		* @return {Socket} for chaining.
		*/
		write(msg, options, fn) {
			this._sendPacket("message", msg, options, fn);
			return this;
		}
		/**
		* Sends a message. Alias of {@link Socket#write}.
		*
		* @param {String} msg - message.
		* @param {Object} options.
		* @param {Function} fn - callback function.
		* @return {Socket} for chaining.
		*/
		send(msg, options, fn) {
			this._sendPacket("message", msg, options, fn);
			return this;
		}
		/**
		* Sends a packet.
		*
		* @param {String} type - packet type.
		* @param {String} data.
		* @param {Object} options.
		* @param {Function} fn - callback function.
		* @private
		*/
		_sendPacket(type, data, options, fn) {
			if ("function" === typeof data) {
				fn = data;
				data = void 0;
			}
			if ("function" === typeof options) {
				fn = options;
				options = null;
			}
			if ("closing" === this.readyState || "closed" === this.readyState) return;
			options = options || {};
			options.compress = false !== options.compress;
			const packet = {
				type,
				data,
				options
			};
			this.emitReserved("packetCreate", packet);
			this.writeBuffer.push(packet);
			if (fn) this.once("flush", fn);
			this.flush();
		}
		/**
		* Closes the connection.
		*/
		close() {
			const close = () => {
				this._onClose("forced close");
				debug$5("socket closing - telling transport to close");
				this.transport.close();
			};
			const cleanupAndClose = () => {
				this.off("upgrade", cleanupAndClose);
				this.off("upgradeError", cleanupAndClose);
				close();
			};
			const waitForUpgrade = () => {
				this.once("upgrade", cleanupAndClose);
				this.once("upgradeError", cleanupAndClose);
			};
			if ("opening" === this.readyState || "open" === this.readyState) {
				this.readyState = "closing";
				if (this.writeBuffer.length) this.once("drain", () => {
					if (this.upgrading) waitForUpgrade();
					else close();
				});
				else if (this.upgrading) waitForUpgrade();
				else close();
			}
			return this;
		}
		/**
		* Called upon transport error
		*
		* @private
		*/
		_onError(err) {
			debug$5("socket error %j", err);
			SocketWithoutUpgrade.priorWebsocketSuccess = false;
			if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
				debug$5("trying next transport");
				this.transports.shift();
				return this._open();
			}
			this.emitReserved("error", err);
			this._onClose("transport error", err);
		}
		/**
		* Called upon transport close.
		*
		* @private
		*/
		_onClose(reason, description) {
			if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
				debug$5("socket close with reason: \"%s\"", reason);
				this.clearTimeoutFn(this._pingTimeoutTimer);
				this.transport.removeAllListeners("close");
				this.transport.close();
				this.transport.removeAllListeners();
				if (withEventListeners) {
					if (this._beforeunloadEventListener) removeEventListener("beforeunload", this._beforeunloadEventListener, false);
					if (this._offlineEventListener) {
						const i = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
						if (i !== -1) {
							debug$5("removing listener for the 'offline' event");
							OFFLINE_EVENT_LISTENERS.splice(i, 1);
						}
					}
				}
				this.readyState = "closed";
				this.id = null;
				this.emitReserved("close", reason, description);
				this.writeBuffer = [];
				this._prevBufferLen = 0;
			}
		}
	};
	SocketWithoutUpgrade.protocol = 4;
	SocketWithUpgrade = class extends SocketWithoutUpgrade {
		constructor() {
			super(...arguments);
			this._upgrades = [];
		}
		onOpen() {
			super.onOpen();
			if ("open" === this.readyState && this.opts.upgrade) {
				debug$5("starting upgrade probes");
				for (let i = 0; i < this._upgrades.length; i++) this._probe(this._upgrades[i]);
			}
		}
		/**
		* Probes a transport.
		*
		* @param {String} name - transport name
		* @private
		*/
		_probe(name) {
			debug$5("probing transport \"%s\"", name);
			let transport = this.createTransport(name);
			let failed = false;
			SocketWithoutUpgrade.priorWebsocketSuccess = false;
			const onTransportOpen = () => {
				if (failed) return;
				debug$5("probe transport \"%s\" opened", name);
				transport.send([{
					type: "ping",
					data: "probe"
				}]);
				transport.once("packet", (msg) => {
					if (failed) return;
					if ("pong" === msg.type && "probe" === msg.data) {
						debug$5("probe transport \"%s\" pong", name);
						this.upgrading = true;
						this.emitReserved("upgrading", transport);
						if (!transport) return;
						SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
						debug$5("pausing current transport \"%s\"", this.transport.name);
						this.transport.pause(() => {
							if (failed) return;
							if ("closed" === this.readyState) return;
							debug$5("changing transport and sending upgrade packet");
							cleanup();
							this.setTransport(transport);
							transport.send([{ type: "upgrade" }]);
							this.emitReserved("upgrade", transport);
							transport = null;
							this.upgrading = false;
							this.flush();
						});
					} else {
						debug$5("probe transport \"%s\" failed", name);
						const err = /* @__PURE__ */ new Error("probe error");
						err.transport = transport.name;
						this.emitReserved("upgradeError", err);
					}
				});
			};
			function freezeTransport() {
				if (failed) return;
				failed = true;
				cleanup();
				transport.close();
				transport = null;
			}
			const onerror = (err) => {
				const error = /* @__PURE__ */ new Error("probe error: " + err);
				error.transport = transport.name;
				freezeTransport();
				debug$5("probe transport \"%s\" failed because of error: %s", name, err);
				this.emitReserved("upgradeError", error);
			};
			function onTransportClose() {
				onerror("transport closed");
			}
			function onclose() {
				onerror("socket closed");
			}
			function onupgrade(to) {
				if (transport && to.name !== transport.name) {
					debug$5("\"%s\" works - aborting \"%s\"", to.name, transport.name);
					freezeTransport();
				}
			}
			const cleanup = () => {
				transport.removeListener("open", onTransportOpen);
				transport.removeListener("error", onerror);
				transport.removeListener("close", onTransportClose);
				this.off("close", onclose);
				this.off("upgrading", onupgrade);
			};
			transport.once("open", onTransportOpen);
			transport.once("error", onerror);
			transport.once("close", onTransportClose);
			this.once("close", onclose);
			this.once("upgrading", onupgrade);
			if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") this.setTimeoutFn(() => {
				if (!failed) transport.open();
			}, 200);
			else transport.open();
		}
		onHandshake(data) {
			this._upgrades = this._filterUpgrades(data.upgrades);
			super.onHandshake(data);
		}
		/**
		* Filters upgrades, returning only those matching client transports.
		*
		* @param {Array} upgrades - server upgrades
		* @private
		*/
		_filterUpgrades(upgrades) {
			const filteredUpgrades = [];
			for (let i = 0; i < upgrades.length; i++) if (~this.transports.indexOf(upgrades[i])) filteredUpgrades.push(upgrades[i]);
			return filteredUpgrades;
		}
	};
	Socket$1 = class extends SocketWithUpgrade {
		constructor(uri, opts = {}) {
			const o = typeof uri === "object" ? uri : opts;
			if (!o.transports || o.transports && typeof o.transports[0] === "string") o.transports = (o.transports || [
				"polling",
				"websocket",
				"webtransport"
			]).map((transportName) => transports[transportName]).filter((t) => !!t);
			super(uri, o);
		}
	};
}));
//#endregion
//#region node_modules/engine.io-client/build/esm-debug/transports/polling-fetch.js
var init_polling_fetch = __esmMin((() => {
	init_polling();
}));
var init_esm_debug$2 = __esmMin((() => {
	init_socket$1();
	init_transport();
	init_transports();
	init_util();
	init_parseuri();
	init_globals_node();
	init_polling_fetch();
	init_polling_xhr_node();
	init_polling_xhr();
	init_websocket_node();
	init_websocket();
	init_webtransport();
	Socket$1.protocol;
}));
//#endregion
//#region node_modules/socket.io-client/node_modules/ms/index.js
var require_ms$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region node_modules/socket.io-client/node_modules/debug/src/common.js
var require_common$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms$1();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
				starIndex = templateIndex;
				matchIndex = searchIndex;
				templateIndex++;
			} else {
				searchIndex++;
				templateIndex++;
			}
			else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region node_modules/socket.io-client/node_modules/debug/src/browser.js
var require_browser$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common$1()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region node_modules/socket.io-client/node_modules/debug/src/node.js
var require_node$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var tty$1 = __require("tty");
	var util$1 = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util$1.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = require_supports_color();
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty$1.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util$1.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common$1()(exports);
	var { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$1.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util$1.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region node_modules/socket.io-client/node_modules/debug/src/index.js
var require_src$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser$1();
	else module.exports = require_node$1();
}));
//#endregion
//#region node_modules/socket.io-client/build/esm-debug/url.js
/**
* URL parser.
*
* @param uri - url
* @param path - the request path of the connection
* @param loc - An object meant to mimic window.location.
*        Defaults to window.location.
* @public
*/
function url(uri, path = "", loc) {
	let obj = uri;
	loc = loc || typeof location !== "undefined" && location;
	if (null == uri) uri = loc.protocol + "//" + loc.host;
	if (typeof uri === "string") {
		if ("/" === uri.charAt(0)) if ("/" === uri.charAt(1)) uri = loc.protocol + uri;
		else uri = loc.host + uri;
		if (!/^(https?|wss?):\/\//.test(uri)) {
			debug$4("protocol-less url %s", uri);
			if ("undefined" !== typeof loc) uri = loc.protocol + "//" + uri;
			else uri = "https://" + uri;
		}
		debug$4("parse %s", uri);
		obj = parse(uri);
	}
	if (!obj.port) {
		if (/^(http|ws)$/.test(obj.protocol)) obj.port = "80";
		else if (/^(http|ws)s$/.test(obj.protocol)) obj.port = "443";
	}
	obj.path = obj.path || "/";
	const host = obj.host.indexOf(":") !== -1 ? "[" + obj.host + "]" : obj.host;
	obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
	obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
	return obj;
}
var import_src$4, debug$4;
var init_url = __esmMin((() => {
	init_esm_debug$2();
	import_src$4 = /* @__PURE__ */ __toESM(require_src$1());
	debug$4 = (0, import_src$4.default)("socket.io-client:url");
}));
//#endregion
//#region node_modules/socket.io-parser/build/esm-debug/is-binary.js
/**
* Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
*
* @private
*/
function isBinary(obj) {
	return withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)) || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
}
function hasBinary(obj, toJSON) {
	if (!obj || typeof obj !== "object") return false;
	if (Array.isArray(obj)) {
		for (let i = 0, l = obj.length; i < l; i++) if (hasBinary(obj[i])) return true;
		return false;
	}
	if (isBinary(obj)) return true;
	if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) return hasBinary(obj.toJSON(), true);
	for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) return true;
	return false;
}
var withNativeArrayBuffer, isView, toString, withNativeBlob, withNativeFile;
var init_is_binary = __esmMin((() => {
	withNativeArrayBuffer = typeof ArrayBuffer === "function";
	isView = (obj) => {
		return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
	};
	toString = Object.prototype.toString;
	withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
	withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
}));
//#endregion
//#region node_modules/socket.io-parser/build/esm-debug/binary.js
/**
* Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
*
* @param {Object} packet - socket.io event packet
* @return {Object} with deconstructed packet and list of buffers
* @public
*/
function deconstructPacket(packet) {
	const buffers = [];
	const packetData = packet.data;
	const pack = packet;
	pack.data = _deconstructPacket(packetData, buffers);
	pack.attachments = buffers.length;
	return {
		packet: pack,
		buffers
	};
}
function _deconstructPacket(data, buffers) {
	if (!data) return data;
	if (isBinary(data)) {
		const placeholder = {
			_placeholder: true,
			num: buffers.length
		};
		buffers.push(data);
		return placeholder;
	} else if (Array.isArray(data)) {
		const newData = new Array(data.length);
		for (let i = 0; i < data.length; i++) newData[i] = _deconstructPacket(data[i], buffers);
		return newData;
	} else if (typeof data === "object" && !(data instanceof Date)) {
		const newData = {};
		for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) newData[key] = _deconstructPacket(data[key], buffers);
		return newData;
	}
	return data;
}
/**
* Reconstructs a binary packet from its placeholder packet and buffers
*
* @param {Object} packet - event packet with placeholders
* @param {Array} buffers - binary buffers to put in placeholder positions
* @return {Object} reconstructed packet
* @public
*/
function reconstructPacket(packet, buffers) {
	packet.data = _reconstructPacket(packet.data, buffers);
	delete packet.attachments;
	return packet;
}
function _reconstructPacket(data, buffers) {
	if (!data) return data;
	if (data && data._placeholder === true) if (typeof data.num === "number" && data.num >= 0 && data.num < buffers.length) return buffers[data.num];
	else throw new Error("illegal attachments");
	else if (Array.isArray(data)) for (let i = 0; i < data.length; i++) data[i] = _reconstructPacket(data[i], buffers);
	else if (typeof data === "object") {
		for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) data[key] = _reconstructPacket(data[key], buffers);
	}
	return data;
}
var init_binary = __esmMin((() => {
	init_is_binary();
}));
//#endregion
//#region node_modules/socket.io-parser/node_modules/ms/index.js
var require_ms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Helpers.
	*/
	var s = 1e3;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	/**
	* Parse or format the given `val`.
	*
	* Options:
	*
	*  - `long` verbose formatting [false]
	*
	* @param {String|Number} val
	* @param {Object} [options]
	* @throws {Error} throw an error if val is not a non-empty string or a number
	* @return {String|Number}
	* @api public
	*/
	module.exports = function(val, options) {
		options = options || {};
		var type = typeof val;
		if (type === "string" && val.length > 0) return parse(val);
		else if (type === "number" && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);
		throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
	};
	/**
	* Parse the given `str` and return milliseconds.
	*
	* @param {String} str
	* @return {Number}
	* @api private
	*/
	function parse(str) {
		str = String(str);
		if (str.length > 100) return;
		var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
		if (!match) return;
		var n = parseFloat(match[1]);
		switch ((match[2] || "ms").toLowerCase()) {
			case "years":
			case "year":
			case "yrs":
			case "yr":
			case "y": return n * y;
			case "weeks":
			case "week":
			case "w": return n * w;
			case "days":
			case "day":
			case "d": return n * d;
			case "hours":
			case "hour":
			case "hrs":
			case "hr":
			case "h": return n * h;
			case "minutes":
			case "minute":
			case "mins":
			case "min":
			case "m": return n * m;
			case "seconds":
			case "second":
			case "secs":
			case "sec":
			case "s": return n * s;
			case "milliseconds":
			case "millisecond":
			case "msecs":
			case "msec":
			case "ms": return n;
			default: return;
		}
	}
	/**
	* Short format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtShort(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return Math.round(ms / d) + "d";
		if (msAbs >= h) return Math.round(ms / h) + "h";
		if (msAbs >= m) return Math.round(ms / m) + "m";
		if (msAbs >= s) return Math.round(ms / s) + "s";
		return ms + "ms";
	}
	/**
	* Long format for `ms`.
	*
	* @param {Number} ms
	* @return {String}
	* @api private
	*/
	function fmtLong(ms) {
		var msAbs = Math.abs(ms);
		if (msAbs >= d) return plural(ms, msAbs, d, "day");
		if (msAbs >= h) return plural(ms, msAbs, h, "hour");
		if (msAbs >= m) return plural(ms, msAbs, m, "minute");
		if (msAbs >= s) return plural(ms, msAbs, s, "second");
		return ms + " ms";
	}
	/**
	* Pluralization helper.
	*/
	function plural(ms, msAbs, n, name) {
		var isPlural = msAbs >= n * 1.5;
		return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
	}
}));
//#endregion
//#region node_modules/socket.io-parser/node_modules/debug/src/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the common logic for both the Node.js and web browser
	* implementations of `debug()`.
	*/
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = require_ms();
		createDebug.destroy = destroy;
		Object.keys(env).forEach((key) => {
			createDebug[key] = env[key];
		});
		/**
		* The currently active debug mode names, and names to skip.
		*/
		createDebug.names = [];
		createDebug.skips = [];
		/**
		* Map of special "%n" handling functions, for the debug "format" argument.
		*
		* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
		*/
		createDebug.formatters = {};
		/**
		* Selects a color for a debug namespace
		* @param {String} namespace The namespace string for the debug instance to be colored
		* @return {Number|String} An ANSI color code for the given namespace
		* @api private
		*/
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = (hash << 5) - hash + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		/**
		* Create a debugger with the given `namespace`.
		*
		* @param {String} namespace
		* @return {Function}
		* @api public
		*/
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) return;
				const self = debug;
				const curr = Number(/* @__PURE__ */ new Date());
				self.diff = curr - (prevTime || curr);
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== "string") args.unshift("%O");
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === "%%") return "%";
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === "function") {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				(self.log || createDebug.log).apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, "enabled", {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) return enableOverride;
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: (v) => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === "function") createDebug.init(debug);
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		/**
		* Enables a debug mode by namespaces. This can include modes
		* separated by a colon and wildcards.
		*
		* @param {String} namespaces
		* @api public
		*/
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (const ns of split) if (ns[0] === "-") createDebug.skips.push(ns.slice(1));
			else createDebug.names.push(ns);
		}
		/**
		* Checks if the given string matches a namespace template, honoring
		* asterisks as wildcards.
		*
		* @param {String} search
		* @param {String} template
		* @return {Boolean}
		*/
		function matchesTemplate(search, template) {
			let searchIndex = 0;
			let templateIndex = 0;
			let starIndex = -1;
			let matchIndex = 0;
			while (searchIndex < search.length) if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) if (template[templateIndex] === "*") {
				starIndex = templateIndex;
				matchIndex = searchIndex;
				templateIndex++;
			} else {
				searchIndex++;
				templateIndex++;
			}
			else if (starIndex !== -1) {
				templateIndex = starIndex + 1;
				matchIndex++;
				searchIndex = matchIndex;
			} else return false;
			while (templateIndex < template.length && template[templateIndex] === "*") templateIndex++;
			return templateIndex === template.length;
		}
		/**
		* Disable debug output.
		*
		* @return {String} namespaces
		* @api public
		*/
		function disable() {
			const namespaces = [...createDebug.names, ...createDebug.skips.map((namespace) => "-" + namespace)].join(",");
			createDebug.enable("");
			return namespaces;
		}
		/**
		* Returns true if the given mode name is enabled, false otherwise.
		*
		* @param {String} name
		* @return {Boolean}
		* @api public
		*/
		function enabled(name) {
			for (const skip of createDebug.skips) if (matchesTemplate(name, skip)) return false;
			for (const ns of createDebug.names) if (matchesTemplate(name, ns)) return true;
			return false;
		}
		/**
		* Coerce `val`.
		*
		* @param {Mixed} val
		* @return {Mixed}
		* @api private
		*/
		function coerce(val) {
			if (val instanceof Error) return val.stack || val.message;
			return val;
		}
		/**
		* XXX DO NOT USE. This is a temporary stub function.
		* XXX It WILL be removed in the next major release.
		*/
		function destroy() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	module.exports = setup;
}));
//#endregion
//#region node_modules/socket.io-parser/node_modules/debug/src/browser.js
var require_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* This is the web browser implementation of `debug()`.
	*/
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = localstorage();
	exports.destroy = (() => {
		let warned = false;
		return () => {
			if (!warned) {
				warned = true;
				console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
			}
		};
	})();
	/**
	* Colors.
	*/
	exports.colors = [
		"#0000CC",
		"#0000FF",
		"#0033CC",
		"#0033FF",
		"#0066CC",
		"#0066FF",
		"#0099CC",
		"#0099FF",
		"#00CC00",
		"#00CC33",
		"#00CC66",
		"#00CC99",
		"#00CCCC",
		"#00CCFF",
		"#3300CC",
		"#3300FF",
		"#3333CC",
		"#3333FF",
		"#3366CC",
		"#3366FF",
		"#3399CC",
		"#3399FF",
		"#33CC00",
		"#33CC33",
		"#33CC66",
		"#33CC99",
		"#33CCCC",
		"#33CCFF",
		"#6600CC",
		"#6600FF",
		"#6633CC",
		"#6633FF",
		"#66CC00",
		"#66CC33",
		"#9900CC",
		"#9900FF",
		"#9933CC",
		"#9933FF",
		"#99CC00",
		"#99CC33",
		"#CC0000",
		"#CC0033",
		"#CC0066",
		"#CC0099",
		"#CC00CC",
		"#CC00FF",
		"#CC3300",
		"#CC3333",
		"#CC3366",
		"#CC3399",
		"#CC33CC",
		"#CC33FF",
		"#CC6600",
		"#CC6633",
		"#CC9900",
		"#CC9933",
		"#CCCC00",
		"#CCCC33",
		"#FF0000",
		"#FF0033",
		"#FF0066",
		"#FF0099",
		"#FF00CC",
		"#FF00FF",
		"#FF3300",
		"#FF3333",
		"#FF3366",
		"#FF3399",
		"#FF33CC",
		"#FF33FF",
		"#FF6600",
		"#FF6633",
		"#FF9900",
		"#FF9933",
		"#FFCC00",
		"#FFCC33"
	];
	/**
	* Currently only WebKit-based Web Inspectors, Firefox >= v31,
	* and the Firebug extension (any Firefox version) are known
	* to support "%c" CSS customizations.
	*
	* TODO: add a `localStorage` variable to explicitly enable/disable colors
	*/
	function useColors() {
		if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return true;
		if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return false;
		let m;
		return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	/**
	* Colorize log arguments if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
		if (!this.useColors) return;
		const c = "color: " + this.color;
		args.splice(1, 0, c, "color: inherit");
		let index = 0;
		let lastC = 0;
		args[0].replace(/%[a-zA-Z%]/g, (match) => {
			if (match === "%%") return;
			index++;
			if (match === "%c") lastC = index;
		});
		args.splice(lastC, 0, c);
	}
	/**
	* Invokes `console.debug()` when available.
	* No-op when `console.debug` is not a "function".
	* If `console.debug` is not available, falls back
	* to `console.log`.
	*
	* @api public
	*/
	exports.log = console.debug || console.log || (() => {});
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		try {
			if (namespaces) exports.storage.setItem("debug", namespaces);
			else exports.storage.removeItem("debug");
		} catch (error) {}
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		let r;
		try {
			r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
		} catch (error) {}
		if (!r && typeof process !== "undefined" && "env" in process) r = process.env.DEBUG;
		return r;
	}
	/**
	* Localstorage attempts to return the localstorage.
	*
	* This is necessary because safari throws
	* when a user disables cookies/localstorage
	* and you attempt to access it.
	*
	* @return {LocalStorage}
	* @api private
	*/
	function localstorage() {
		try {
			return localStorage;
		} catch (error) {}
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	*/
	formatters.j = function(v) {
		try {
			return JSON.stringify(v);
		} catch (error) {
			return "[UnexpectedJSONParseError]: " + error.message;
		}
	};
}));
//#endregion
//#region node_modules/socket.io-parser/node_modules/debug/src/node.js
var require_node = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Module dependencies.
	*/
	var tty = __require("tty");
	var util = __require("util");
	/**
	* This is the Node.js implementation of `debug()`.
	*/
	exports.init = init;
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.destroy = util.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
	/**
	* Colors.
	*/
	exports.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		const supportsColor = require_supports_color();
		if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	} catch (error) {}
	/**
	* Build up the default `inspectOpts` object from the environment variables.
	*
	*   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
	*/
	exports.inspectOpts = Object.keys(process.env).filter((key) => {
		return /^debug_/i.test(key);
	}).reduce((obj, key) => {
		const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});
		let val = process.env[key];
		if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
		else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
		else if (val === "null") val = null;
		else val = Number(val);
		obj[prop] = val;
		return obj;
	}, {});
	/**
	* Is stdout a TTY? Colored output is enabled when `true`.
	*/
	function useColors() {
		return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
	}
	/**
	* Adds ANSI color escape codes if enabled.
	*
	* @api public
	*/
	function formatArgs(args) {
		const { namespace: name, useColors } = this;
		if (useColors) {
			const c = this.color;
			const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
			const prefix = `  ${colorCode};1m${name} \u001B[0m`;
			args[0] = prefix + args[0].split("\n").join("\n" + prefix);
			args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
		} else args[0] = getDate() + name + " " + args[0];
	}
	function getDate() {
		if (exports.inspectOpts.hideDate) return "";
		return (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	/**
	* Invokes `util.formatWithOptions()` with the specified arguments and writes to stderr.
	*/
	function log(...args) {
		return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + "\n");
	}
	/**
	* Save `namespaces`.
	*
	* @param {String} namespaces
	* @api private
	*/
	function save(namespaces) {
		if (namespaces) process.env.DEBUG = namespaces;
		else delete process.env.DEBUG;
	}
	/**
	* Load `namespaces`.
	*
	* @return {String} returns the previously persisted debug modes
	* @api private
	*/
	function load() {
		return process.env.DEBUG;
	}
	/**
	* Init logic for `debug` instances.
	*
	* Create a new `inspectOpts` object in case `useColors` is set
	* differently for a particular `debug` instance.
	*/
	function init(debug) {
		debug.inspectOpts = {};
		const keys = Object.keys(exports.inspectOpts);
		for (let i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
	module.exports = require_common()(exports);
	var { formatters } = module.exports;
	/**
	* Map %o to `util.inspect()`, all on a single line.
	*/
	formatters.o = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
	};
	/**
	* Map %O to `util.inspect()`, allowing multiple lines if needed.
	*/
	formatters.O = function(v) {
		this.inspectOpts.colors = this.useColors;
		return util.inspect(v, this.inspectOpts);
	};
}));
//#endregion
//#region node_modules/socket.io-parser/node_modules/debug/src/index.js
var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Detect Electron renderer / nwjs process, which is node, but we should
	* treat as a browser.
	*/
	if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) module.exports = require_browser();
	else module.exports = require_node();
}));
//#endregion
//#region node_modules/socket.io-parser/build/esm-debug/index.js
var esm_debug_exports = /* @__PURE__ */ __exportAll({
	Decoder: () => Decoder,
	Encoder: () => Encoder,
	PacketType: () => PacketType,
	isPacketValid: () => isPacketValid,
	protocol: () => 5
});
function isNamespaceValid(nsp) {
	return typeof nsp === "string";
}
function isAckIdValid(id) {
	return id === void 0 || isInteger(id);
}
function isObject(value) {
	return Object.prototype.toString.call(value) === "[object Object]";
}
function isDataValid(type, payload) {
	switch (type) {
		case PacketType.CONNECT: return payload === void 0 || isObject(payload);
		case PacketType.DISCONNECT: return payload === void 0;
		case PacketType.EVENT: return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS$1.indexOf(payload[0]) === -1);
		case PacketType.ACK: return Array.isArray(payload);
		case PacketType.CONNECT_ERROR: return typeof payload === "string" || isObject(payload);
		default: return false;
	}
}
function isPacketValid(packet) {
	return isNamespaceValid(packet.nsp) && isAckIdValid(packet.id) && isDataValid(packet.type, packet.data);
}
var import_src$3, debug$3, RESERVED_EVENTS$1, PacketType, Encoder, Decoder, BinaryReconstructor, isInteger;
var init_esm_debug$1 = __esmMin((() => {
	init_esm();
	init_binary();
	init_is_binary();
	import_src$3 = /* @__PURE__ */ __toESM(require_src());
	debug$3 = (0, import_src$3.default)("socket.io-parser");
	RESERVED_EVENTS$1 = [
		"connect",
		"connect_error",
		"disconnect",
		"disconnecting",
		"newListener",
		"removeListener"
	];
	(function(PacketType) {
		PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
		PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
		PacketType[PacketType["EVENT"] = 2] = "EVENT";
		PacketType[PacketType["ACK"] = 3] = "ACK";
		PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
		PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
		PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
	})(PacketType || (PacketType = {}));
	Encoder = class {
		/**
		* Encoder constructor
		*
		* @param {function} replacer - custom replacer to pass down to JSON.parse
		*/
		constructor(replacer) {
			this.replacer = replacer;
		}
		/**
		* Encode a packet as a single string if non-binary, or as a
		* buffer sequence, depending on packet type.
		*
		* @param {Object} obj - packet object
		*/
		encode(obj) {
			debug$3("encoding packet %j", obj);
			if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
				if (hasBinary(obj)) return this.encodeAsBinary({
					type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
					nsp: obj.nsp,
					data: obj.data,
					id: obj.id
				});
			}
			return [this.encodeAsString(obj)];
		}
		/**
		* Encode packet as string.
		*/
		encodeAsString(obj) {
			let str = "" + obj.type;
			if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) str += obj.attachments + "-";
			if (obj.nsp && "/" !== obj.nsp) str += obj.nsp + ",";
			if (null != obj.id) str += obj.id;
			if (null != obj.data) str += JSON.stringify(obj.data, this.replacer);
			debug$3("encoded %j as %s", obj, str);
			return str;
		}
		/**
		* Encode packet as 'buffer sequence' by removing blobs, and
		* deconstructing packet into object with placeholders and
		* a list of buffers.
		*/
		encodeAsBinary(obj) {
			const deconstruction = deconstructPacket(obj);
			const pack = this.encodeAsString(deconstruction.packet);
			const buffers = deconstruction.buffers;
			buffers.unshift(pack);
			return buffers;
		}
	};
	Decoder = class Decoder extends Emitter {
		/**
		* Decoder constructor
		*/
		constructor(opts) {
			super();
			this.opts = Object.assign({
				reviver: void 0,
				maxAttachments: 10
			}, typeof opts === "function" ? { reviver: opts } : opts);
		}
		/**
		* Decodes an encoded packet string into packet JSON.
		*
		* @param {String} obj - encoded packet
		*/
		add(obj) {
			let packet;
			if (typeof obj === "string") {
				if (this.reconstructor) throw new Error("got plaintext data when reconstructing a packet");
				packet = this.decodeString(obj);
				const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
				if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
					packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
					this.reconstructor = new BinaryReconstructor(packet);
					if (packet.attachments === 0) super.emitReserved("decoded", packet);
				} else super.emitReserved("decoded", packet);
			} else if (isBinary(obj) || obj.base64) if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
			else {
				packet = this.reconstructor.takeBinaryData(obj);
				if (packet) {
					this.reconstructor = null;
					super.emitReserved("decoded", packet);
				}
			}
			else throw new Error("Unknown type: " + obj);
		}
		/**
		* Decode a packet String (JSON data)
		*
		* @param {String} str
		* @return {Object} packet
		*/
		decodeString(str) {
			let i = 0;
			const p = { type: Number(str.charAt(0)) };
			if (PacketType[p.type] === void 0) throw new Error("unknown packet type " + p.type);
			if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
				const start = i + 1;
				while (str.charAt(++i) !== "-" && i != str.length);
				const buf = str.substring(start, i);
				if (buf != Number(buf) || str.charAt(i) !== "-") throw new Error("Illegal attachments");
				const n = Number(buf);
				if (!isInteger(n) || n < 0) throw new Error("Illegal attachments");
				else if (n > this.opts.maxAttachments) throw new Error("too many attachments");
				p.attachments = n;
			}
			if ("/" === str.charAt(i + 1)) {
				const start = i + 1;
				while (++i) {
					if ("," === str.charAt(i)) break;
					if (i === str.length) break;
				}
				p.nsp = str.substring(start, i);
			} else p.nsp = "/";
			const next = str.charAt(i + 1);
			if ("" !== next && Number(next) == next) {
				const start = i + 1;
				while (++i) {
					const c = str.charAt(i);
					if (null == c || Number(c) != c) {
						--i;
						break;
					}
					if (i === str.length) break;
				}
				p.id = Number(str.substring(start, i + 1));
			}
			if (str.charAt(++i)) {
				const payload = this.tryParse(str.substr(i));
				if (Decoder.isPayloadValid(p.type, payload)) p.data = payload;
				else throw new Error("invalid payload");
			}
			debug$3("decoded %s as %j", str, p);
			return p;
		}
		tryParse(str) {
			try {
				return JSON.parse(str, this.opts.reviver);
			} catch (e) {
				return false;
			}
		}
		static isPayloadValid(type, payload) {
			switch (type) {
				case PacketType.CONNECT: return isObject(payload);
				case PacketType.DISCONNECT: return payload === void 0;
				case PacketType.CONNECT_ERROR: return typeof payload === "string" || isObject(payload);
				case PacketType.EVENT:
				case PacketType.BINARY_EVENT: return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS$1.indexOf(payload[0]) === -1);
				case PacketType.ACK:
				case PacketType.BINARY_ACK: return Array.isArray(payload);
			}
		}
		/**
		* Deallocates a parser's resources
		*/
		destroy() {
			if (this.reconstructor) {
				this.reconstructor.finishedReconstruction();
				this.reconstructor = null;
			}
		}
	};
	BinaryReconstructor = class {
		constructor(packet) {
			this.packet = packet;
			this.buffers = [];
			this.reconPack = packet;
		}
		/**
		* Method to be called when binary data received from connection
		* after a BINARY_EVENT packet.
		*
		* @param {Buffer | ArrayBuffer} binData - the raw binary data received
		* @return {null | Object} returns null if more binary data is expected or
		*   a reconstructed packet object if all buffers have been received.
		*/
		takeBinaryData(binData) {
			this.buffers.push(binData);
			if (this.buffers.length === this.reconPack.attachments) {
				const packet = reconstructPacket(this.reconPack, this.buffers);
				this.finishedReconstruction();
				return packet;
			}
			return null;
		}
		/**
		* Cleans up binary packet reconstruction variables.
		*/
		finishedReconstruction() {
			this.reconPack = null;
			this.buffers = [];
		}
	};
	isInteger = Number.isInteger || function(value) {
		return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
	};
}));
//#endregion
//#region node_modules/socket.io-client/build/esm-debug/on.js
function on(obj, ev, fn) {
	obj.on(ev, fn);
	return function subDestroy() {
		obj.off(ev, fn);
	};
}
var init_on = __esmMin((() => {}));
//#endregion
//#region node_modules/socket.io-client/build/esm-debug/socket.js
var import_src$2, debug$2, RESERVED_EVENTS, Socket;
var init_socket = __esmMin((() => {
	init_esm_debug$1();
	init_on();
	init_esm();
	import_src$2 = /* @__PURE__ */ __toESM(require_src$1());
	debug$2 = (0, import_src$2.default)("socket.io-client:socket");
	RESERVED_EVENTS = Object.freeze({
		connect: 1,
		connect_error: 1,
		disconnect: 1,
		disconnecting: 1,
		newListener: 1,
		removeListener: 1
	});
	Socket = class extends Emitter {
		/**
		* `Socket` constructor.
		*/
		constructor(io, nsp, opts) {
			super();
			/**
			* Whether the socket is currently connected to the server.
			*
			* @example
			* const socket = io();
			*
			* socket.on("connect", () => {
			*   console.log(socket.connected); // true
			* });
			*
			* socket.on("disconnect", () => {
			*   console.log(socket.connected); // false
			* });
			*/
			this.connected = false;
			/**
			* Whether the connection state was recovered after a temporary disconnection. In that case, any missed packets will
			* be transmitted by the server.
			*/
			this.recovered = false;
			/**
			* Buffer for packets received before the CONNECT packet
			*/
			this.receiveBuffer = [];
			/**
			* Buffer for packets that will be sent once the socket is connected
			*/
			this.sendBuffer = [];
			/**
			* The queue of packets to be sent with retry in case of failure.
			*
			* Packets are sent one by one, each waiting for the server acknowledgement, in order to guarantee the delivery order.
			* @private
			*/
			this._queue = [];
			/**
			* A sequence to generate the ID of the {@link QueuedPacket}.
			* @private
			*/
			this._queueSeq = 0;
			this.ids = 0;
			/**
			* A map containing acknowledgement handlers.
			*
			* The `withError` attribute is used to differentiate handlers that accept an error as first argument:
			*
			* - `socket.emit("test", (err, value) => { ... })` with `ackTimeout` option
			* - `socket.timeout(5000).emit("test", (err, value) => { ... })`
			* - `const value = await socket.emitWithAck("test")`
			*
			* From those that don't:
			*
			* - `socket.emit("test", (value) => { ... });`
			*
			* In the first case, the handlers will be called with an error when:
			*
			* - the timeout is reached
			* - the socket gets disconnected
			*
			* In the second case, the handlers will be simply discarded upon disconnection, since the client will never receive
			* an acknowledgement from the server.
			*
			* @private
			*/
			this.acks = {};
			this.flags = {};
			this.io = io;
			this.nsp = nsp;
			if (opts && opts.auth) this.auth = opts.auth;
			this._opts = Object.assign({}, opts);
			if (this.io._autoConnect) this.open();
		}
		/**
		* Whether the socket is currently disconnected
		*
		* @example
		* const socket = io();
		*
		* socket.on("connect", () => {
		*   console.log(socket.disconnected); // false
		* });
		*
		* socket.on("disconnect", () => {
		*   console.log(socket.disconnected); // true
		* });
		*/
		get disconnected() {
			return !this.connected;
		}
		/**
		* Subscribe to open, close and packet events
		*
		* @private
		*/
		subEvents() {
			if (this.subs) return;
			const io = this.io;
			this.subs = [
				on(io, "open", this.onopen.bind(this)),
				on(io, "packet", this.onpacket.bind(this)),
				on(io, "error", this.onerror.bind(this)),
				on(io, "close", this.onclose.bind(this))
			];
		}
		/**
		* Whether the Socket will try to reconnect when its Manager connects or reconnects.
		*
		* @example
		* const socket = io();
		*
		* console.log(socket.active); // true
		*
		* socket.on("disconnect", (reason) => {
		*   if (reason === "io server disconnect") {
		*     // the disconnection was initiated by the server, you need to manually reconnect
		*     console.log(socket.active); // false
		*   }
		*   // else the socket will automatically try to reconnect
		*   console.log(socket.active); // true
		* });
		*/
		get active() {
			return !!this.subs;
		}
		/**
		* "Opens" the socket.
		*
		* @example
		* const socket = io({
		*   autoConnect: false
		* });
		*
		* socket.connect();
		*/
		connect() {
			if (this.connected) return this;
			this.subEvents();
			if (!this.io["_reconnecting"]) this.io.open();
			if ("open" === this.io._readyState) this.onopen();
			return this;
		}
		/**
		* Alias for {@link connect()}.
		*/
		open() {
			return this.connect();
		}
		/**
		* Sends a `message` event.
		*
		* This method mimics the WebSocket.send() method.
		*
		* @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
		*
		* @example
		* socket.send("hello");
		*
		* // this is equivalent to
		* socket.emit("message", "hello");
		*
		* @return self
		*/
		send(...args) {
			args.unshift("message");
			this.emit.apply(this, args);
			return this;
		}
		/**
		* Override `emit`.
		* If the event is in `events`, it's emitted normally.
		*
		* @example
		* socket.emit("hello", "world");
		*
		* // all serializable datastructures are supported (no need to call JSON.stringify)
		* socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
		*
		* // with an acknowledgement from the server
		* socket.emit("hello", "world", (val) => {
		*   // ...
		* });
		*
		* @return self
		*/
		emit(ev, ...args) {
			var _a, _b, _c;
			if (RESERVED_EVENTS.hasOwnProperty(ev)) throw new Error("\"" + ev.toString() + "\" is a reserved event name");
			args.unshift(ev);
			if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
				this._addToQueue(args);
				return this;
			}
			const packet = {
				type: PacketType.EVENT,
				data: args
			};
			packet.options = {};
			packet.options.compress = this.flags.compress !== false;
			if ("function" === typeof args[args.length - 1]) {
				const id = this.ids++;
				debug$2("emitting packet with ack id %d", id);
				const ack = args.pop();
				this._registerAckCallback(id, ack);
				packet.id = id;
			}
			const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
			const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
			if (this.flags.volatile && !isTransportWritable) debug$2("discard packet as the transport is not currently writable");
			else if (isConnected) {
				this.notifyOutgoingListeners(packet);
				this.packet(packet);
			} else this.sendBuffer.push(packet);
			this.flags = {};
			return this;
		}
		/**
		* @private
		*/
		_registerAckCallback(id, ack) {
			var _a;
			const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
			if (timeout === void 0) {
				this.acks[id] = ack;
				return;
			}
			const timer = this.io.setTimeoutFn(() => {
				delete this.acks[id];
				for (let i = 0; i < this.sendBuffer.length; i++) if (this.sendBuffer[i].id === id) {
					debug$2("removing packet with ack id %d from the buffer", id);
					this.sendBuffer.splice(i, 1);
				}
				debug$2("event with ack id %d has timed out after %d ms", id, timeout);
				ack.call(this, /* @__PURE__ */ new Error("operation has timed out"));
			}, timeout);
			const fn = (...args) => {
				this.io.clearTimeoutFn(timer);
				ack.apply(this, args);
			};
			fn.withError = true;
			this.acks[id] = fn;
		}
		/**
		* Emits an event and waits for an acknowledgement
		*
		* @example
		* // without timeout
		* const response = await socket.emitWithAck("hello", "world");
		*
		* // with a specific timeout
		* try {
		*   const response = await socket.timeout(1000).emitWithAck("hello", "world");
		* } catch (err) {
		*   // the server did not acknowledge the event in the given delay
		* }
		*
		* @return a Promise that will be fulfilled when the server acknowledges the event
		*/
		emitWithAck(ev, ...args) {
			return new Promise((resolve, reject) => {
				const fn = (arg1, arg2) => {
					return arg1 ? reject(arg1) : resolve(arg2);
				};
				fn.withError = true;
				args.push(fn);
				this.emit(ev, ...args);
			});
		}
		/**
		* Add the packet to the queue.
		* @param args
		* @private
		*/
		_addToQueue(args) {
			let ack;
			if (typeof args[args.length - 1] === "function") ack = args.pop();
			const packet = {
				id: this._queueSeq++,
				tryCount: 0,
				pending: false,
				args,
				flags: Object.assign({ fromQueue: true }, this.flags)
			};
			args.push((err, ...responseArgs) => {
				if (packet !== this._queue[0]) return debug$2("packet [%d] already acknowledged", packet.id);
				if (err !== null) {
					if (packet.tryCount > this._opts.retries) {
						debug$2("packet [%d] is discarded after %d tries", packet.id, packet.tryCount);
						this._queue.shift();
						if (ack) ack(err);
					}
				} else {
					debug$2("packet [%d] was successfully sent", packet.id);
					this._queue.shift();
					if (ack) ack(null, ...responseArgs);
				}
				packet.pending = false;
				return this._drainQueue();
			});
			this._queue.push(packet);
			this._drainQueue();
		}
		/**
		* Send the first packet of the queue, and wait for an acknowledgement from the server.
		* @param force - whether to resend a packet that has not been acknowledged yet
		*
		* @private
		*/
		_drainQueue(force = false) {
			debug$2("draining queue");
			if (!this.connected || this._queue.length === 0) return;
			const packet = this._queue[0];
			if (packet.pending && !force) {
				debug$2("packet [%d] has already been sent and is waiting for an ack", packet.id);
				return;
			}
			packet.pending = true;
			packet.tryCount++;
			debug$2("sending packet [%d] (try n°%d)", packet.id, packet.tryCount);
			this.flags = packet.flags;
			this.emit.apply(this, packet.args);
		}
		/**
		* Sends a packet.
		*
		* @param packet
		* @private
		*/
		packet(packet) {
			packet.nsp = this.nsp;
			this.io._packet(packet);
		}
		/**
		* Called upon engine `open`.
		*
		* @private
		*/
		onopen() {
			debug$2("transport is open - connecting");
			if (typeof this.auth == "function") this.auth((data) => {
				this._sendConnectPacket(data);
			});
			else this._sendConnectPacket(this.auth);
		}
		/**
		* Sends a CONNECT packet to initiate the Socket.IO session.
		*
		* @param data
		* @private
		*/
		_sendConnectPacket(data) {
			this.packet({
				type: PacketType.CONNECT,
				data: this._pid ? Object.assign({
					pid: this._pid,
					offset: this._lastOffset
				}, data) : data
			});
		}
		/**
		* Called upon engine or manager `error`.
		*
		* @param err
		* @private
		*/
		onerror(err) {
			if (!this.connected) this.emitReserved("connect_error", err);
		}
		/**
		* Called upon engine `close`.
		*
		* @param reason
		* @param description
		* @private
		*/
		onclose(reason, description) {
			debug$2("close (%s)", reason);
			this.connected = false;
			delete this.id;
			this.emitReserved("disconnect", reason, description);
			this._clearAcks();
		}
		/**
		* Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
		* the server.
		*
		* @private
		*/
		_clearAcks() {
			Object.keys(this.acks).forEach((id) => {
				if (!this.sendBuffer.some((packet) => String(packet.id) === id)) {
					const ack = this.acks[id];
					delete this.acks[id];
					if (ack.withError) ack.call(this, /* @__PURE__ */ new Error("socket has been disconnected"));
				}
			});
		}
		/**
		* Called with socket packet.
		*
		* @param packet
		* @private
		*/
		onpacket(packet) {
			if (!(packet.nsp === this.nsp)) return;
			switch (packet.type) {
				case PacketType.CONNECT:
					if (packet.data && packet.data.sid) this.onconnect(packet.data.sid, packet.data.pid);
					else this.emitReserved("connect_error", /* @__PURE__ */ new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
					break;
				case PacketType.EVENT:
				case PacketType.BINARY_EVENT:
					this.onevent(packet);
					break;
				case PacketType.ACK:
				case PacketType.BINARY_ACK:
					this.onack(packet);
					break;
				case PacketType.DISCONNECT:
					this.ondisconnect();
					break;
				case PacketType.CONNECT_ERROR:
					this.destroy();
					const err = new Error(packet.data.message);
					err.data = packet.data.data;
					this.emitReserved("connect_error", err);
					break;
			}
		}
		/**
		* Called upon a server event.
		*
		* @param packet
		* @private
		*/
		onevent(packet) {
			const args = packet.data || [];
			debug$2("emitting event %j", args);
			if (null != packet.id) {
				debug$2("attaching ack callback to event");
				args.push(this.ack(packet.id));
			}
			if (this.connected) this.emitEvent(args);
			else this.receiveBuffer.push(Object.freeze(args));
		}
		emitEvent(args) {
			if (this._anyListeners && this._anyListeners.length) {
				const listeners = this._anyListeners.slice();
				for (const listener of listeners) listener.apply(this, args);
			}
			super.emit.apply(this, args);
			if (this._pid && args.length && typeof args[args.length - 1] === "string") this._lastOffset = args[args.length - 1];
		}
		/**
		* Produces an ack callback to emit with an event.
		*
		* @private
		*/
		ack(id) {
			const self = this;
			let sent = false;
			return function(...args) {
				if (sent) return;
				sent = true;
				debug$2("sending ack %j", args);
				self.packet({
					type: PacketType.ACK,
					id,
					data: args
				});
			};
		}
		/**
		* Called upon a server acknowledgement.
		*
		* @param packet
		* @private
		*/
		onack(packet) {
			const ack = this.acks[packet.id];
			if (typeof ack !== "function") {
				debug$2("bad ack %s", packet.id);
				return;
			}
			delete this.acks[packet.id];
			debug$2("calling ack %s with %j", packet.id, packet.data);
			if (ack.withError) packet.data.unshift(null);
			ack.apply(this, packet.data);
		}
		/**
		* Called upon server connect.
		*
		* @private
		*/
		onconnect(id, pid) {
			debug$2("socket connected with id %s", id);
			this.id = id;
			this.recovered = pid && this._pid === pid;
			this._pid = pid;
			this.connected = true;
			this.emitBuffered();
			this._drainQueue(true);
			this.emitReserved("connect");
		}
		/**
		* Emit buffered events (received and emitted).
		*
		* @private
		*/
		emitBuffered() {
			this.receiveBuffer.forEach((args) => this.emitEvent(args));
			this.receiveBuffer = [];
			this.sendBuffer.forEach((packet) => {
				this.notifyOutgoingListeners(packet);
				this.packet(packet);
			});
			this.sendBuffer = [];
		}
		/**
		* Called upon server disconnect.
		*
		* @private
		*/
		ondisconnect() {
			debug$2("server disconnect (%s)", this.nsp);
			this.destroy();
			this.onclose("io server disconnect");
		}
		/**
		* Called upon forced client/server side disconnections,
		* this method ensures the manager stops tracking us and
		* that reconnections don't get triggered for this.
		*
		* @private
		*/
		destroy() {
			if (this.subs) {
				this.subs.forEach((subDestroy) => subDestroy());
				this.subs = void 0;
			}
			this.io["_destroy"](this);
		}
		/**
		* Disconnects the socket manually. In that case, the socket will not try to reconnect.
		*
		* If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
		*
		* @example
		* const socket = io();
		*
		* socket.on("disconnect", (reason) => {
		*   // console.log(reason); prints "io client disconnect"
		* });
		*
		* socket.disconnect();
		*
		* @return self
		*/
		disconnect() {
			if (this.connected) {
				debug$2("performing disconnect (%s)", this.nsp);
				this.packet({ type: PacketType.DISCONNECT });
			}
			this.destroy();
			if (this.connected) this.onclose("io client disconnect");
			return this;
		}
		/**
		* Alias for {@link disconnect()}.
		*
		* @return self
		*/
		close() {
			return this.disconnect();
		}
		/**
		* Sets the compress flag.
		*
		* @example
		* socket.compress(false).emit("hello");
		*
		* @param compress - if `true`, compresses the sending data
		* @return self
		*/
		compress(compress) {
			this.flags.compress = compress;
			return this;
		}
		/**
		* Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
		* ready to send messages.
		*
		* @example
		* socket.volatile.emit("hello"); // the server may or may not receive it
		*
		* @returns self
		*/
		get volatile() {
			this.flags.volatile = true;
			return this;
		}
		/**
		* Sets a modifier for a subsequent event emission that the callback will be called with an error when the
		* given number of milliseconds have elapsed without an acknowledgement from the server:
		*
		* @example
		* socket.timeout(5000).emit("my-event", (err) => {
		*   if (err) {
		*     // the server did not acknowledge the event in the given delay
		*   }
		* });
		*
		* @returns self
		*/
		timeout(timeout) {
			this.flags.timeout = timeout;
			return this;
		}
		/**
		* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
		* callback.
		*
		* @example
		* socket.onAny((event, ...args) => {
		*   console.log(`got ${event}`);
		* });
		*
		* @param listener
		*/
		onAny(listener) {
			this._anyListeners = this._anyListeners || [];
			this._anyListeners.push(listener);
			return this;
		}
		/**
		* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
		* callback. The listener is added to the beginning of the listeners array.
		*
		* @example
		* socket.prependAny((event, ...args) => {
		*   console.log(`got event ${event}`);
		* });
		*
		* @param listener
		*/
		prependAny(listener) {
			this._anyListeners = this._anyListeners || [];
			this._anyListeners.unshift(listener);
			return this;
		}
		/**
		* Removes the listener that will be fired when any event is emitted.
		*
		* @example
		* const catchAllListener = (event, ...args) => {
		*   console.log(`got event ${event}`);
		* }
		*
		* socket.onAny(catchAllListener);
		*
		* // remove a specific listener
		* socket.offAny(catchAllListener);
		*
		* // or remove all listeners
		* socket.offAny();
		*
		* @param listener
		*/
		offAny(listener) {
			if (!this._anyListeners) return this;
			if (listener) {
				const listeners = this._anyListeners;
				for (let i = 0; i < listeners.length; i++) if (listener === listeners[i]) {
					listeners.splice(i, 1);
					return this;
				}
			} else this._anyListeners = [];
			return this;
		}
		/**
		* Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
		* e.g. to remove listeners.
		*/
		listenersAny() {
			return this._anyListeners || [];
		}
		/**
		* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
		* callback.
		*
		* Note: acknowledgements sent to the server are not included.
		*
		* @example
		* socket.onAnyOutgoing((event, ...args) => {
		*   console.log(`sent event ${event}`);
		* });
		*
		* @param listener
		*/
		onAnyOutgoing(listener) {
			this._anyOutgoingListeners = this._anyOutgoingListeners || [];
			this._anyOutgoingListeners.push(listener);
			return this;
		}
		/**
		* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
		* callback. The listener is added to the beginning of the listeners array.
		*
		* Note: acknowledgements sent to the server are not included.
		*
		* @example
		* socket.prependAnyOutgoing((event, ...args) => {
		*   console.log(`sent event ${event}`);
		* });
		*
		* @param listener
		*/
		prependAnyOutgoing(listener) {
			this._anyOutgoingListeners = this._anyOutgoingListeners || [];
			this._anyOutgoingListeners.unshift(listener);
			return this;
		}
		/**
		* Removes the listener that will be fired when any event is emitted.
		*
		* @example
		* const catchAllListener = (event, ...args) => {
		*   console.log(`sent event ${event}`);
		* }
		*
		* socket.onAnyOutgoing(catchAllListener);
		*
		* // remove a specific listener
		* socket.offAnyOutgoing(catchAllListener);
		*
		* // or remove all listeners
		* socket.offAnyOutgoing();
		*
		* @param [listener] - the catch-all listener (optional)
		*/
		offAnyOutgoing(listener) {
			if (!this._anyOutgoingListeners) return this;
			if (listener) {
				const listeners = this._anyOutgoingListeners;
				for (let i = 0; i < listeners.length; i++) if (listener === listeners[i]) {
					listeners.splice(i, 1);
					return this;
				}
			} else this._anyOutgoingListeners = [];
			return this;
		}
		/**
		* Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
		* e.g. to remove listeners.
		*/
		listenersAnyOutgoing() {
			return this._anyOutgoingListeners || [];
		}
		/**
		* Notify the listeners for each packet sent
		*
		* @param packet
		*
		* @private
		*/
		notifyOutgoingListeners(packet) {
			if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
				const listeners = this._anyOutgoingListeners.slice();
				for (const listener of listeners) listener.apply(this, packet.data);
			}
		}
	};
}));
//#endregion
//#region node_modules/socket.io-client/build/esm-debug/contrib/backo2.js
/**
* Initialize backoff timer with `opts`.
*
* - `min` initial timeout in milliseconds [100]
* - `max` max timeout [10000]
* - `jitter` [0]
* - `factor` [2]
*
* @param {Object} opts
* @api public
*/
function Backoff(opts) {
	opts = opts || {};
	this.ms = opts.min || 100;
	this.max = opts.max || 1e4;
	this.factor = opts.factor || 2;
	this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
	this.attempts = 0;
}
var init_backo2 = __esmMin((() => {
	/**
	* Return the backoff duration.
	*
	* @return {Number}
	* @api public
	*/
	Backoff.prototype.duration = function() {
		var ms = this.ms * Math.pow(this.factor, this.attempts++);
		if (this.jitter) {
			var rand = Math.random();
			var deviation = Math.floor(rand * this.jitter * ms);
			ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
		}
		return Math.min(ms, this.max) | 0;
	};
	/**
	* Reset the number of attempts.
	*
	* @api public
	*/
	Backoff.prototype.reset = function() {
		this.attempts = 0;
	};
	/**
	* Set the minimum duration
	*
	* @api public
	*/
	Backoff.prototype.setMin = function(min) {
		this.ms = min;
	};
	/**
	* Set the maximum duration
	*
	* @api public
	*/
	Backoff.prototype.setMax = function(max) {
		this.max = max;
	};
	/**
	* Set the jitter
	*
	* @api public
	*/
	Backoff.prototype.setJitter = function(jitter) {
		this.jitter = jitter;
	};
}));
//#endregion
//#region node_modules/socket.io-client/build/esm-debug/manager.js
var import_src$1, debug$1, Manager;
var init_manager = __esmMin((() => {
	init_esm_debug$2();
	init_socket();
	init_esm_debug$1();
	init_on();
	init_backo2();
	init_esm();
	import_src$1 = /* @__PURE__ */ __toESM(require_src$1());
	debug$1 = (0, import_src$1.default)("socket.io-client:manager");
	Manager = class extends Emitter {
		constructor(uri, opts) {
			var _a;
			super();
			this.nsps = {};
			this.subs = [];
			if (uri && "object" === typeof uri) {
				opts = uri;
				uri = void 0;
			}
			opts = opts || {};
			opts.path = opts.path || "/socket.io";
			this.opts = opts;
			installTimerFunctions(this, opts);
			this.reconnection(opts.reconnection !== false);
			this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
			this.reconnectionDelay(opts.reconnectionDelay || 1e3);
			this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
			this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : .5);
			this.backoff = new Backoff({
				min: this.reconnectionDelay(),
				max: this.reconnectionDelayMax(),
				jitter: this.randomizationFactor()
			});
			this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
			this._readyState = "closed";
			this.uri = uri;
			const _parser = opts.parser || esm_debug_exports;
			this.encoder = new _parser.Encoder();
			this.decoder = new _parser.Decoder();
			this._autoConnect = opts.autoConnect !== false;
			if (this._autoConnect) this.open();
		}
		reconnection(v) {
			if (!arguments.length) return this._reconnection;
			this._reconnection = !!v;
			if (!v) this.skipReconnect = true;
			return this;
		}
		reconnectionAttempts(v) {
			if (v === void 0) return this._reconnectionAttempts;
			this._reconnectionAttempts = v;
			return this;
		}
		reconnectionDelay(v) {
			var _a;
			if (v === void 0) return this._reconnectionDelay;
			this._reconnectionDelay = v;
			(_a = this.backoff) === null || _a === void 0 || _a.setMin(v);
			return this;
		}
		randomizationFactor(v) {
			var _a;
			if (v === void 0) return this._randomizationFactor;
			this._randomizationFactor = v;
			(_a = this.backoff) === null || _a === void 0 || _a.setJitter(v);
			return this;
		}
		reconnectionDelayMax(v) {
			var _a;
			if (v === void 0) return this._reconnectionDelayMax;
			this._reconnectionDelayMax = v;
			(_a = this.backoff) === null || _a === void 0 || _a.setMax(v);
			return this;
		}
		timeout(v) {
			if (!arguments.length) return this._timeout;
			this._timeout = v;
			return this;
		}
		/**
		* Starts trying to reconnect if reconnection is enabled and we have not
		* started reconnecting yet
		*
		* @private
		*/
		maybeReconnectOnOpen() {
			if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) this.reconnect();
		}
		/**
		* Sets the current transport `socket`.
		*
		* @param {Function} fn - optional, callback
		* @return self
		* @public
		*/
		open(fn) {
			debug$1("readyState %s", this._readyState);
			if (~this._readyState.indexOf("open")) return this;
			debug$1("opening %s", this.uri);
			this.engine = new Socket$1(this.uri, this.opts);
			const socket = this.engine;
			const self = this;
			this._readyState = "opening";
			this.skipReconnect = false;
			const openSubDestroy = on(socket, "open", function() {
				self.onopen();
				fn && fn();
			});
			const onError = (err) => {
				debug$1("error");
				this.cleanup();
				this._readyState = "closed";
				this.emitReserved("error", err);
				if (fn) fn(err);
				else this.maybeReconnectOnOpen();
			};
			const errorSub = on(socket, "error", onError);
			if (false !== this._timeout) {
				const timeout = this._timeout;
				debug$1("connect attempt will timeout after %d", timeout);
				const timer = this.setTimeoutFn(() => {
					debug$1("connect attempt timed out after %d", timeout);
					openSubDestroy();
					onError(/* @__PURE__ */ new Error("timeout"));
					socket.close();
				}, timeout);
				if (this.opts.autoUnref) timer.unref();
				this.subs.push(() => {
					this.clearTimeoutFn(timer);
				});
			}
			this.subs.push(openSubDestroy);
			this.subs.push(errorSub);
			return this;
		}
		/**
		* Alias for open()
		*
		* @return self
		* @public
		*/
		connect(fn) {
			return this.open(fn);
		}
		/**
		* Called upon transport open.
		*
		* @private
		*/
		onopen() {
			debug$1("open");
			this.cleanup();
			this._readyState = "open";
			this.emitReserved("open");
			const socket = this.engine;
			this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
		}
		/**
		* Called upon a ping.
		*
		* @private
		*/
		onping() {
			this.emitReserved("ping");
		}
		/**
		* Called with data.
		*
		* @private
		*/
		ondata(data) {
			try {
				this.decoder.add(data);
			} catch (e) {
				this.onclose("parse error", e);
			}
		}
		/**
		* Called when parser fully decodes a packet.
		*
		* @private
		*/
		ondecoded(packet) {
			nextTick(() => {
				this.emitReserved("packet", packet);
			}, this.setTimeoutFn);
		}
		/**
		* Called upon socket error.
		*
		* @private
		*/
		onerror(err) {
			debug$1("error", err);
			this.emitReserved("error", err);
		}
		/**
		* Creates a new socket for the given `nsp`.
		*
		* @return {Socket}
		* @public
		*/
		socket(nsp, opts) {
			let socket = this.nsps[nsp];
			if (!socket) {
				socket = new Socket(this, nsp, opts);
				this.nsps[nsp] = socket;
			} else if (this._autoConnect && !socket.active) socket.connect();
			return socket;
		}
		/**
		* Called upon a socket close.
		*
		* @param socket
		* @private
		*/
		_destroy(socket) {
			const nsps = Object.keys(this.nsps);
			for (const nsp of nsps) if (this.nsps[nsp].active) {
				debug$1("socket %s is still active, skipping close", nsp);
				return;
			}
			this._close();
		}
		/**
		* Writes a packet.
		*
		* @param packet
		* @private
		*/
		_packet(packet) {
			debug$1("writing packet %j", packet);
			const encodedPackets = this.encoder.encode(packet);
			for (let i = 0; i < encodedPackets.length; i++) this.engine.write(encodedPackets[i], packet.options);
		}
		/**
		* Clean up transport subscriptions and packet buffer.
		*
		* @private
		*/
		cleanup() {
			debug$1("cleanup");
			this.subs.forEach((subDestroy) => subDestroy());
			this.subs.length = 0;
			this.decoder.destroy();
		}
		/**
		* Close the current socket.
		*
		* @private
		*/
		_close() {
			debug$1("disconnect");
			this.skipReconnect = true;
			this._reconnecting = false;
			this.onclose("forced close");
		}
		/**
		* Alias for close()
		*
		* @private
		*/
		disconnect() {
			return this._close();
		}
		/**
		* Called when:
		*
		* - the low-level engine is closed
		* - the parser encountered a badly formatted packet
		* - all sockets are disconnected
		*
		* @private
		*/
		onclose(reason, description) {
			var _a;
			debug$1("closed due to %s", reason);
			this.cleanup();
			(_a = this.engine) === null || _a === void 0 || _a.close();
			this.backoff.reset();
			this._readyState = "closed";
			this.emitReserved("close", reason, description);
			if (this._reconnection && !this.skipReconnect) this.reconnect();
		}
		/**
		* Attempt a reconnection.
		*
		* @private
		*/
		reconnect() {
			if (this._reconnecting || this.skipReconnect) return this;
			const self = this;
			if (this.backoff.attempts >= this._reconnectionAttempts) {
				debug$1("reconnect failed");
				this.backoff.reset();
				this.emitReserved("reconnect_failed");
				this._reconnecting = false;
			} else {
				const delay = this.backoff.duration();
				debug$1("will wait %dms before reconnect attempt", delay);
				this._reconnecting = true;
				const timer = this.setTimeoutFn(() => {
					if (self.skipReconnect) return;
					debug$1("attempting reconnect");
					this.emitReserved("reconnect_attempt", self.backoff.attempts);
					if (self.skipReconnect) return;
					self.open((err) => {
						if (err) {
							debug$1("reconnect attempt error");
							self._reconnecting = false;
							self.reconnect();
							this.emitReserved("reconnect_error", err);
						} else {
							debug$1("reconnect success");
							self.onreconnect();
						}
					});
				}, delay);
				if (this.opts.autoUnref) timer.unref();
				this.subs.push(() => {
					this.clearTimeoutFn(timer);
				});
			}
		}
		/**
		* Called upon successful reconnect.
		*
		* @private
		*/
		onreconnect() {
			const attempt = this.backoff.attempts;
			this._reconnecting = false;
			this.backoff.reset();
			this.emitReserved("reconnect", attempt);
		}
	};
}));
//#endregion
//#region node_modules/socket.io-client/build/esm-debug/index.js
function lookup(uri, opts) {
	if (typeof uri === "object") {
		opts = uri;
		uri = void 0;
	}
	opts = opts || {};
	const parsed = url(uri, opts.path || "/socket.io");
	const source = parsed.source;
	const id = parsed.id;
	const path = parsed.path;
	const sameNamespace = cache[id] && path in cache[id]["nsps"];
	const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
	let io;
	if (newConnection) {
		debug("ignoring socket cache for %s", source);
		io = new Manager(source, opts);
	} else {
		if (!cache[id]) {
			debug("new io instance for %s", source);
			cache[id] = new Manager(source, opts);
		}
		io = cache[id];
	}
	if (parsed.query && !opts.query) opts.query = parsed.queryKey;
	return io.socket(parsed.path, opts);
}
var import_src, debug, cache;
var init_esm_debug = __esmMin((() => {
	init_url();
	init_manager();
	init_socket();
	import_src = /* @__PURE__ */ __toESM(require_src$1());
	init_esm_debug$1();
	init_esm_debug$2();
	debug = (0, import_src.default)("socket.io-client");
	cache = {};
	Object.assign(lookup, {
		Manager,
		Socket,
		io: lookup,
		connect: lookup
	});
}));
//#endregion
//#region node_modules/canvas-dither/src/canvas-dither.js
var require_canvas_dither = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Use the ImageData from a Canvas and turn the image in a 1-bit black and white image using dithering
	*/
	var CanvasDither = class {
		/**
		* Change the image to grayscale
		*
		* @param  {object}   image         The imageData of a Canvas 2d context
		* @return {object}                 The resulting imageData
		*
		*/
		grayscale(image) {
			for (let i = 0; i < image.data.length; i += 4) {
				const luminance = image.data[i] * .299 + image.data[i + 1] * .587 + image.data[i + 2] * .114;
				image.data.fill(luminance, i, i + 3);
			}
			return image;
		}
		/**
		* Change the image to blank and white using a simple threshold
		*
		* @param  {object}   image         The imageData of a Canvas 2d context
		* @param  {number}   threshold     Threshold value (0-255)
		* @return {object}                 The resulting imageData
		*
		*/
		threshold(image, threshold) {
			for (let i = 0; i < image.data.length; i += 4) {
				const value = image.data[i] * .299 + image.data[i + 1] * .587 + image.data[i + 2] * .114 < threshold ? 0 : 255;
				image.data.fill(value, i, i + 3);
			}
			return image;
		}
		/**
		* Change the image to blank and white using the Bayer algorithm
		*
		* @param  {object}   image         The imageData of a Canvas 2d context
		* @param  {number}   threshold     Threshold value (0-255)
		* @return {object}                 The resulting imageData
		*
		*/
		bayer(image, threshold) {
			const thresholdMap = [
				[
					15,
					135,
					45,
					165
				],
				[
					195,
					75,
					225,
					105
				],
				[
					60,
					180,
					30,
					150
				],
				[
					240,
					120,
					210,
					90
				]
			];
			for (let i = 0; i < image.data.length; i += 4) {
				const luminance = image.data[i] * .299 + image.data[i + 1] * .587 + image.data[i + 2] * .114;
				const x = i / 4 % image.width;
				const y = Math.floor(i / 4 / image.width);
				const value = Math.floor((luminance + thresholdMap[x % 4][y % 4]) / 2) < threshold ? 0 : 255;
				image.data.fill(value, i, i + 3);
			}
			return image;
		}
		/**
		* Change the image to blank and white using the Floyd-Steinberg algorithm
		*
		* @param  {object}   image         The imageData of a Canvas 2d context
		* @return {object}                 The resulting imageData
		*
		*/
		floydsteinberg(image) {
			const width = image.width;
			const luminance = new Uint8ClampedArray(image.width * image.height);
			for (let l = 0, i = 0; i < image.data.length; l++, i += 4) luminance[l] = image.data[i] * .299 + image.data[i + 1] * .587 + image.data[i + 2] * .114;
			for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
				const value = luminance[l] < 129 ? 0 : 255;
				const error = Math.floor((luminance[l] - value) / 16);
				image.data.fill(value, i, i + 3);
				luminance[l + 1] += error * 7;
				luminance[l + width - 1] += error * 3;
				luminance[l + width] += error * 5;
				luminance[l + width + 1] += error * 1;
			}
			return image;
		}
		/**
		* Change the image to blank and white using the Atkinson algorithm
		*
		* @param  {object}   image         The imageData of a Canvas 2d context
		* @return {object}                 The resulting imageData
		*
		*/
		atkinson(image) {
			const width = image.width;
			const luminance = new Uint8ClampedArray(image.width * image.height);
			for (let l = 0, i = 0; i < image.data.length; l++, i += 4) luminance[l] = image.data[i] * .299 + image.data[i + 1] * .587 + image.data[i + 2] * .114;
			for (let l = 0, i = 0; i < image.data.length; l++, i += 4) {
				const value = luminance[l] < 129 ? 0 : 255;
				const error = Math.floor((luminance[l] - value) / 8);
				image.data.fill(value, i, i + 3);
				luminance[l + 1] += error;
				luminance[l + 2] += error;
				luminance[l + width - 1] += error;
				luminance[l + width] += error;
				luminance[l + width + 1] += error;
				luminance[l + 2 * width] += error;
			}
			return image;
		}
	};
	module.exports = new CanvasDither();
}));
//#endregion
//#region node_modules/canvas-flatten/src/canvas-flatten.js
var require_canvas_flatten = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Use the ImageData from a Canvas and flatten the image on a solid background
	*/
	var CanvasFlatten = class {
		/**
		* Change the image to grayscale
		*
		* @param  {object}   image         The imageData of a Canvas 2d context
		* @param  {array}    background    Three values consisting of the r, g, b of the background
		* @return {object}                 The resulting imageData
		*
		*/
		flatten(image, background) {
			for (let i = 0; i < image.data.length; i += 4) {
				const alpha = image.data[i + 3];
				const invAlpha = 255 - alpha;
				image.data[i] = (alpha * image.data[i] + invAlpha * background[0]) / 255;
				image.data[i + 1] = (alpha * image.data[i + 1] + invAlpha * background[1]) / 255;
				image.data[i + 2] = (alpha * image.data[i + 2] + invAlpha * background[2]) / 255;
				image.data[i + 3] = 255;
			}
			return image;
		}
	};
	module.exports = new CanvasFlatten();
}));
//#endregion
//#region node_modules/@point-of-sale/codepage-encoder/dist/codepage-encoder.cjs
var require_codepage_encoder = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var definitions = {
		"ascii": {
			name: "ASCII",
			languages: ["en"],
			value: new Array(256).fill(1, 0, 128).map((v, i) => i)
		},
		"cp437": {
			name: "USA, Standard Europe",
			languages: ["en"],
			extends: "ascii",
			value: [
				[
					,
					9786,
					9787,
					9829,
					9830,
					9827,
					9824,
					8226,
					9688,
					9675,
					9689,
					9794,
					9792,
					9834,
					9835,
					9788
				],
				[
					9658,
					9668,
					8597,
					8252,
					182,
					167,
					9644,
					8616,
					8593,
					8595,
					8594,
					8592,
					8735,
					8596,
					9650,
					9660
				],
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					8962
				],
				[
					199,
					252,
					233,
					226,
					228,
					224,
					229,
					231,
					234,
					235,
					232,
					239,
					238,
					236,
					196,
					197
				],
				[
					201,
					230,
					198,
					244,
					246,
					242,
					251,
					249,
					255,
					214,
					220,
					162,
					163,
					165,
					8359,
					402
				],
				[
					225,
					237,
					243,
					250,
					241,
					209,
					170,
					186,
					191,
					8976,
					172,
					189,
					188,
					161,
					171,
					187
				],
				[
					9617,
					9618,
					9619,
					9474,
					9508,
					9569,
					9570,
					9558,
					9557,
					9571,
					9553,
					9559,
					9565,
					9564,
					9563,
					9488
				],
				[
					9492,
					9524,
					9516,
					9500,
					9472,
					9532,
					9566,
					9567,
					9562,
					9556,
					9577,
					9574,
					9568,
					9552,
					9580,
					9575
				],
				[
					9576,
					9572,
					9573,
					9561,
					9560,
					9554,
					9555,
					9579,
					9578,
					9496,
					9484,
					9608,
					9604,
					9612,
					9616,
					9600
				],
				[
					945,
					223,
					915,
					960,
					931,
					963,
					181,
					964,
					934,
					920,
					937,
					948,
					8734,
					966,
					949,
					8745
				],
				[
					8801,
					177,
					8805,
					8804,
					8992,
					8993,
					247,
					8776,
					176,
					8729,
					183,
					8730,
					8319,
					178,
					9632,
					160
				]
			]
		},
		"cp720": {
			name: "Arabic",
			languages: ["ar"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					65533,
					65533,
					,
					,
					65533,
					,
					65533,
					,
					,
					,
					,
					,
					,
					65533,
					65533,
					65533
				],
				[
					65533,
					1617,
					1618,
					,
					164,
					1600,
					,
					,
					1569,
					1570,
					1571,
					1572,
					,
					1573,
					1574,
					1575
				],
				[
					1576,
					1577,
					1578,
					1579,
					1580,
					1581,
					1582,
					1583,
					1584,
					1585,
					1586,
					1587,
					1588,
					1589,
					,
					,
				],
				,
				,
				,
				[
					1590,
					1591,
					1592,
					1593,
					1594,
					1601,
					,
					1602,
					1603,
					1604,
					1605,
					1606,
					1607,
					1608,
					1609,
					1610
				],
				[
					,
					1611,
					1612,
					1613,
					1614,
					1615,
					1616,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				]
			]
		},
		"cp737": {
			name: "Greek",
			languages: ["el"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					913,
					914,
					915,
					916,
					917,
					918,
					919,
					920,
					921,
					922,
					923,
					924,
					925,
					926,
					927,
					928
				],
				[
					929,
					931,
					932,
					933,
					934,
					935,
					936,
					937,
					945,
					946,
					947,
					948,
					949,
					950,
					951,
					952
				],
				[
					953,
					954,
					955,
					956,
					957,
					958,
					959,
					960,
					961,
					963,
					962,
					964,
					965,
					966,
					967,
					968
				],
				,
				,
				,
				[
					969,
					940,
					941,
					942,
					970,
					943,
					972,
					973,
					971,
					974,
					902,
					904,
					905,
					906,
					908,
					910
				],
				[
					911,
					,
					,
					,
					938,
					939,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				]
			]
		},
		"cp771": {
			name: "Lithuanian KBL",
			languages: ["lt"],
			extends: "cp866",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					260,
					261,
					268,
					269
				],
				,
				[
					280,
					281,
					278,
					279,
					302,
					303,
					352,
					353,
					370,
					371,
					362,
					363,
					381,
					382,
					,
					,
				]
			]
		},
		"cp772": {
			name: "Lithuanian LST 1284",
			languages: ["lt"],
			extends: "cp866",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					260,
					268,
					280,
					278,
					,
					,
					,
					,
					302,
					352,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					370,
					362,
					,
					,
					,
					,
					,
					,
					,
					381
				],
				[
					261,
					269,
					281,
					279,
					303,
					353,
					371,
					363,
					382,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				[
					,
					,
					8805,
					8804,
					8222,
					8220,
					247,
					8776,
					,
					,
					,
					,
					8319,
					178,
					,
					,
				]
			]
		},
		"cp774": {
			name: "Lithuanian LST 1283",
			languages: ["lt"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					260,
					268,
					280,
					278,
					,
					,
					,
					,
					302,
					352,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					370,
					362,
					,
					,
					,
					,
					,
					,
					,
					381
				],
				[
					261,
					269,
					281,
					279,
					303,
					353,
					371,
					363,
					382,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					946,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					8898
				],
				[
					,
					,
					,
					,
					8222,
					8220,
					,
					,
					,
					,
					729,
					,
					,
					,
					,
					,
				]
			]
		},
		"cp775": {
			name: "Baltic Rim",
			languages: ["et", "lt"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					262,
					,
					,
					257,
					,
					291,
					,
					263,
					322,
					275,
					342,
					343,
					299,
					377,
					,
					,
				],
				[
					,
					,
					,
					333,
					,
					290,
					162,
					346,
					347,
					,
					,
					248,
					,
					216,
					215,
					164
				],
				[
					256,
					298,
					,
					379,
					380,
					378,
					8221,
					166,
					169,
					174,
					,
					,
					,
					321,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					260,
					268,
					280,
					278,
					,
					,
					,
					,
					302,
					352,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					370,
					362,
					,
					,
					,
					,
					,
					,
					,
					381
				],
				[
					261,
					269,
					281,
					279,
					303,
					353,
					371,
					363,
					382,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					211,
					,
					332,
					323,
					245,
					213,
					,
					324,
					310,
					311,
					315,
					316,
					326,
					274,
					325,
					8217
				],
				[
					173,
					,
					8220,
					190,
					182,
					167,
					,
					8222,
					,
					,
					,
					185,
					179,
					,
					,
					,
				]
			]
		},
		"cp850": {
			name: "Multilingual",
			languages: ["en"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					248,
					,
					216,
					215,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					174,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					193,
					194,
					192,
					169,
					,
					,
					,
					,
					162,
					165,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					227,
					195,
					,
					,
					,
					,
					,
					,
					,
					164
				],
				[
					240,
					208,
					202,
					203,
					200,
					305,
					205,
					206,
					207,
					,
					,
					,
					,
					166,
					204,
					,
				],
				[
					211,
					,
					212,
					210,
					245,
					213,
					,
					254,
					222,
					218,
					219,
					217,
					253,
					221,
					175,
					180
				],
				[
					173,
					,
					8215,
					190,
					182,
					167,
					,
					184,
					,
					168,
					,
					185,
					179,
					,
					,
					,
				]
			]
		},
		"cp851": {
			name: "Greek",
			languages: ["el"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					902,
					,
					,
					,
					,
					,
					,
					904,
					,
					905
				],
				[
					906,
					65533,
					908,
					,
					,
					910,
					,
					,
					911,
					,
					,
					940,
					,
					941,
					942,
					943
				],
				[
					970,
					912,
					972,
					973,
					913,
					914,
					915,
					916,
					917,
					918,
					919,
					,
					920,
					921,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					922,
					923,
					924,
					925,
					,
					,
					,
					,
					926,
					927,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					928,
					929,
					,
					,
					,
					,
					,
					,
					,
					931
				],
				[
					932,
					933,
					934,
					935,
					936,
					937,
					945,
					946,
					947,
					,
					,
					,
					,
					948,
					949,
					,
				],
				[
					950,
					951,
					952,
					953,
					954,
					955,
					956,
					957,
					958,
					959,
					960,
					961,
					963,
					962,
					964,
					180
				],
				[
					173,
					,
					965,
					966,
					967,
					167,
					968,
					184,
					,
					168,
					969,
					971,
					944,
					974,
					,
					,
				]
			]
		},
		"cp852": {
			name: "Latin 2",
			languages: [
				"hu",
				"pl",
				"cz"
			],
			extends: "cp850",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					367,
					263,
					,
					322,
					,
					336,
					337,
					,
					377,
					,
					262
				],
				[
					,
					313,
					314,
					,
					,
					317,
					318,
					346,
					347,
					,
					,
					356,
					357,
					321,
					,
					269
				],
				[
					,
					,
					,
					,
					260,
					261,
					381,
					382,
					280,
					281,
					,
					378,
					268,
					351,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					282,
					350,
					,
					,
					,
					,
					379,
					380,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					258,
					259,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					273,
					272,
					270,
					,
					271,
					327,
					,
					,
					283,
					,
					,
					,
					,
					354,
					366,
					,
				],
				[
					,
					,
					,
					323,
					324,
					328,
					352,
					353,
					340,
					,
					341,
					368,
					,
					,
					355,
					,
				],
				[
					,
					733,
					731,
					711,
					728,
					,
					,
					,
					,
					,
					729,
					369,
					344,
					345,
					,
					,
				]
			]
		},
		"cp853": {
			name: "Turkish",
			languages: ["tr"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					265,
					,
					,
					,
					,
					,
					,
					,
					,
					264
				],
				[
					,
					267,
					266,
					,
					,
					,
					,
					,
					304,
					,
					,
					285,
					,
					284,
					215,
					309
				],
				[
					,
					,
					,
					,
					,
					,
					286,
					287,
					292,
					293,
					65533,
					,
					308,
					351,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					193,
					194,
					192,
					350,
					,
					,
					,
					,
					379,
					380,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					348,
					349,
					,
					,
					,
					,
					,
					,
					,
					164
				],
				[
					65533,
					65533,
					202,
					203,
					200,
					305,
					205,
					206,
					207,
					,
					,
					,
					,
					65533,
					204,
					,
				],
				[
					211,
					,
					212,
					210,
					288,
					289,
					,
					294,
					295,
					218,
					219,
					217,
					364,
					365,
					65533,
					180
				],
				[
					173,
					65533,
					8467,
					329,
					728,
					167,
					,
					184,
					,
					168,
					729,
					65533,
					179,
					,
					,
					,
				]
			]
		},
		"cp855": {
			name: "Cyrillic",
			languages: ["bg"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					1106,
					1026,
					1107,
					1027,
					1105,
					1025,
					1108,
					1028,
					1109,
					1029,
					1110,
					1030,
					1111,
					1031,
					1112,
					1032
				],
				[
					1113,
					1033,
					1114,
					1034,
					1115,
					1035,
					1116,
					1036,
					1118,
					1038,
					1119,
					1039,
					1102,
					1070,
					1098,
					1066
				],
				[
					1072,
					1040,
					1073,
					1041,
					1094,
					1062,
					1076,
					1044,
					1077,
					1045,
					1092,
					1060,
					1075,
					1043,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					1093,
					1061,
					1080,
					1048,
					,
					,
					,
					,
					1081,
					1049,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					1082,
					1050,
					,
					,
					,
					,
					,
					,
					,
					164
				],
				[
					1083,
					1051,
					1084,
					1052,
					1085,
					1053,
					1086,
					1054,
					1087,
					,
					,
					,
					,
					1055,
					1103,
					,
				],
				[
					1071,
					1088,
					1056,
					1089,
					1057,
					1090,
					1058,
					1091,
					1059,
					1078,
					1046,
					1074,
					1042,
					1100,
					1068,
					8470
				],
				[
					173,
					1099,
					1067,
					1079,
					1047,
					1096,
					1064,
					1101,
					1069,
					1097,
					1065,
					1095,
					1063,
					167,
					,
					,
				]
			]
		},
		"cp857": {
			name: "Turkish",
			languages: ["tr"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					305,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					304,
					,
					,
					248,
					,
					216,
					350,
					351
				],
				[
					,
					,
					,
					,
					,
					,
					286,
					287,
					,
					174,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					193,
					194,
					192,
					169,
					,
					,
					,
					,
					162,
					165,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					227,
					195,
					,
					,
					,
					,
					,
					,
					,
					164
				],
				[
					186,
					170,
					202,
					203,
					200,
					8364,
					205,
					206,
					207,
					,
					,
					,
					,
					166,
					204,
					,
				],
				[
					211,
					,
					212,
					210,
					245,
					213,
					,
					65533,
					215,
					218,
					219,
					217,
					236,
					255,
					175,
					180
				],
				[
					173,
					,
					65533,
					190,
					182,
					167,
					,
					184,
					,
					168,
					,
					185,
					179,
					,
					,
					,
				]
			]
		},
		"cp858": {
			name: "Euro",
			languages: ["en"],
			extends: "cp850",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					8364,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				,
			]
		},
		"cp860": {
			name: "Portuguese",
			languages: ["pt"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					227,
					,
					193,
					,
					,
					202,
					,
					205,
					212,
					,
					195,
					194
				],
				[
					,
					192,
					200,
					,
					245,
					,
					218,
					,
					204,
					213,
					,
					,
					,
					217,
					,
					211
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					210,
					,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				,
				,
			]
		},
		"cp861": {
			name: "Icelandic",
			languages: ["is"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					208,
					240,
					222,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					254,
					,
					221,
					253,
					,
					,
					248,
					,
					216,
					,
					,
				],
				[
					,
					,
					,
					,
					193,
					205,
					211,
					218,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				,
				,
			]
		},
		"cp862": {
			name: "Hebrew",
			languages: ["he"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					1488,
					1489,
					1490,
					1491,
					1492,
					1493,
					1494,
					1495,
					1496,
					1497,
					1498,
					1499,
					1500,
					1501,
					1502,
					1503
				],
				[
					1504,
					1505,
					1506,
					1507,
					1508,
					1509,
					1510,
					1511,
					1512,
					1513,
					1514,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				,
				,
				,
			]
		},
		"cp863": {
			name: "Canadian French",
			languages: ["fr"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					194,
					,
					182,
					,
					,
					,
					,
					,
					,
					8215,
					192,
					167
				],
				[
					,
					200,
					202,
					,
					203,
					207,
					,
					,
					164,
					212,
					,
					,
					,
					217,
					219,
					,
				],
				[
					166,
					180,
					,
					,
					168,
					184,
					179,
					175,
					206,
					,
					,
					,
					,
					190,
					,
					,
				],
				,
				,
				,
				,
				,
			]
		},
		"cp864": {
			name: "Arabic",
			languages: ["ar"],
			extends: "cp437",
			offset: 128,
			value: [
				176,
				183,
				8729,
				8730,
				9618,
				9472,
				9474,
				9532,
				9508,
				9516,
				9500,
				9524,
				9488,
				9484,
				9492,
				9496,
				946,
				8734,
				966,
				177,
				189,
				188,
				8776,
				171,
				187,
				65271,
				65272,
				65533,
				65533,
				65275,
				65276,
				65533,
				160,
				173,
				65154,
				163,
				164,
				65156,
				65533,
				65533,
				65166,
				65167,
				65173,
				65177,
				1548,
				65181,
				65185,
				65189,
				1632,
				1633,
				1634,
				1635,
				1636,
				1637,
				1638,
				1639,
				1640,
				1641,
				65233,
				1563,
				65201,
				65205,
				65209,
				1567,
				162,
				65152,
				65153,
				65155,
				65157,
				65226,
				65163,
				65165,
				65169,
				65171,
				65175,
				65179,
				65183,
				65187,
				65191,
				65193,
				65195,
				65197,
				65199,
				65203,
				65207,
				65211,
				65215,
				65217,
				65221,
				65227,
				65231,
				166,
				172,
				247,
				215,
				65225,
				1600,
				65235,
				65239,
				65243,
				65247,
				65251,
				65255,
				65259,
				65261,
				65263,
				65267,
				65213,
				65228,
				65230,
				65229,
				65249,
				65149,
				1617,
				65253,
				65257,
				65260,
				65264,
				65266,
				65232,
				65237,
				65269,
				65270,
				65245,
				65241,
				65265,
				9632,
				65533
			]
		},
		"cp865": {
			name: "Nordic",
			languages: ["sv", "dk"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					248,
					,
					216,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					164
				],
				,
				,
				,
				,
				,
			]
		},
		"cp866": {
			name: "Cyrillic 2",
			languages: ["ru"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					1040,
					1041,
					1042,
					1043,
					1044,
					1045,
					1046,
					1047,
					1048,
					1049,
					1050,
					1051,
					1052,
					1053,
					1054,
					1055
				],
				[
					1056,
					1057,
					1058,
					1059,
					1060,
					1061,
					1062,
					1063,
					1064,
					1065,
					1066,
					1067,
					1068,
					1069,
					1070,
					1071
				],
				[
					1072,
					1073,
					1074,
					1075,
					1076,
					1077,
					1078,
					1079,
					1080,
					1081,
					1082,
					1083,
					1084,
					1085,
					1086,
					1087
				],
				,
				,
				,
				[
					1088,
					1089,
					1090,
					1091,
					1092,
					1093,
					1094,
					1095,
					1096,
					1097,
					1098,
					1099,
					1100,
					1101,
					1102,
					1103
				],
				[
					1025,
					1105,
					1028,
					1108,
					1031,
					1111,
					1038,
					1118,
					,
					,
					,
					,
					8470,
					164,
					,
					,
				]
			]
		},
		"cp869": {
			name: "Greek",
			languages: ["el"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					902,
					65533,
					183,
					172,
					166,
					8216,
					8217,
					904,
					8213,
					905
				],
				[
					906,
					938,
					908,
					65533,
					65533,
					910,
					939,
					169,
					911,
					178,
					179,
					940,
					,
					941,
					942,
					943
				],
				[
					970,
					912,
					972,
					973,
					913,
					914,
					915,
					916,
					917,
					918,
					919,
					,
					920,
					921,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					922,
					923,
					924,
					925,
					,
					,
					,
					,
					926,
					927,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					928,
					929,
					,
					,
					,
					,
					,
					,
					,
					931
				],
				[
					932,
					933,
					934,
					935,
					936,
					937,
					945,
					946,
					947,
					,
					,
					,
					,
					948,
					949,
					,
				],
				[
					950,
					951,
					952,
					953,
					954,
					955,
					956,
					957,
					958,
					959,
					960,
					961,
					963,
					962,
					964,
					900
				],
				[
					173,
					,
					965,
					966,
					967,
					167,
					968,
					901,
					,
					168,
					969,
					971,
					944,
					974,
					,
					,
				]
			]
		},
		"cp874": {
			name: "Thai",
			languages: ["th"],
			extends: "ascii",
			offset: 128,
			value: [
				8364,
				65533,
				65533,
				65533,
				65533,
				8230,
				65533,
				65533,
				65533,
				65533,
				65533,
				65533,
				65533,
				65533,
				65533,
				65533,
				65533,
				8216,
				8217,
				8220,
				8221,
				8226,
				8211,
				8212,
				65533,
				65533,
				65533,
				65533,
				65533,
				65533,
				65533,
				65533,
				160,
				3585,
				3586,
				3587,
				3588,
				3589,
				3590,
				3591,
				3592,
				3593,
				3594,
				3595,
				3596,
				3597,
				3598,
				3599,
				3600,
				3601,
				3602,
				3603,
				3604,
				3605,
				3606,
				3607,
				3608,
				3609,
				3610,
				3611,
				3612,
				3613,
				3614,
				3615,
				3616,
				3617,
				3618,
				3619,
				3620,
				3621,
				3622,
				3623,
				3624,
				3625,
				3626,
				3627,
				3628,
				3629,
				3630,
				3631,
				3632,
				3633,
				3634,
				3635,
				3636,
				3637,
				3638,
				3639,
				3640,
				3641,
				3642,
				65533,
				65533,
				65533,
				65533,
				3647,
				3648,
				3649,
				3650,
				3651,
				3652,
				3653,
				3654,
				3655,
				3656,
				3657,
				3658,
				3659,
				3660,
				3661,
				3662,
				3663,
				3664,
				3665,
				3666,
				3667,
				3668,
				3669,
				3670,
				3671,
				3672,
				3673,
				3674,
				3675,
				65533,
				65533,
				65533,
				65533
			]
		},
		"cp1001": {
			name: "Arabic",
			languages: ["ar"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					1569,
					1570,
					1571,
					1572,
					1573,
					65163,
					1575,
					1576,
					65169,
					1577,
					1578,
					65175,
					1579,
					65179,
					1583,
					1584
				],
				[
					1585,
					1586,
					1587,
					65203,
					65204,
					1588,
					65207,
					65208,
					1589,
					65211,
					65212,
					1590,
					65215,
					65216,
					1591,
					1592
				],
				[
					1593,
					65227,
					1594,
					65231,
					1601,
					65235,
					1602,
					65239,
					1603,
					1705,
					1604,
					65271,
					65273,
					65275,
					9496,
					1605
				],
				[
					65251,
					1606,
					65255,
					1607,
					65259,
					1608,
					1609,
					1657,
					65267,
					9474,
					1548,
					1563,
					1567,
					65154,
					65156,
					65162
				],
				[
					,
					1580,
					65183,
					1581,
					65187,
					1582,
					65191,
					65226,
					65228,
					65230,
					65231,
					65272,
					65274,
					65276,
					65259,
					65260
				],
				[
					1632,
					65264,
					9472,
					65533,
					1632,
					1633,
					1634,
					1635,
					1636,
					1637,
					1638,
					1639,
					1640,
					1641,
					65533,
					65533
				],
				[
					65533,
					65533,
					65275,
					65533,
					65533,
					65533,
					65533,
					9524,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
			]
		},
		"cp1098": {
			name: "Farsi",
			languages: ["fa"],
			extends: "cp437",
			value: [
				,
				,
				[
					,
					,
					,
					,
					,
					65533,
					,
					,
					,
					,
					65533,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				,
				,
				[
					65533,
					65533,
					1548,
					1563,
					1567,
					1611,
					1570,
					65154,
					63738,
					1575,
					65166,
					63739,
					1569,
					1571,
					65156,
					63737
				],
				[
					1572,
					65163,
					1576,
					65169,
					64342,
					64344,
					1578,
					65175,
					1579,
					65179,
					1580,
					65183,
					64378,
					64380,
					215,
					1581
				],
				[
					65187,
					1582,
					65191,
					1583,
					1584,
					1585,
					1586,
					64394,
					1587,
					65203,
					1588,
					65207,
					1589,
					65211,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					1590,
					65215,
					65217,
					65219,
					,
					,
					,
					,
					164,
					65221,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					65223,
					1593,
					,
					,
					,
					,
					,
					,
					,
					65533
				],
				[
					65226,
					65227,
					65228,
					1594,
					65230,
					65231,
					65232,
					1601,
					65235,
					,
					,
					,
					,
					1602,
					65239,
					,
				],
				[
					64398,
					65243,
					64402,
					64404,
					1604,
					65247,
					1605,
					65251,
					1606,
					65255,
					1608,
					1607,
					65259,
					65260,
					64420,
					64508
				],
				[
					173,
					64509,
					64510,
					1600,
					1632,
					1633,
					1634,
					1635,
					1636,
					1637,
					1638,
					1639,
					1640,
					1641,
					,
					,
				]
			]
		},
		"cp1125": {
			name: "Ukrainian",
			languages: ["uk"],
			extends: "cp866",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					1168,
					1169,
					1028,
					1108,
					1030,
					1110,
					1031,
					1111,
					247,
					177,
					,
					,
					,
					,
				]
			]
		},
		"cp3001": {
			name: "Estonian 1 or 1116",
			languages: ["et"],
			extends: "cp850",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					353,
					352,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					382,
					381,
					,
					,
					,
					,
					,
					,
					,
				],
				,
			]
		},
		"cp3002": {
			name: "Estonian 2",
			languages: ["et"],
			extends: "iso8859-1",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533
				],
				[
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533
				],
				[
					32,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					8254
				],
				,
				,
				[
					352,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					381,
					,
				],
				,
				[
					353,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					382,
					,
				]
			]
		},
		"cp3011": {
			name: "Latvian 1",
			languages: ["lv"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					256,
					,
					326,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					257,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					352,
					,
					269,
					268,
					,
					,
					291,
					298,
					299,
					,
					,
					,
					,
					363,
					362,
					,
				],
				,
				[
					274,
					275,
					290,
					311,
					310,
					316,
					315,
					382,
					381,
					,
					,
					,
					325,
					353,
					,
					,
				]
			]
		},
		"cp3012": {
			name: "Latvian 2 (modified 866)",
			languages: ["lv"],
			extends: "cp866",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					256,
					,
					326,
					,
					,
					,
					,
					,
					332,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					257,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					352,
					,
					269,
					268,
					,
					,
					291,
					298,
					299,
					,
					,
					,
					,
					363,
					362,
					,
				],
				,
				[
					274,
					275,
					290,
					311,
					310,
					316,
					315,
					382,
					381,
					333,
					,
					,
					325,
					353,
					,
					,
				]
			]
		},
		"cp3021": {
			name: "Bulgarian (MIK)",
			languages: ["bg"],
			extends: "cp866",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					1088,
					1089,
					1090,
					1091,
					1092,
					1093,
					1094,
					1095,
					1096,
					1097,
					1098,
					1099,
					1100,
					1101,
					1102,
					1103
				],
				[
					,
					,
					,
					,
					,
					,
					9571,
					9553,
					,
					,
					,
					,
					,
					,
					,
					9488
				],
				[
					9617,
					9618,
					9619,
					9474,
					9508,
					8470,
					167,
					9559,
					9565,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					945,
					223,
					915,
					960,
					931,
					963,
					181,
					964,
					934,
					920,
					937,
					948,
					8734,
					966,
					949,
					8745
				],
				[
					8801,
					177,
					8805,
					8804,
					8992,
					8993,
					247,
					8776,
					,
					,
					,
					,
					8319,
					178,
					,
					,
				]
			]
		},
		"cp3041": {
			name: "Maltese ISO 646",
			languages: ["mt"],
			extends: "ascii",
			value: [
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					289,
					380,
					295,
					,
					,
				],
				[
					267,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					288,
					379,
					294,
					266,
					,
				],
				,
				,
				,
				,
				,
				,
				,
				,
			]
		},
		"cp3840": {
			name: "Russian (modified 866)",
			languages: ["ru"],
			extends: "cp866",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					8801,
					177,
					8805,
					8804,
					8992,
					8993,
					247,
					8776,
					,
					,
					,
					,
					8319,
					178,
					,
					,
				]
			]
		},
		"cp3841": {
			name: "Ghost",
			languages: ["ru"],
			extends: "cp437",
			offset: 128,
			value: [
				1171,
				1241,
				1105,
				1110,
				1111,
				1112,
				1181,
				1257,
				1118,
				1199,
				1277,
				1224,
				1209,
				1207,
				1108,
				163,
				1170,
				1240,
				1025,
				1030,
				1031,
				1032,
				1180,
				1256,
				1038,
				1198,
				1276,
				1223,
				1208,
				1206,
				1028,
				1066,
				32,
				33,
				34,
				35,
				164,
				37,
				38,
				39,
				40,
				41,
				42,
				43,
				44,
				45,
				46,
				47,
				48,
				49,
				50,
				51,
				52,
				53,
				54,
				55,
				56,
				57,
				58,
				59,
				60,
				61,
				62,
				63,
				1102,
				1072,
				1073,
				1094,
				1076,
				1077,
				1092,
				1075,
				1093,
				1080,
				1081,
				1082,
				1083,
				1084,
				1085,
				1086,
				1087,
				1103,
				1088,
				1089,
				1090,
				1091,
				1078,
				1074,
				1100,
				1099,
				1079,
				1096,
				1101,
				1097,
				1095,
				1098,
				1070,
				1040,
				1041,
				1062,
				1044,
				1045,
				1060,
				1043,
				1061,
				1048,
				1049,
				1050,
				1051,
				1052,
				1053,
				1054,
				1055,
				1071,
				1056,
				1057,
				1058,
				1059,
				1046,
				1042,
				1068,
				1067,
				1047,
				1064,
				1069,
				1065,
				1063,
				8709
			]
		},
		"cp3843": {
			name: "Polish (Mazovia)",
			languages: ["pl"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					261,
					,
					,
					,
					,
					,
					,
					263,
					,
					260
				],
				[
					280,
					281,
					322,
					,
					,
					262,
					,
					,
					346,
					,
					,
					,
					321,
					,
					347,
					,
				],
				[
					377,
					379,
					,
					211,
					324,
					323,
					378,
					380,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				,
				,
			]
		},
		"cp3844": {
			name: "Czech (Kamenický)",
			languages: ["cz"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					268,
					,
					,
					271,
					,
					270,
					356,
					269,
					283,
					282,
					313,
					205,
					318,
					314,
					,
					193
				],
				[
					,
					382,
					381,
					,
					,
					211,
					367,
					218,
					253,
					,
					,
					352,
					317,
					221,
					344,
					357
				],
				[
					,
					,
					,
					,
					328,
					327,
					366,
					212,
					353,
					345,
					341,
					340,
					,
					167,
					,
					,
				],
				,
				,
				,
				,
				,
			]
		},
		"cp3845": {
			name: "Hungarian (CWI-2)",
			languages: ["hu"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					205,
					,
					193
				],
				[
					,
					,
					,
					337,
					,
					211,
					369,
					218,
					368,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					336,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				,
				,
			]
		},
		"cp3846": {
			name: "Turkish",
			languages: ["tr"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					305,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					304,
					,
					,
					,
					,
					,
					350,
					351
				],
				[
					,
					,
					,
					,
					,
					,
					286,
					287,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				,
				,
			]
		},
		"cp3847": {
			name: "Brazil ABNT",
			languages: ["pt"],
			extends: "iso8859-1",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				[
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					,
					,
					,
					,
					,
					,
					,
				]
			]
		},
		"cp3848": {
			name: "Brazil ABICOMP",
			languages: ["pt"],
			extends: "ascii",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					160,
					192,
					193,
					194,
					195,
					196,
					199,
					200,
					201,
					202,
					203,
					204,
					205,
					206,
					205,
					209
				],
				[
					210,
					211,
					212,
					213,
					214,
					198,
					217,
					218,
					219,
					220,
					376,
					168,
					163,
					166,
					167,
					176
				],
				[
					161,
					224,
					225,
					226,
					227,
					228,
					231,
					232,
					233,
					234,
					235,
					236,
					237,
					238,
					239,
					241
				],
				[
					242,
					243,
					244,
					245,
					246,
					230,
					249,
					250,
					251,
					252,
					255,
					223,
					170,
					186,
					191,
					177
				],
				,
				,
			]
		},
		"iso8859-1": {
			name: "Latin 1",
			languages: ["en"],
			extends: "ascii",
			offset: 128,
			value: [
				128,
				129,
				130,
				131,
				132,
				133,
				134,
				135,
				136,
				137,
				138,
				139,
				140,
				141,
				142,
				143,
				144,
				145,
				146,
				147,
				148,
				149,
				150,
				151,
				152,
				153,
				154,
				155,
				156,
				157,
				158,
				159,
				160,
				161,
				162,
				163,
				164,
				165,
				166,
				167,
				168,
				169,
				170,
				171,
				172,
				173,
				174,
				175,
				176,
				177,
				178,
				179,
				180,
				181,
				182,
				183,
				184,
				185,
				186,
				187,
				188,
				189,
				190,
				191,
				192,
				193,
				194,
				195,
				196,
				197,
				198,
				199,
				200,
				201,
				202,
				203,
				204,
				205,
				206,
				207,
				208,
				209,
				210,
				211,
				212,
				213,
				214,
				215,
				216,
				217,
				218,
				219,
				220,
				221,
				222,
				223,
				224,
				225,
				226,
				227,
				228,
				229,
				230,
				231,
				232,
				233,
				234,
				235,
				236,
				237,
				238,
				239,
				240,
				241,
				242,
				243,
				244,
				245,
				246,
				247,
				248,
				249,
				250,
				251,
				252,
				253,
				254,
				255
			]
		},
		"iso8859-2": {
			name: "Latin 2",
			languages: [
				"hu",
				"pl",
				"cz"
			],
			extends: "iso8859-1",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					260,
					728,
					321,
					,
					317,
					346,
					,
					,
					352,
					350,
					356,
					377,
					,
					381,
					379
				],
				[
					,
					261,
					731,
					322,
					,
					318,
					347,
					711,
					,
					353,
					351,
					357,
					378,
					733,
					382,
					380
				],
				[
					340,
					,
					,
					258,
					,
					313,
					262,
					,
					268,
					,
					280,
					,
					282,
					,
					,
					270
				],
				[
					272,
					323,
					327,
					,
					,
					336,
					,
					,
					344,
					366,
					,
					368,
					,
					,
					354,
					,
				],
				[
					341,
					,
					,
					259,
					,
					314,
					263,
					,
					269,
					,
					281,
					,
					283,
					,
					,
					271
				],
				[
					273,
					324,
					328,
					,
					,
					337,
					,
					,
					345,
					367,
					,
					369,
					,
					,
					355,
					729
				]
			]
		},
		"iso8859-7": {
			name: "Greek",
			languages: ["el"],
			extends: "iso8859-1",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					8216,
					8217,
					,
					8364,
					8367,
					,
					,
					,
					,
					890,
					,
					,
					,
					,
					8213
				],
				[
					,
					,
					,
					,
					900,
					901,
					902,
					,
					904,
					905,
					906,
					,
					908,
					,
					910,
					911
				],
				[
					912,
					913,
					914,
					915,
					916,
					917,
					918,
					919,
					920,
					921,
					922,
					923,
					924,
					925,
					926,
					927
				],
				[
					928,
					929,
					,
					931,
					932,
					933,
					934,
					935,
					936,
					937,
					938,
					939,
					940,
					941,
					942,
					943
				],
				[
					944,
					945,
					946,
					947,
					948,
					949,
					950,
					951,
					952,
					953,
					954,
					955,
					956,
					957,
					958,
					959
				],
				[
					960,
					961,
					962,
					963,
					964,
					965,
					966,
					967,
					968,
					969,
					970,
					971,
					972,
					973,
					974,
					,
				]
			]
		},
		"iso8859-15": {
			name: "Latin 9",
			languages: ["fr"],
			extends: "iso8859-1",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					8364,
					,
					352,
					,
					353,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					381,
					,
					,
					,
					382,
					,
					,
					,
					338,
					339,
					376,
					,
				],
				,
				,
				,
				,
			]
		},
		"windows1250": {
			name: "Latin 2",
			languages: [
				"hu",
				"pl",
				"cz"
			],
			extends: "windows1252",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					65533,
					,
					,
					,
					,
					65533,
					,
					,
					,
					346,
					356,
					,
					377
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					,
					,
					347,
					357,
					,
					378
				],
				[
					,
					711,
					728,
					321,
					,
					260,
					,
					,
					,
					,
					350,
					,
					,
					,
					,
					379
				],
				[
					,
					,
					731,
					322,
					,
					,
					,
					,
					,
					261,
					351,
					,
					317,
					733,
					318,
					380
				],
				[
					340,
					,
					,
					258,
					,
					313,
					262,
					,
					268,
					,
					280,
					,
					282,
					,
					,
					270
				],
				[
					272,
					323,
					327,
					,
					,
					336,
					,
					,
					344,
					366,
					,
					368,
					,
					,
					354,
					,
				],
				[
					341,
					,
					,
					259,
					,
					314,
					263,
					,
					269,
					,
					281,
					,
					283,
					,
					,
					271
				],
				[
					273,
					324,
					328,
					,
					,
					337,
					,
					,
					345,
					367,
					,
					369,
					,
					,
					355,
					729
				]
			]
		},
		"windows1251": {
			name: "Cyrillic",
			languages: ["ru"],
			extends: "windows1252",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					1026,
					1027,
					,
					1107,
					,
					,
					,
					,
					8364,
					,
					1033,
					,
					1034,
					1036,
					1035,
					1039
				],
				[
					1106,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					1113,
					,
					1114,
					1116,
					1115,
					1119
				],
				[
					,
					1038,
					1118,
					1032,
					,
					1168,
					,
					,
					1025,
					,
					1028,
					,
					,
					,
					,
					1031
				],
				[
					,
					,
					1030,
					1110,
					1169,
					,
					,
					,
					1105,
					8470,
					1108,
					,
					1112,
					1029,
					1109,
					1111
				],
				[
					1040,
					1041,
					1042,
					1043,
					1044,
					1045,
					1046,
					1047,
					1048,
					1049,
					1050,
					1051,
					1052,
					1053,
					1054,
					1055
				],
				[
					1056,
					1057,
					1058,
					1059,
					1060,
					1061,
					1062,
					1063,
					1064,
					1065,
					1066,
					1067,
					1068,
					1069,
					1070,
					1071
				],
				[
					1072,
					1073,
					1074,
					1075,
					1076,
					1077,
					1078,
					1079,
					1080,
					1081,
					1082,
					1083,
					1084,
					1085,
					1086,
					1087
				],
				[
					1088,
					1089,
					1090,
					1091,
					1092,
					1093,
					1094,
					1095,
					1096,
					1097,
					1098,
					1099,
					1100,
					1101,
					1102,
					1103
				]
			]
		},
		"windows1252": {
			name: "Latin",
			languages: ["fr"],
			extends: "iso8859-1",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					8364,
					65533,
					8218,
					402,
					8222,
					8230,
					8224,
					8225,
					710,
					8240,
					352,
					8249,
					338,
					65533,
					381,
					65533
				],
				[
					65533,
					8216,
					8217,
					8220,
					8221,
					8226,
					8211,
					8212,
					732,
					8482,
					353,
					8250,
					339,
					65533,
					382,
					376
				],
				,
				,
				,
				,
				,
				,
			]
		},
		"windows1253": {
			name: "Greek",
			languages: ["el"],
			extends: "windows1252",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					65533,
					,
					65533,
					,
					65533,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					65533,
					,
					65533,
					,
					65533,
					65533
				],
				[
					,
					901,
					902,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					,
					,
					,
					8213
				],
				[
					,
					,
					,
					,
					900,
					,
					,
					,
					904,
					905,
					906,
					,
					908,
					,
					910,
					911
				],
				[
					912,
					913,
					914,
					915,
					916,
					917,
					918,
					919,
					920,
					921,
					922,
					923,
					924,
					925,
					926,
					927
				],
				[
					928,
					929,
					65533,
					931,
					932,
					933,
					934,
					935,
					936,
					937,
					938,
					939,
					940,
					941,
					942,
					943
				],
				[
					944,
					945,
					946,
					947,
					948,
					949,
					950,
					951,
					952,
					953,
					954,
					955,
					956,
					957,
					958,
					959
				],
				[
					960,
					961,
					962,
					963,
					964,
					965,
					966,
					967,
					968,
					969,
					970,
					971,
					972,
					973,
					974,
					65533
				]
			]
		},
		"windows1254": {
			name: "Turkish",
			languages: ["tr"],
			extends: "windows1252",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
				],
				,
				,
				,
				[
					286,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					304,
					350,
					,
				],
				,
				[
					287,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					305,
					351,
					,
				]
			]
		},
		"windows1255": {
			name: "Hebrew",
			languages: ["he"],
			extends: "windows1252",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					65533,
					,
					65533,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					65533,
					,
					65533,
					65533
				],
				[
					,
					,
					,
					,
					8362,
					,
					,
					,
					,
					,
					215,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					247,
					,
					,
					,
					,
					,
				],
				[
					1456,
					1457,
					1458,
					1459,
					1460,
					1461,
					1462,
					1463,
					1464,
					1465,
					65533,
					1467,
					1468,
					1469,
					1470,
					1471
				],
				[
					1472,
					1473,
					1474,
					1475,
					1520,
					1521,
					1522,
					1523,
					1524,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533
				],
				[
					1488,
					1489,
					1490,
					1491,
					1492,
					1493,
					1494,
					1495,
					1496,
					1497,
					1498,
					1499,
					1500,
					1501,
					1502,
					1503
				],
				[
					1504,
					1505,
					1506,
					1507,
					1508,
					1509,
					1510,
					1511,
					1512,
					1513,
					1514,
					65533,
					65533,
					8206,
					8207,
					65533
				]
			]
		},
		"windows1256": {
			name: "Arabic",
			languages: ["ar"],
			extends: "windows1252",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					1662,
					,
					,
					,
					,
					,
					,
					,
					,
					1657,
					,
					,
					1670,
					1688,
					1672
				],
				[
					1711,
					,
					,
					,
					,
					,
					,
					,
					1705,
					,
					1681,
					,
					,
					8204,
					8205,
					1722
				],
				[
					,
					1548,
					,
					,
					,
					,
					,
					,
					,
					,
					1726,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					1563,
					,
					,
					,
					,
					1567
				],
				[
					1729,
					1569,
					1570,
					1571,
					1572,
					1573,
					1574,
					1575,
					1576,
					1577,
					1578,
					1579,
					1580,
					1581,
					1582,
					1583
				],
				[
					1584,
					1585,
					1586,
					1587,
					1588,
					1589,
					1590,
					,
					1591,
					1592,
					1593,
					1594,
					1600,
					1601,
					1602,
					1603
				],
				[
					,
					1604,
					,
					1605,
					1606,
					1607,
					1608,
					,
					,
					,
					,
					,
					1609,
					1610,
					,
					,
				],
				[
					1611,
					1612,
					1613,
					1614,
					,
					1615,
					1616,
					,
					1617,
					,
					1618,
					,
					,
					8206,
					8207,
					1746
				]
			]
		},
		"windows1257": {
			name: "Baltic Rim",
			languages: ["et", "lt"],
			extends: "windows1252",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					65533,
					,
					,
					,
					,
					65533,
					,
					65533,
					,
					65533,
					168,
					711,
					184
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					65533,
					,
					65533,
					175,
					731,
					65533
				],
				[
					,
					65533,
					,
					,
					,
					65533,
					,
					,
					216,
					,
					342,
					,
					,
					,
					,
					198
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					248,
					,
					343,
					,
					,
					,
					,
					230
				],
				[
					260,
					302,
					256,
					262,
					,
					,
					280,
					274,
					268,
					,
					377,
					278,
					290,
					310,
					298,
					315
				],
				[
					352,
					323,
					325,
					,
					332,
					,
					,
					,
					370,
					321,
					346,
					362,
					,
					379,
					381,
					,
				],
				[
					261,
					303,
					257,
					263,
					,
					,
					281,
					275,
					269,
					,
					378,
					279,
					291,
					311,
					299,
					316
				],
				[
					353,
					324,
					326,
					,
					333,
					,
					,
					,
					371,
					322,
					347,
					363,
					,
					380,
					382,
					729
				]
			]
		},
		"windows1258": {
			name: "Vietnamese",
			languages: ["vi"],
			extends: "windows1252",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					,
					,
					65533,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					65533,
					,
					,
					,
					65533,
					,
				],
				,
				,
				[
					,
					,
					,
					258,
					,
					,
					,
					,
					,
					,
					,
					,
					768,
					,
					,
					,
				],
				[
					272,
					,
					777,
					,
					,
					416,
					,
					,
					,
					,
					,
					,
					,
					431,
					771,
					,
				],
				[
					,
					,
					,
					259,
					,
					,
					,
					,
					,
					,
					,
					,
					769,
					,
					,
					,
				],
				[
					273,
					,
					803,
					,
					,
					417,
					,
					,
					,
					,
					,
					,
					,
					432,
					8363,
					,
				]
			]
		},
		"rk1048": {
			name: "Kazakh",
			languages: ["kk"],
			extends: "windows1251",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					1178,
					1210,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					1179,
					1211,
					,
				],
				[
					,
					1200,
					1201,
					1240,
					,
					1256,
					,
					,
					,
					,
					1170,
					,
					,
					,
					,
					1198
				],
				[
					,
					,
					,
					,
					1257,
					,
					,
					,
					,
					,
					1171,
					,
					1241,
					1186,
					1187,
					1199
				],
				,
				,
				,
				,
			]
		},
		"thai11": {
			name: "Thai (Charcter Code 11)",
			languages: ["th"],
			extends: "thai13",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					9484,
					9488,
					9492,
					9496,
					9474,
					9500,
					9508
				],
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					9472,
					9524,
					9516,
					9532,
					,
				],
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					3658,
					3650,
					3651,
					3652,
					65533
				]
			]
		},
		"thai13": {
			name: "Thai (Charcter Code 13)",
			languages: ["th"],
			extends: "cp874",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					65533,
					,
					,
					,
					,
					65533,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					3619,
					,
					,
					3648,
					,
				],
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					8592,
					8593,
					8594,
					8595
				]
			]
		},
		"thai14": {
			name: "Thai (Charcter Code 14)",
			languages: ["th"],
			extends: "cp874",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					9484,
					9488,
					9492,
					9496,
					9474,
					9472,
					9500,
					9508,
					9524,
					9516,
					9532,
					9608,
					,
					,
					,
					,
				],
				[
					3619,
					3634,
					65533,
					3632,
					65533,
					65533,
					65533,
					65533,
					,
					,
					,
					,
					,
					,
					,
					3648
				],
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					3675,
					65533,
					,
					,
					,
					3652
				]
			]
		},
		"thai16": {
			name: "Thai (Charcter Code 16)",
			languages: ["th"],
			extends: "thai18",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					3650,
					3651,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				,
				,
				,
			]
		},
		"thai18": {
			name: "Thai (Charcter Code 18)",
			languages: ["th"],
			extends: "thai14",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					8592,
					8593,
					8594,
					8595
				],
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					3652,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					65533
				]
			]
		},
		"thai42": {
			name: "Thai (Charcter Code 42)",
			languages: ["th"],
			extends: "thai18",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					3664,
					3665,
					3666,
					3667,
					3668,
					3669,
					3670,
					3671,
					3672,
					3673,
					3587,
					3589,
					3619,
					3634,
					3652,
					,
				],
				[
					,
					,
					,
					3588,
					3590,
					3591,
					3592,
					3593,
					3594,
					3595,
					3596,
					3597,
					3598,
					3599,
					3600,
					3601
				],
				[
					3602,
					3603,
					3604,
					3605,
					3606,
					3607,
					3608,
					3609,
					3610,
					3611,
					3612,
					3613,
					3614,
					3615,
					3616,
					3617
				],
				[
					3618,
					3619,
					3620,
					3621,
					3623,
					3624,
					3625,
					3626,
					3627,
					3628,
					3629,
					3630,
					3632,
					3622,
					3634,
					3635
				],
				[
					3648,
					3649,
					3650,
					3651,
					3652,
					3654,
					3631,
					3640,
					3641,
					3636,
					3637,
					3638,
					3639,
					3658,
					3661,
					3655
				],
				[
					3656,
					3657,
					3658,
					3659,
					3660,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					3632,
					65533,
					65533,
					65533,
					65533
				],
				[
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					65533,
					,
					,
					,
					,
					160
				]
			]
		},
		"tcvn3": {
			name: "Vietnamese (VSCII3 / TCVN3)",
			languages: ["vi"],
			extends: "ascii",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					259,
					226,
					234,
					244,
					417,
					432,
					273,
					,
				],
				[
					,
					,
					,
					,
					,
					224,
					7843,
					227,
					225,
					7841,
					,
					7857,
					7859,
					7861,
					7855,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					7863,
					7847,
					7849,
					7851,
					7845,
					7853,
					232,
					,
					7867,
					7869
				],
				[
					233,
					7865,
					7873,
					7875,
					7877,
					7871,
					7879,
					236,
					7881,
					,
					,
					,
					297,
					237,
					7883,
					242
				],
				[
					,
					7887,
					245,
					243,
					7885,
					7891,
					7893,
					7895,
					7889,
					7897,
					7901,
					7903,
					7905,
					7899,
					7907,
					249
				],
				[
					,
					7911,
					361,
					250,
					7909,
					7915,
					7917,
					7919,
					7913,
					7921,
					7923,
					7927,
					7929,
					253,
					7925,
					,
				]
			]
		},
		"tcvn3capitals": {
			name: "Vietnamese (VSCII3 / TCVN3 Capitals)",
			languages: ["vi"],
			extends: "ascii",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					258,
					194,
					,
					,
					,
					,
					208,
					,
					,
					202,
					212,
					416,
					431,
					,
					,
				],
				[
					,
					,
					,
					,
					,
					192,
					7842,
					195,
					193,
					7840,
					,
					7856,
					7858,
					7860,
					7854,
					,
				],
				[
					,
					,
					,
					,
					,
					,
					7862,
					7846,
					7848,
					7850,
					7844,
					7852,
					200,
					,
					7866,
					7868
				],
				[
					201,
					7864,
					7872,
					7874,
					7876,
					7870,
					7878,
					204,
					7880,
					,
					,
					,
					296,
					205,
					7882,
					210
				],
				[
					,
					7886,
					213,
					211,
					7884,
					7890,
					7892,
					7894,
					7888,
					7896,
					7900,
					7902,
					7904,
					7898,
					7906,
					217
				],
				[
					,
					7910,
					360,
					218,
					7908,
					7914,
					7916,
					7918,
					7912,
					7920,
					7922,
					7926,
					7928,
					221,
					7924,
					,
				]
			]
		},
		"viscii": {
			name: "Vietnamese (VISCII)",
			languages: ["vi"],
			extends: "ascii",
			value: [
				[
					,
					,
					7858,
					,
					,
					7860,
					7850,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				[
					,
					,
					,
					,
					7926,
					,
					,
					,
					,
					7928,
					,
					,
					,
					,
					7924,
					,
				],
				,
				,
				,
				,
				,
				,
				[
					7840,
					7854,
					7856,
					7862,
					7844,
					7846,
					7848,
					7852,
					7868,
					7864,
					7870,
					7872,
					7874,
					7876,
					7878,
					7888
				],
				[
					7890,
					7892,
					7894,
					7896,
					7906,
					7898,
					7900,
					7902,
					7882,
					7886,
					7884,
					7880,
					7910,
					360,
					7908,
					7922
				],
				[
					213,
					7855,
					7857,
					7863,
					7845,
					7847,
					7849,
					7853,
					7869,
					7865,
					7871,
					7873,
					7875,
					7877,
					7879,
					7889
				],
				[
					7891,
					7893,
					7895,
					7904,
					416,
					7897,
					7901,
					7903,
					7883,
					7920,
					7912,
					7914,
					7916,
					417,
					7899,
					431
				],
				[
					192,
					193,
					194,
					195,
					7842,
					258,
					7859,
					7861,
					200,
					201,
					202,
					7866,
					204,
					205,
					296,
					7923
				],
				[
					272,
					7913,
					210,
					211,
					212,
					7841,
					7927,
					7915,
					7917,
					217,
					218,
					7929,
					7925,
					221,
					7905,
					432
				],
				[
					224,
					225,
					226,
					227,
					7843,
					259,
					7919,
					7851,
					232,
					233,
					234,
					7867,
					236,
					237,
					297,
					7881
				],
				[
					273,
					7921,
					242,
					243,
					244,
					245,
					7887,
					7885,
					7909,
					249,
					250,
					361,
					7911,
					253,
					7907,
					7918
				]
			]
		},
		"khmer": {
			name: "Khmer",
			languages: ["km"],
			extends: "ascii",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					6016,
					6017,
					6016,
					6019,
					6020,
					6021,
					6022,
					6023,
					6024,
					6025,
					6026,
					6027,
					6028,
					6029,
					6030,
					6031
				],
				[
					6032,
					6033,
					6032,
					6035,
					6036,
					6037,
					6038,
					6039,
					6040,
					6041,
					6042,
					6043,
					6044,
					6045,
					6046,
					6047
				],
				[
					6048,
					6049,
					6048,
					6051,
					6052,
					6053,
					6054,
					6055,
					6056,
					6057,
					6058,
					6059,
					6060,
					6061,
					6062,
					6063
				],
				[
					6064,
					6065,
					6064,
					6067,
					6068,
					6069,
					6070,
					6071,
					6072,
					6073,
					6074,
					6075,
					6076,
					6077,
					6078,
					6079
				],
				[
					6080,
					6081,
					6080,
					6083,
					6084,
					6085,
					6086,
					6087,
					6088,
					6089,
					6090,
					6091,
					6092,
					6093,
					6094,
					6095
				],
				[
					6096,
					6097,
					6096,
					6099,
					6100,
					6101,
					6102,
					6103,
					6104,
					6105,
					6106,
					6107,
					6108,
					6109,
					,
					,
				],
				[
					6112,
					6113,
					6112,
					6115,
					6116,
					6117,
					6118,
					6119,
					6120,
					6121,
					,
					,
					,
					,
					,
					,
				],
				[
					6128,
					6129,
					6128,
					6131,
					6132,
					6133,
					6134,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				]
			]
		},
		"latvian": {
			name: "Latvian (based on cp3012)",
			languages: ["lv"],
			extends: "cp3012",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					298,
					299,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
				],
				,
				,
			]
		},
		"epson/katakana": {
			name: "Katakana",
			languages: ["ja"],
			extends: "cp437",
			offset: 128,
			value: [
				9601,
				9602,
				9603,
				9604,
				9605,
				9606,
				9607,
				9608,
				9615,
				9614,
				9613,
				9612,
				9611,
				9610,
				9609,
				9532,
				9524,
				9516,
				9508,
				9500,
				9620,
				9472,
				9474,
				9621,
				9484,
				9488,
				9492,
				9496,
				9581,
				9582,
				9584,
				9583,
				32,
				65377,
				65378,
				65379,
				65380,
				65381,
				65382,
				65383,
				65384,
				65385,
				65386,
				65387,
				65388,
				65389,
				65390,
				65391,
				65392,
				65393,
				65394,
				65395,
				65396,
				65397,
				65398,
				65399,
				65400,
				65401,
				65402,
				65403,
				65404,
				65405,
				65406,
				65407,
				65408,
				65409,
				65410,
				65411,
				65412,
				65413,
				65414,
				65415,
				65416,
				65417,
				65418,
				65419,
				65420,
				65421,
				65422,
				65423,
				65424,
				65425,
				65426,
				65427,
				65428,
				65429,
				65430,
				65431,
				65432,
				65433,
				65434,
				65435,
				65436,
				65437,
				65438,
				65439,
				9552,
				9566,
				9578,
				9569,
				9698,
				9699,
				9701,
				9700,
				9824,
				9829,
				9830,
				9827,
				9679,
				9675,
				9585,
				9586,
				9587,
				20870,
				24180,
				26376,
				26085,
				26178,
				20998,
				31186,
				12306,
				24066,
				21306,
				30010,
				26449,
				20154,
				9618,
				160
			]
		},
		"epson/iso8859-2": {
			name: "Latin 2 modified with box drawing characters",
			languages: [
				"hu",
				"pl",
				"cz"
			],
			extends: "iso8859-2",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					9617,
					9618,
					9619,
					9474,
					9508,
					9496,
					9484,
					9608,
					169,
					9571,
					9553,
					9559,
					9565,
					162,
					165,
					9488
				],
				[
					9492,
					9524,
					9516,
					9500,
					9472,
					9532,
					9604,
					9600,
					9562,
					9556,
					9577,
					9574,
					9568,
					9552,
					9580,
					174
				],
				,
				,
				,
				,
				,
				,
			]
		},
		"star/standard": {
			name: "Standard",
			languages: ["en"],
			extends: "cp437",
			offset: 128,
			value: [
				160,
				129904,
				129910,
				129905,
				129911,
				129906,
				129912,
				129907,
				129913,
				129908,
				129914,
				129909,
				9500,
				129915,
				129916,
				129918,
				129919,
				129917,
				9624,
				9623,
				9622,
				9629,
				9585,
				9586,
				9701,
				9700,
				9484,
				9524,
				9516,
				9508,
				9830,
				9587,
				196,
				214,
				220,
				223,
				167,
				170,
				186,
				65533,
				162,
				189,
				65533,
				65533,
				165,
				188,
				256,
				235,
				233,
				232,
				275,
				234,
				239,
				237,
				236,
				299,
				238,
				246,
				243,
				242,
				333,
				244,
				252,
				250,
				249,
				363,
				251,
				231,
				191,
				65533,
				65533,
				274,
				8580,
				161,
				197,
				248,
				216,
				228,
				225,
				224,
				257,
				226,
				176,
				8451,
				8457,
				937,
				181,
				931,
				963,
				65533,
				65533,
				967,
				8734,
				177,
				247,
				960,
				9612,
				9604,
				9600,
				9616,
				9532,
				9496,
				9492,
				9488,
				9608,
				9618,
				9162,
				8592,
				8593,
				8594,
				8595,
				9581,
				9161,
				129923,
				65533,
				9601,
				9613,
				65533,
				129928,
				9626,
				9630,
				9698,
				9699,
				129840,
				9208,
				9584,
				9583,
				9582
			]
		},
		"star/katakana": {
			name: "Katakana",
			languages: ["ja"],
			extends: "star/standard",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					32,
					65377,
					65378,
					65379,
					65380,
					65381,
					65382,
					65383,
					65384,
					65385,
					65386,
					65387,
					65388,
					65389,
					65390,
					65391
				],
				[
					65392,
					65393,
					65394,
					65395,
					65396,
					65397,
					65398,
					65399,
					65400,
					65401,
					65402,
					65403,
					65404,
					65405,
					65406,
					65407
				],
				[
					65408,
					65409,
					65410,
					65411,
					65412,
					65413,
					65414,
					65415,
					65416,
					65417,
					65418,
					65419,
					65420,
					65421,
					65422,
					65423
				],
				[
					65424,
					65425,
					65426,
					65427,
					65428,
					65429,
					65430,
					65431,
					65432,
					65433,
					65434,
					65435,
					65436,
					65437,
					65438,
					65439
				],
				,
				,
			]
		},
		"star/cp874": {
			name: "Thai",
			languages: ["th"],
			extends: "cp874",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					,
					9474,
					9472,
					9532,
					9484,
					9488,
					9492,
					9496,
					9500,
					9516,
					9508,
					9524
				],
				,
				,
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					3657,
					3658,
					3659,
					3660,
					,
				],
				,
				[
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					,
					162,
					172,
					166,
					,
				]
			]
		},
		"star/cp928": {
			name: "Greek",
			languages: ["el"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					160,
					8216,
					8217,
					163,
					65533,
					65533,
					166,
					167,
					168,
					169,
					65533,
					171,
					172,
					173,
					65533,
					8213
				],
				[
					176,
					177,
					178,
					179,
					900,
					901,
					902,
					183,
					904,
					905,
					906,
					187,
					908,
					189,
					910,
					911
				],
				[
					912,
					913,
					914,
					915,
					916,
					917,
					918,
					919,
					920,
					921,
					922,
					923,
					924,
					925,
					926,
					927
				],
				[
					928,
					929,
					65533,
					931,
					932,
					933,
					934,
					935,
					936,
					937,
					938,
					939,
					940,
					941,
					942,
					943
				],
				[
					944,
					945,
					946,
					947,
					948,
					949,
					950,
					951,
					952,
					953,
					954,
					955,
					956,
					957,
					958,
					959
				],
				[
					960,
					961,
					962,
					963,
					964,
					965,
					966,
					967,
					968,
					969,
					970,
					971,
					972,
					973,
					974,
					65533
				]
			]
		},
		"bixolon/cp866": {
			name: "Cyrillic 2 (modified with euro sign)",
			languages: ["ru"],
			extends: "cp866",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					,
					,
					,
					,
					9093,
					1055,
					8801,
					9824,
					8364,
					,
					,
					,
					,
					,
					,
					,
				]
			]
		},
		"bixolon/hebrew": {
			name: "Hebrew",
			languages: ["he"],
			extends: "cp437",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					32,
					33,
					34,
					35,
					36,
					37,
					38,
					39,
					40,
					41,
					42,
					43,
					44,
					45,
					46,
					47
				],
				[
					48,
					49,
					50,
					51,
					52,
					53,
					54,
					55,
					56,
					57,
					58,
					59,
					60,
					61,
					62,
					63
				],
				[
					64,
					65,
					66,
					67,
					68,
					69,
					70,
					71,
					72,
					73,
					74,
					75,
					76,
					77,
					78,
					79
				],
				[
					80,
					81,
					82,
					83,
					84,
					85,
					86,
					87,
					88,
					89,
					90,
					91,
					92,
					93,
					94,
					95
				],
				[
					1488,
					1489,
					1490,
					1491,
					1492,
					1493,
					1494,
					1495,
					1496,
					1497,
					1498,
					1499,
					1500,
					1501,
					1502,
					1503
				],
				[
					1504,
					1505,
					1506,
					1507,
					1508,
					1509,
					1510,
					1511,
					1512,
					1513,
					1514,
					123,
					124,
					125,
					126,
					,
				]
			]
		},
		"xprinter/hebrew": {
			name: "Hebrew (based on CP862 minus CP437)",
			languages: ["he"],
			extends: "ascii",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				[
					1488,
					1489,
					1490,
					1491,
					1492,
					1493,
					1494,
					1495,
					1496,
					1497,
					1498,
					1499,
					1500,
					1501,
					1502,
					1503
				],
				[
					1504,
					1505,
					1506,
					1507,
					1508,
					1509,
					1510,
					1511,
					1512,
					1513,
					1514,
					,
					,
					,
					,
					,
				],
				,
				,
				,
				,
				,
				,
			]
		},
		"pos8360/hebrew": {
			name: "Hebrew (based on cp862 with repeated characters)",
			languages: ["he"],
			extends: "cp862",
			value: [
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				[
					1488,
					1489,
					1490,
					1491,
					1492,
					1493,
					1494,
					1495,
					1496,
					1497,
					1498,
					1499,
					1500,
					1501,
					1502,
					1503
				],
				[
					1504,
					1505,
					1506,
					1507,
					1508,
					1509,
					1510,
					1511,
					1512,
					1513,
					1514,
					,
					,
					,
					,
					,
				]
			]
		}
	};
	var aliases = {
		"cp2001": "cp771",
		"cp1119": "cp772",
		"cp1118": "cp774",
		"cp1162": "cp874",
		"iso88591": "iso8859-1",
		"iso88592": "iso8859-2",
		"iso88597": "iso8859-7",
		"iso885915": "iso8859-15",
		"shiftjis": "epson/katakana",
		"katakana": "epson/katakana",
		"cp928": "star/cp928"
	};
	var strings = {
		en: "The quick brown fox jumps over the lazy dog.",
		jp: "イロハニホヘト チリヌルヲ ワカヨタレソ ツネナラム",
		pt: "O próximo vôo à noite sobre o Atlântico, põe freqüentemente o único médico.",
		fr: "Les naïfs ægithales hâtifs pondant à Noël où il gèle sont sûrs d'être déçus en voyant leurs drôles d'œufs abîmés.",
		sv: "Flygande bäckasiner söka strax hwila på mjuka tuvor.",
		dk: "Quizdeltagerne spiste jordbær med fløde",
		el: "ξεσκεπάζω την ψυχοφθόρα βδελυγμία",
		tr: "Pijamalı hasta, yağız şoföre çabucak güvendi.",
		ru: "Съешь же ещё этих мягких французских булок да выпей чаю",
		hu: "Árvíztűrő tükörfúrógép",
		pl: "Pchnąć w tę łódź jeża lub ośm skrzyń fig",
		cz: "Mohu jíst sklo, neublíží mi.",
		ar: "أنا قادر على أكل الزجاج و هذا لا يؤلمني.",
		et: "Ma võin klaasi süüa, see ei tee mulle midagi.",
		lt: "Aš galiu valgyti stiklą ir jis manęs nežeidžia.",
		bg: "Мога да ям стъкло, то не ми вреди.",
		is: "Ég get etið gler án þess að meiða mig.",
		he: "אני יכול לאכול זכוכית וזה לא מזיק לי.",
		fa: ".من می توانم بدونِ احساس درد شيشه بخورم",
		uk: "Я можу їсти скло, і воно мені не зашкодить.",
		vi: "Tôi có thể ăn thủy tinh mà không hại gì.",
		kk: "қазақша",
		lv: "Es varu ēst stiklu, tas man nekaitē.",
		mt: "Nista' niekol il-ħġieġ u ma jagħmilli xejn.",
		th: "ฉันกินกระจกได้ แต่มันไม่ทำให้ฉันเจ็บ"
	};
	/** @import { Codepage } from '../generated/codepage.js' */
	/**
	* @typedef {Object} CodepageEncoding
	* @property {string} name
	* @property {string[]} [languages]
	* @property {string} [extends]
	* @property {number} [offset]
	* @property {number[]} codepoints
	*/
	/**
	* @typedef {Object} TestString
	* @property {string} language
	* @property {string} string
	*/
	/**
	* @typedef {Object} AutoEncodeFragment
	* @property {Codepage} codepage
	* @property {Uint8Array} bytes
	*/
	/**
	* A library for converting Unicode to obscure single byte codepage for use with thermal printers
	*/
	var CodepageEncoder = class {
		/**
		* Get list of supported codepages
		*
		* @return {Codepage[]}           Return an array with the supported codepages
		*
		*/
		static getEncodings() {
			return Object.keys(definitions);
		}
		/**
		* Get codepage definition
		*
		* @param  {Codepage}   codepage  The codepage, defaults to ascii when it cannot find the codepage
		* @return {CodepageEncoding}             Return an object with the codepage definition
		*
		*/
		static getEncoding(codepage) {
			if (typeof aliases[codepage] !== "undefined") codepage = aliases[codepage];
			if (typeof definitions[codepage] === "undefined") codepage = "ascii";
			if (typeof definitions[codepage].codepoints === "undefined") definitions[codepage].codepoints = this.getCodepoints(codepage, true);
			return structuredClone(definitions[codepage]);
		}
		/**
		* Get test strings for the specified codepage
		*
		* @param  {Codepage}   codepage  The codepage
		* @return {TestString[]}              Return an array with one or more objects
		*                              containing a property for the language of
		*                              the string and a property for the string itself
		*
		*/
		static getTestStrings(codepage) {
			if (typeof aliases[codepage] !== "undefined") codepage = aliases[codepage];
			if (typeof definitions[codepage] !== "undefined" && typeof definitions[codepage].languages !== "undefined") return definitions[codepage].languages.map((i) => ({
				language: i,
				string: strings[i]
			}));
			return [];
		}
		/**
		* Determine if the specified codepage is supported
		*
		* @param  {string}   codepage  The codepage
		* @return {boolean}            Return a boolean, true if the encoding is supported,
		*                              otherwise false
		*
		*/
		static supports(codepage) {
			if (typeof aliases[codepage] !== "undefined") codepage = aliases[codepage];
			if (typeof definitions[codepage] === "undefined") return false;
			return true;
		}
		/**
		* Encode a string in the specified codepage
		*
		* @param  {string}   input     Text that needs encoded to the specified codepage
		* @param  {Codepage}   codepage  The codepage
		* @return {Uint8Array}         Return an array of bytes with the encoded string
		*
		*/
		static encode(input, codepage) {
			const output = new Uint8Array(input.length);
			const definition = this.getEncoding(codepage);
			for (let c = 0; c < input.length; c++) {
				const codepoint = input.codePointAt(c);
				const position = definition.codepoints.findIndex((i) => i === codepoint);
				if (position !== -1) output[c] = position;
				else output[c] = 63;
			}
			return output;
		}
		/**
		* Encode a string in the most optimal set of codepages.
		*
		* @param  {string}   input         Text that needs encoded
		* @param  {Codepage[]}    candidates    An array of candidate codepages that are allowed to be used, ranked by importance
		* @return {AutoEncodeFragment[]}             Return an array of fragments with the encoded string
		*
		*/
		static autoEncode(input, candidates) {
			const fragments = [];
			let fragment = -1;
			let current;
			for (let c = 0; c < input.length; c++) {
				const codepoint = input.codePointAt(c);
				let available;
				let char = 0;
				if (!available && current) {
					const position = this.getEncoding(current).codepoints.findIndex((i) => i === codepoint);
					if (position !== -1) {
						available = current;
						char = position;
					}
				}
				if (!available) for (let i = 0; i < candidates.length; i++) {
					const position = this.getEncoding(candidates[i]).codepoints.findIndex((i) => i === codepoint);
					if (position !== -1) {
						available = candidates[i];
						char = position;
						break;
					}
				}
				if (!available) {
					available = current || candidates[0];
					char = 63;
				}
				if (current != available) {
					if (current) fragments[fragment].bytes = new Uint8Array(fragments[fragment].bytes);
					fragment++;
					fragments[fragment] = {
						codepage: available,
						bytes: []
					};
					current = available;
				}
				fragments[fragment].bytes.push(char);
			}
			if (current) fragments[fragment].bytes = new Uint8Array(fragments[fragment].bytes);
			return fragments;
		}
		/**
		* Get codepoints
		*
		* @param  {Codepage}   codepage         The codepage
		* @param  {boolean}  evaluateExtends  Evaluate the extends property
		* @return {number[]}                     Return an array with 256 codepoints for the specified codepage
		*
		*/
		static getCodepoints(codepage, evaluateExtends) {
			let codepoints = new Array(256);
			if (evaluateExtends) if (typeof definitions[codepage].extends === "undefined") codepoints = codepoints.fill(65533);
			else codepoints = this.getEncoding(definitions[codepage].extends).codepoints;
			if (definitions[codepage].value.length === 16) for (let i = 0; i < 16; i++) {
				if (typeof definitions[codepage].value[i] !== "object") continue;
				for (let j = 0; j < 16; j++) {
					if (typeof definitions[codepage].value[i][j] !== "number") continue;
					codepoints[i * 16 + j] = definitions[codepage].value[i][j];
				}
			}
			else {
				const offset = definitions[codepage].offset || 0;
				for (let i = 0; i < definitions[codepage].value.length; i++) {
					if (typeof definitions[codepage].value[i] !== "number") continue;
					codepoints[offset + i] = definitions[codepage].value[i];
				}
			}
			return codepoints;
		}
	};
	module.exports = CodepageEncoder;
}));
//#endregion
//#region node_modules/@canvas/image-data/index.js
var require_image_data = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var widthMap = /* @__PURE__ */ new WeakMap();
	var heightMap = /* @__PURE__ */ new WeakMap();
	var ImageData = class {
		constructor(width, height, ...args) {
			if (arguments.length < 2) throw new TypeError(`Failed to construct 'ImageData': 2 arguments required, but only ${arguments.length} present.`);
			if (typeof width === "object") {
				if (!(width instanceof Uint8ClampedArray)) throw new TypeError("Failed to construct 'ImageData': parameter 1 is not of type 'Uint8ClampedArray'.");
				if (typeof height !== "number" || height === 0) throw new Error("Failed to construct 'ImageData': The source width is zero or not a number.");
				height = height >>> 0;
				if (height * 4 > width.length) throw new Error("Failed to construct 'ImageData': The requested image size exceeds the supported range.");
				if (width.length % 4 !== 0) throw new Error("Failed to construct 'ImageData': The input data length is not a multiple of 4.");
				if (width.length % (4 * height) !== 0) throw new Error("Failed to construct 'ImageData': The input data length is not a multiple of (4 * width).");
				if (typeof args[0] !== "undefined") {
					if (typeof args[0] !== "number" || args[0] === 0) throw new Error("Failed to construct 'ImageData': The source height is zero or not a number.");
					args[0] = args[0] >>> 0;
					if (width.length % (4 * height * args[0]) !== 0) throw new Error("Failed to construct 'ImageData': The input data length is not equal to (4 * width * height).");
				}
				widthMap.set(this, height);
				heightMap.set(this, typeof args[0] !== "undefined" ? args[0] : width.byteLength / height / 4);
				Object.defineProperty(this, "data", {
					configurable: true,
					enumerable: true,
					value: width,
					writable: false
				});
			} else {
				if (typeof width !== "number" || width === 0) throw new Error("Failed to construct 'ImageData': The source width is zero or not a number.");
				width = width >>> 0;
				if (typeof height !== "number" || height === 0) throw new Error("Failed to construct 'ImageData': The source height is zero or not a number.");
				height = height >>> 0;
				if (width * height >= 1 << 30) throw new Error("Failed to construct 'ImageData': The requested image size exceeds the supported range.");
				widthMap.set(this, width);
				heightMap.set(this, height);
				Object.defineProperty(this, "data", {
					configurable: true,
					enumerable: true,
					value: new Uint8ClampedArray(width * height * 4),
					writable: false
				});
			}
		}
	};
	Object.defineProperty(ImageData.prototype, "width", {
		enumerable: true,
		configurable: true,
		get() {
			return widthMap.get(this);
		}
	});
	Object.defineProperty(ImageData.prototype, "height", {
		enumerable: true,
		configurable: true,
		get() {
			return heightMap.get(this);
		}
	});
	module.exports = ImageData;
}));
//#endregion
//#region node_modules/resize-image-data/index.js
var require_resize_image_data = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ImageData = require_image_data();
	function nearestNeighbor(src, dst) {
		let pos = 0;
		for (let y = 0; y < dst.height; y++) for (let x = 0; x < dst.width; x++) {
			const srcX = Math.floor(x * src.width / dst.width);
			let srcPos = (Math.floor(y * src.height / dst.height) * src.width + srcX) * 4;
			dst.data[pos++] = src.data[srcPos++];
			dst.data[pos++] = src.data[srcPos++];
			dst.data[pos++] = src.data[srcPos++];
			dst.data[pos++] = src.data[srcPos++];
		}
	}
	function bilinearInterpolation(src, dst) {
		function interpolate(k, kMin, kMax, vMin, vMax) {
			return Math.round((k - kMin) * vMax + (kMax - k) * vMin);
		}
		function interpolateHorizontal(offset, x, y, xMin, xMax) {
			const vMin = src.data[(y * src.width + xMin) * 4 + offset];
			if (xMin === xMax) return vMin;
			const vMax = src.data[(y * src.width + xMax) * 4 + offset];
			return interpolate(x, xMin, xMax, vMin, vMax);
		}
		function interpolateVertical(offset, x, xMin, xMax, y, yMin, yMax) {
			const vMin = interpolateHorizontal(offset, x, yMin, xMin, xMax);
			if (yMin === yMax) return vMin;
			return interpolate(y, yMin, yMax, vMin, interpolateHorizontal(offset, x, yMax, xMin, xMax));
		}
		let pos = 0;
		for (let y = 0; y < dst.height; y++) for (let x = 0; x < dst.width; x++) {
			const srcX = x * src.width / dst.width;
			const srcY = y * src.height / dst.height;
			const xMin = Math.floor(srcX);
			const yMin = Math.floor(srcY);
			const xMax = Math.min(Math.ceil(srcX), src.width - 1);
			const yMax = Math.min(Math.ceil(srcY), src.height - 1);
			dst.data[pos++] = interpolateVertical(0, srcX, xMin, xMax, srcY, yMin, yMax);
			dst.data[pos++] = interpolateVertical(1, srcX, xMin, xMax, srcY, yMin, yMax);
			dst.data[pos++] = interpolateVertical(2, srcX, xMin, xMax, srcY, yMin, yMax);
			dst.data[pos++] = interpolateVertical(3, srcX, xMin, xMax, srcY, yMin, yMax);
		}
	}
	module.exports = function resizeImageData(image, width, height, algorithm) {
		algorithm = algorithm || "bilinear-interpolation";
		let resize;
		switch (algorithm) {
			case "nearest-neighbor":
				resize = nearestNeighbor;
				break;
			case "bilinear-interpolation":
				resize = bilinearInterpolation;
				break;
			case "biliniear-interpolation":
				resize = bilinearInterpolation;
				break;
			default: throw new Error(`Unknown algorithm: ${algorithm}`);
		}
		const result = new ImageData(width, height);
		resize(image, result);
		return result;
	};
}));
//#endregion
//#region node_modules/@point-of-sale/receipt-printer-encoder/dist/receipt-printer-encoder.cjs
var require_receipt_printer_encoder = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Dither = require_canvas_dither();
	var Flatten = require_canvas_flatten();
	var CodepageEncoder = require_codepage_encoder();
	var ImageData = require_image_data();
	var resizeImageData = require_resize_image_data();
	/**
	* ESC/POS Language commands
	*/
	var LanguageEscPos = class {
		/**
		* Initialize the printer
		* @return {Array}         Array of bytes to send to the printer
		*/
		initialize() {
			return [
				{
					type: "initialize",
					payload: [27, 64]
				},
				{
					type: "character-mode",
					value: "single byte",
					payload: [28, 46]
				},
				{
					type: "font",
					value: "A",
					payload: [
						27,
						77,
						0
					]
				}
			];
		}
		/**
		* Change the font
		* @param {string} value    Font type ('A', 'B', or more)
		* @return {Array}         Array of bytes to send to the printer
		*/
		font(value) {
			return [{
				type: "font",
				value,
				payload: [
					27,
					77,
					value.charCodeAt(0) - 65
				]
			}];
		}
		/**
		* Change the alignment
		* @param {string} value    Alignment value ('left', 'center', 'right')
		* @return {Array}         Array of bytes to send to the printer
		*/
		align(value) {
			let align = 0;
			if (value === "center") align = 1;
			else if (value === "right") align = 2;
			return [{
				type: "align",
				value,
				payload: [
					27,
					97,
					align
				]
			}];
		}
		/**
		* Generate a barcode
		* @param {string} value        Value to encode
		* @param {string|number} symbology    Barcode symbology
		* @param {object} options      Configuration object
		* @return {Array}             Array of bytes to send to the printer
		*/
		barcode(value, symbology, options) {
			const result = [];
			const symbologies = {
				"upca": 0,
				"upce": 1,
				"ean13": 2,
				"ean8": 3,
				"code39": 4,
				"coda39": 4,
				"itf": 5,
				"interleaved-2-of-5": 5,
				"nw-7": 6,
				"codabar": 6,
				"code93": 72,
				"code128": 73,
				"gs1-128": 72,
				"gs1-databar-omni": 75,
				"gs1-databar-truncated": 76,
				"gs1-databar-limited": 77,
				"gs1-databar-expanded": 78,
				"code128-auto": 79
			};
			if (typeof symbology === "string" && typeof symbologies[symbology] === "undefined") throw new Error(`Symbology '${symbology}' not supported by language`);
			if (options.width < 1 || options.width > 3) throw new Error("Width must be between 1 and 3");
			let width = options.width + 1;
			if (symbology === "itf") width = options.width * 2;
			if (symbology === "gs1-128" || symbology === "gs1-databar-omni" || symbology === "gs1-databar-truncated" || symbology === "gs1-databar-limited" || symbology === "gs1-databar-expanded") width = options.width;
			result.push({
				type: "barcode",
				property: "height",
				value: options.height,
				payload: [
					29,
					104,
					options.height
				]
			}, {
				type: "barcode",
				property: "width",
				value: options.width,
				payload: [
					29,
					119,
					width
				]
			}, {
				type: "barcode",
				property: "text",
				value: options.text,
				payload: [
					29,
					72,
					options.text ? 2 : 0
				]
			});
			if (symbology == "code128" && !value.startsWith("{")) value = "{B" + value;
			if (symbology == "gs1-128") value = value.replace(/[()*]/g, "");
			const bytes = CodepageEncoder.encode(value, "ascii");
			const identifier = typeof symbology === "string" ? symbologies[symbology] : symbology;
			if (identifier > 64) result.push({
				type: "barcode",
				value: {
					symbology,
					data: value
				},
				payload: [
					29,
					107,
					identifier,
					bytes.length,
					...bytes
				]
			});
			else result.push({
				type: "barcode",
				value: {
					symbology,
					data: value
				},
				payload: [
					29,
					107,
					identifier,
					...bytes,
					0
				]
			});
			return result;
		}
		/**
		* Generate a QR code
		* @param {string} value        Value to encode
		* @param {object} options      Configuration object
		* @return {Array}             Array of bytes to send to the printer
		*/
		qrcode(value, options) {
			const result = [];
			if (typeof options.model === "number") {
				const models = {
					1: 49,
					2: 50
				};
				if (options.model in models) result.push({
					type: "qrcode",
					property: "model",
					value: options.model,
					payload: [
						29,
						40,
						107,
						4,
						0,
						49,
						65,
						models[options.model],
						0
					]
				});
				else throw new Error("Model must be 1 or 2");
			}
			if (typeof options.size !== "number") throw new Error("Size must be a number");
			if (options.size < 1 || options.size > 8) throw new Error("Size must be between 1 and 8");
			result.push({
				type: "qrcode",
				property: "size",
				value: options.size,
				payload: [
					29,
					40,
					107,
					3,
					0,
					49,
					67,
					options.size
				]
			});
			const errorlevels = {
				"l": 48,
				"m": 49,
				"q": 50,
				"h": 51
			};
			if (options.errorlevel in errorlevels) result.push({
				type: "qrcode",
				property: "errorlevel",
				value: options.errorlevel,
				payload: [
					29,
					40,
					107,
					3,
					0,
					49,
					69,
					errorlevels[options.errorlevel]
				]
			});
			else throw new Error("Error level must be l, m, q or h");
			const bytes = CodepageEncoder.encode(value, "iso8859-1");
			const length = bytes.length + 3;
			result.push({
				type: "qrcode",
				property: "data",
				value,
				payload: [
					29,
					40,
					107,
					length & 255,
					length >> 8 & 255,
					49,
					80,
					48,
					...bytes
				]
			});
			result.push({
				type: "qrcode",
				command: "print",
				payload: [
					29,
					40,
					107,
					3,
					0,
					49,
					81,
					48
				]
			});
			return result;
		}
		/**
		* Generate a PDF417 code
		* @param {string} value        Value to encode
		* @param {object} options      Configuration object
		* @return {Array}             Array of bytes to send to the printer
		*/
		pdf417(value, options) {
			const result = [];
			if (typeof options.columns !== "number") throw new Error("Columns must be a number");
			if (options.columns !== 0 && (options.columns < 1 || options.columns > 30)) throw new Error("Columns must be 0, or between 1 and 30");
			result.push({
				type: "pdf417",
				property: "columns",
				value: options.columns,
				payload: [
					29,
					40,
					107,
					3,
					0,
					48,
					65,
					options.columns
				]
			});
			if (typeof options.rows !== "number") throw new Error("Rows must be a number");
			if (options.rows !== 0 && (options.rows < 3 || options.rows > 90)) throw new Error("Rows must be 0, or between 3 and 90");
			result.push({
				type: "pdf417",
				property: "rows",
				value: options.rows,
				payload: [
					29,
					40,
					107,
					3,
					0,
					48,
					66,
					options.rows
				]
			});
			if (typeof options.width !== "number") throw new Error("Width must be a number");
			if (options.width < 2 || options.width > 8) throw new Error("Width must be between 2 and 8");
			result.push({
				type: "pdf417",
				property: "width",
				value: options.width,
				payload: [
					29,
					40,
					107,
					3,
					0,
					48,
					67,
					options.width
				]
			});
			if (typeof options.height !== "number") throw new Error("Height must be a number");
			if (options.height < 2 || options.height > 8) throw new Error("Height must be between 2 and 8");
			result.push({
				type: "pdf417",
				property: "height",
				value: options.height,
				payload: [
					29,
					40,
					107,
					3,
					0,
					48,
					68,
					options.height
				]
			});
			if (typeof options.errorlevel !== "number") throw new Error("Errorlevel must be a number");
			if (options.errorlevel < 0 || options.errorlevel > 8) throw new Error("Errorlevel must be between 0 and 8");
			result.push({
				type: "pdf417",
				property: "errorlevel",
				value: options.errorlevel,
				payload: [
					29,
					40,
					107,
					4,
					0,
					48,
					69,
					48,
					options.errorlevel + 48
				]
			});
			result.push({
				type: "pdf417",
				property: "truncated",
				value: !!options.truncated,
				payload: [
					29,
					40,
					107,
					3,
					0,
					48,
					70,
					options.truncated ? 1 : 0
				]
			});
			const bytes = CodepageEncoder.encode(value, "ascii");
			const length = bytes.length + 3;
			result.push({
				type: "pdf417",
				property: "data",
				value,
				payload: [
					29,
					40,
					107,
					length & 255,
					length >> 8 & 255,
					48,
					80,
					48,
					...bytes
				]
			});
			result.push({
				type: "pdf417",
				command: "print",
				payload: [
					29,
					40,
					107,
					3,
					0,
					48,
					81,
					48
				]
			});
			return result;
		}
		/**
		* Encode an image
		* @param {ImageData} image     ImageData object
		* @param {number} width        Width of the image
		* @param {number} height       Height of the image
		* @param {string} mode         Image encoding mode ('column' or 'raster')
		* @return {Array}             Array of bytes to send to the printer
		*/
		image(image, width, height, mode) {
			const result = [];
			const getPixel = (x, y) => x < width && y < height ? image.data[(width * y + x) * 4] > 0 ? 0 : 1 : 0;
			const getColumnData = (width, height) => {
				const data = [];
				for (let s = 0; s < Math.ceil(height / 24); s++) {
					const bytes = new Uint8Array(width * 3);
					for (let x = 0; x < width; x++) for (let c = 0; c < 3; c++) for (let b = 0; b < 8; b++) bytes[x * 3 + c] |= getPixel(x, s * 24 + b + 8 * c) << 7 - b;
					data.push(bytes);
				}
				return data;
			};
			const getRowData = (width, height) => {
				const bytes = new Uint8Array(width * height >> 3);
				for (let y = 0; y < height; y++) for (let x = 0; x < width; x = x + 8) for (let b = 0; b < 8; b++) bytes[y * (width >> 3) + (x >> 3)] |= getPixel(x + b, y) << 7 - b;
				return bytes;
			};
			if (mode == "column") {
				result.push({
					type: "line-spacing",
					value: "24 dots",
					payload: [
						27,
						51,
						36
					]
				});
				getColumnData(width, height).forEach((bytes) => {
					result.push({
						type: "image",
						property: "data",
						value: "column",
						width,
						height: 24,
						payload: [
							27,
							42,
							33,
							width & 255,
							width >> 8 & 255,
							...bytes,
							10
						]
					});
				});
				result.push({
					type: "line-spacing",
					value: "default",
					payload: [27, 50]
				});
			}
			if (mode == "raster") result.push({
				type: "image",
				command: "data",
				value: "raster",
				width,
				height,
				payload: [
					29,
					118,
					48,
					0,
					width >> 3 & 255,
					width >> 3 >> 8 & 255,
					height & 255,
					height >> 8 & 255,
					...getRowData(width, height)
				]
			});
			return result;
		}
		/**
		* Cut the paper
		* @param {string} value    Cut type ('full' or 'partial')
		* @return {Array}         Array of bytes to send to the printer
		*/
		cut(value) {
			let data = 0;
			if (value == "partial") data = 1;
			return [{
				type: "cut",
				payload: [
					29,
					86,
					data
				]
			}];
		}
		/**
		* Send a pulse to the cash drawer
		* @param {number} device   Device number
		* @param {number} on       Pulse ON time
		* @param {number} off      Pulse OFF time
		* @return {Array}         Array of bytes to send to the printer
		*/
		pulse(device, on, off) {
			if (typeof device === "undefined") device = 0;
			if (typeof on === "undefined") on = 100;
			if (typeof off === "undefined") off = 500;
			on = Math.min(500, Math.round(on / 2));
			off = Math.min(500, Math.round(off / 2));
			return [{
				type: "pulse",
				payload: [
					27,
					112,
					device ? 1 : 0,
					on & 255,
					off & 255
				]
			}];
		}
		/**
		* Enable or disable bold text
		* @param {boolean} value   Enable or disable bold text, optional, default toggles between states
		* @return {Array}         Array of bytes to send to the printer
		*/
		bold(value) {
			let data = 0;
			if (value) data = 1;
			return [
				27,
				69,
				data
			];
		}
		/**
		* Enable or disable underline text
		* @param {boolean} value   Enable or disable underline text, optional, default toggles between states
		* @return {Array}         Array of bytes to send to the printer
		*/
		underline(value) {
			let data = 0;
			if (value) data = 1;
			return [
				27,
				45,
				data
			];
		}
		/**
		* Enable or disable italic text
		* @param {boolean} value   Enable or disable italic text, optional, default toggles between states
		* @return {Array}         Array of bytes to send to the printer
		*/
		italic(value) {
			let data = 0;
			if (value) data = 1;
			return [
				27,
				52,
				data
			];
		}
		/**
		* Enable or disable inverted text
		* @param {boolean} value   Enable or disable inverted text, optional, default toggles between states
		* @return {Array}         Array of bytes to send to the printer
		*/
		invert(value) {
			let data = 0;
			if (value) data = 1;
			return [
				29,
				66,
				data
			];
		}
		/**
		* Change text size
		* @param {number} width    Width of the text (1-8)
		* @param {number} height   Height of the text (1-8)
		* @return {Array}         Array of bytes to send to the printer
		*/
		size(width, height) {
			return [
				29,
				33,
				height - 1 | width - 1 << 4
			];
		}
		/**
		* Change the codepage
		* @param {number} value    Codepage value
		* @return {Array}         Array of bytes to send to the printer
		*/
		codepage(value) {
			return [
				27,
				116,
				value
			];
		}
		/**
		* Flush the printers line buffer
		* @return {Array}         Array of bytes to send to the printer
		*/
		flush() {
			return [];
		}
	};
	/**
	* StarPRNT Language commands
	*/
	var LanguageStarPrnt = class {
		/**
		* Initialize the printer
		* @return {Array}         Array of bytes to send to the printer
		*/
		initialize() {
			return [{
				type: "initialize",
				payload: [
					27,
					64,
					24
				]
			}];
		}
		/**
		* Change the font
		* @param {string} value     Font type ('A', 'B' or 'C')
		* @return {Array}         Array of bytes to send to the printer
		*/
		font(value) {
			let type = 0;
			if (value === "B") type = 1;
			if (value === "C") type = 2;
			return [{
				type: "font",
				value,
				payload: [
					27,
					30,
					70,
					type
				]
			}];
		}
		/**
		* Change the alignment
		* @param {string} value    Alignment value ('left', 'center', 'right')
		* @return {Array}         Array of bytes to send to the printer
		*/
		align(value) {
			let align = 0;
			if (value === "center") align = 1;
			else if (value === "right") align = 2;
			return [{
				type: "align",
				value,
				payload: [
					27,
					29,
					97,
					align
				]
			}];
		}
		/**
		* Generate a barcode
		* @param {string} value        Value to encode
		* @param {string|number} symbology    Barcode symbology
		* @param {object} options      Configuration object
		* @return {Array}             Array of bytes to send to the printer
		*/
		barcode(value, symbology, options) {
			const result = [];
			const symbologies = {
				"upce": 0,
				"upca": 1,
				"ean8": 2,
				"ean13": 3,
				"code39": 4,
				"itf": 5,
				"interleaved-2-of-5": 5,
				"code128": 6,
				"code93": 7,
				"nw-7": 8,
				"codabar": 8,
				"gs1-128": 9,
				"gs1-databar-omni": 10,
				"gs1-databar-truncated": 11,
				"gs1-databar-limited": 12,
				"gs1-databar-expanded": 13
			};
			if (typeof symbology === "string" && typeof symbologies[symbology] === "undefined") throw new Error(`Symbology '${symbology}' not supported by language`);
			if (options.width < 1 || options.width > 3) throw new Error("Width must be between 1 and 3");
			if (symbology === "code128" && value.startsWith("{")) value = value.slice(2);
			const bytes = CodepageEncoder.encode(value, "ascii");
			const identifier = typeof symbology === "string" ? symbologies[symbology] : symbology;
			result.push({
				type: "barcode",
				value: {
					symbology,
					data: value,
					width: options.width,
					height: options.height,
					text: options.text
				},
				payload: [
					27,
					98,
					identifier,
					options.text ? 2 : 1,
					options.width,
					options.height,
					...bytes,
					30
				]
			});
			return result;
		}
		/**
		* Generate a QR code
		* @param {string} value        Value to encode
		* @param {object} options      Configuration object
		* @return {Array}             Array of bytes to send to the printer
		*/
		qrcode(value, options) {
			const result = [];
			const models = {
				1: 1,
				2: 2
			};
			if (options.model in models) result.push({
				type: "qrcode",
				property: "model",
				value: options.model,
				payload: [
					27,
					29,
					121,
					83,
					48,
					models[options.model]
				]
			});
			else throw new Error("Model must be 1 or 2");
			if (typeof options.size !== "number") throw new Error("Size must be a number");
			if (options.size < 1 || options.size > 8) throw new Error("Size must be between 1 and 8");
			result.push({
				type: "qrcode",
				property: "size",
				value: options.size,
				payload: [
					27,
					29,
					121,
					83,
					50,
					options.size
				]
			});
			const errorlevels = {
				"l": 0,
				"m": 1,
				"q": 2,
				"h": 3
			};
			if (options.errorlevel in errorlevels) result.push({
				type: "qrcode",
				property: "errorlevel",
				value: options.errorlevel,
				payload: [
					27,
					29,
					121,
					83,
					49,
					errorlevels[options.errorlevel]
				]
			});
			else throw new Error("Error level must be l, m, q or h");
			const bytes = CodepageEncoder.encode(value, "iso8859-1");
			const length = bytes.length;
			result.push({
				type: "qrcode",
				property: "data",
				value,
				payload: [
					27,
					29,
					121,
					68,
					49,
					0,
					length & 255,
					length >> 8 & 255,
					...bytes
				]
			});
			result.push({
				type: "qrcode",
				command: "print",
				payload: [
					27,
					29,
					121,
					80
				]
			});
			return result;
		}
		/**
		* Generate a PDF417 code
		* @param {string} value        Value to encode
		* @param {object} options      Configuration object
		* @return {Array}             Array of bytes to send to the printer
		*/
		pdf417(value, options) {
			const result = [];
			if (typeof options.columns !== "number") throw new Error("Columns must be a number");
			if (options.columns !== 0 && (options.columns < 1 || options.columns > 30)) throw new Error("Columns must be 0, or between 1 and 30");
			if (typeof options.rows !== "number") throw new Error("Rows must be a number");
			if (options.rows !== 0 && (options.rows < 3 || options.rows > 90)) throw new Error("Rows must be 0, or between 3 and 90");
			result.push({
				type: "pdf417",
				value: `rows: ${options.rows}, columns: ${options.columns}`,
				payload: [
					27,
					29,
					120,
					83,
					48,
					1,
					options.rows,
					options.columns
				]
			});
			if (typeof options.width !== "number") throw new Error("Width must be a number");
			if (options.width < 2 || options.width > 8) throw new Error("Width must be between 2 and 8");
			result.push({
				type: "pdf417",
				property: "width",
				value: options.width,
				payload: [
					27,
					29,
					120,
					83,
					50,
					options.width
				]
			});
			if (typeof options.height !== "number") throw new Error("Height must be a number");
			if (options.height < 2 || options.height > 8) throw new Error("Height must be between 2 and 8");
			result.push({
				type: "pdf417",
				property: "height",
				value: options.height,
				payload: [
					27,
					29,
					120,
					83,
					51,
					options.height
				]
			});
			if (typeof options.errorlevel !== "number") throw new Error("Errorlevel must be a number");
			if (options.errorlevel < 0 || options.errorlevel > 8) throw new Error("Errorlevel must be between 0 and 8");
			result.push({
				type: "pdf417",
				property: "errorlevel",
				value: options.errorlevel,
				payload: [
					27,
					29,
					120,
					83,
					49,
					options.errorlevel
				]
			});
			const bytes = CodepageEncoder.encode(value, "ascii");
			const length = bytes.length;
			result.push({
				type: "pdf417",
				property: "data",
				value,
				payload: [
					27,
					29,
					120,
					68,
					length & 255,
					length >> 8 & 255,
					...bytes
				]
			});
			result.push({
				type: "pdf417",
				command: "print",
				payload: [
					27,
					29,
					120,
					80
				]
			});
			return result;
		}
		/**
		* Encode an image
		* @param {ImageData} image     ImageData object
		* @param {number} width        Width of the image
		* @param {number} height       Height of the image
		* @param {string} mode         Image encoding mode (value is ignored)
		* @return {Array}             Array of bytes to send to the printer
		*/
		image(image, width, height, mode) {
			const result = [];
			const getPixel = (x, y) => typeof image.data[(width * y + x) * 4] === "undefined" || image.data[(width * y + x) * 4] > 0 ? 0 : 1;
			result.push({
				type: "line-spacing",
				value: "24 dots",
				payload: [27, 48]
			});
			for (let s = 0; s < height / 24; s++) {
				const y = s * 24;
				const bytes = new Uint8Array(width * 3);
				for (let x = 0; x < width; x++) {
					const i = x * 3;
					bytes[i] = getPixel(x, y + 0) << 7 | getPixel(x, y + 1) << 6 | getPixel(x, y + 2) << 5 | getPixel(x, y + 3) << 4 | getPixel(x, y + 4) << 3 | getPixel(x, y + 5) << 2 | getPixel(x, y + 6) << 1 | getPixel(x, y + 7);
					bytes[i + 1] = getPixel(x, y + 8) << 7 | getPixel(x, y + 9) << 6 | getPixel(x, y + 10) << 5 | getPixel(x, y + 11) << 4 | getPixel(x, y + 12) << 3 | getPixel(x, y + 13) << 2 | getPixel(x, y + 14) << 1 | getPixel(x, y + 15);
					bytes[i + 2] = getPixel(x, y + 16) << 7 | getPixel(x, y + 17) << 6 | getPixel(x, y + 18) << 5 | getPixel(x, y + 19) << 4 | getPixel(x, y + 20) << 3 | getPixel(x, y + 21) << 2 | getPixel(x, y + 22) << 1 | getPixel(x, y + 23);
				}
				result.push({
					type: "image",
					property: "data",
					value: "column",
					width,
					height: 24,
					payload: [
						27,
						88,
						width & 255,
						width >> 8 & 255,
						...bytes,
						10,
						13
					]
				});
			}
			result.push({
				type: "line-spacing",
				value: "default",
				payload: [
					27,
					122,
					1
				]
			});
			return result;
		}
		/**
		* Cut the paper
		* @param {string} value    Cut type ('full' or 'partial')
		* @return {Array}         Array of bytes to send to the printer
		*/
		cut(value) {
			let data = 0;
			if (value == "partial") data = 1;
			return [{
				type: "cut",
				payload: [
					27,
					100,
					data
				]
			}];
		}
		/**
		* Send a pulse to the cash drawer
		* @param {number} device   Device number
		* @param {number} on       Pulse ON time
		* @param {number} off      Pulse OFF time
		* @return {Array}         Array of bytes to send to the printer
		*/
		pulse(device, on, off) {
			if (typeof device === "undefined") device = 0;
			if (typeof on === "undefined") on = 200;
			if (typeof off === "undefined") off = 200;
			on = Math.min(127, Math.round(on / 10));
			off = Math.min(127, Math.round(off / 10));
			return [{
				type: "pulse",
				payload: [
					27,
					7,
					on & 255,
					off & 255,
					device ? 26 : 7
				]
			}];
		}
		/**
		* Enable or disable bold text
		* @param {boolean} value   Enable or disable bold text, optional, default toggles between states
		* @return {Array}         Array of bytes to send to the printer
		*/
		bold(value) {
			let data = 70;
			if (value) data = 69;
			return [27, data];
		}
		/**
		* Enable or disable underline text
		* @param {boolean} value   Enable or disable underline text, optional, default toggles between states
		* @return {Array}         Array of bytes to send to the printer
		*/
		underline(value) {
			let data = 0;
			if (value) data = 1;
			return [
				27,
				45,
				data
			];
		}
		/**
		* Enable or disable italic text
		* @param {boolean} value   Enable or disable italic text, optional, default toggles between states
		* @return {Array}         Array of bytes to send to the printer
		*/
		italic(value) {
			return [];
		}
		/**
		* Enable or disable inverted text
		* @param {boolean} value   Enable or disable inverted text, optional, default toggles between states
		* @return {Array}         Array of bytes to send to the printer
		*/
		invert(value) {
			let data = 53;
			if (value) data = 52;
			return [27, data];
		}
		/**
		* Change text size
		* @param {number} width    Width of the text (1-8)
		* @param {number} height   Height of the text (1-8)
		* @return {Array}         Array of bytes to send to the printer
		*/
		size(width, height) {
			return [
				27,
				105,
				height - 1,
				width - 1
			];
		}
		/**
		* Change the codepage
		* @param {number} value    Codepage value
		* @return {Array}         Array of bytes to send to the printer
		*/
		codepage(value) {
			return [
				27,
				29,
				116,
				value
			];
		}
		/**
		* Flush the printers line buffer
		* @return {Array}         Array of bytes to send to the printer
		*/
		flush() {
			return [{
				type: "print-mode",
				value: "page",
				payload: [
					27,
					29,
					80,
					48
				]
			}, {
				type: "print-mode",
				value: "line",
				payload: [
					27,
					29,
					80,
					49
				]
			}];
		}
	};
	/**
	* Store and manage text styles
	*/
	var TextStyle = class {
		#default = {
			bold: false,
			italic: false,
			underline: false,
			invert: false,
			width: 1,
			height: 1
		};
		#current;
		#callback;
		/**
		* Create a new TextStyle object
		*
		* @param  {object}   options   Object containing configuration options
		*/
		constructor(options) {
			this.#current = structuredClone(this.#default);
			this.#callback = options.callback || (() => {});
		}
		/**
		* Return commands to get to the default style from the current style
		*
		* @return {array}   Array of modified properties
		*/
		store() {
			const result = [];
			const properties = /* @__PURE__ */ new Map();
			for (const property in this.#current) if (this.#current[property] !== this.#default[property]) if (property === "width" || property === "height") properties.set("size", {
				width: this.#default.width,
				height: this.#default.height
			});
			else properties.set(property, this.#default[property]);
			for (const property of properties) result.push({
				type: "style",
				property: property[0],
				value: property[1]
			});
			return result;
		}
		/**
		* Return commands to get to the current style from the default style
		*
		* @return {array}   Array of modified properties
		*/
		restore() {
			const result = [];
			const properties = /* @__PURE__ */ new Map();
			for (const property in this.#current) if (this.#current[property] !== this.#default[property]) if (property === "width" || property === "height") properties.set("size", {
				width: this.#current.width,
				height: this.#current.height
			});
			else properties.set(property, this.#current[property]);
			for (const property of properties) result.push({
				type: "style",
				property: property[0],
				value: property[1]
			});
			return result;
		}
		/**
		* Set the bold property
		*
		* @param  {boolean}   value   Is bold enabled, or not?
		*/
		set bold(value) {
			if (value !== this.#current.bold) {
				this.#current.bold = value;
				this.#callback({
					type: "style",
					property: "bold",
					value
				});
			}
		}
		/**
		* Get the bold property
		*
		* @return {boolean}   Is bold enabled, or not?
		*/
		get bold() {
			return this.#current.bold;
		}
		/**
		* Set the italic property
		*
		* @param  {boolean}   value   Is italic enabled, or not?
		*/
		set italic(value) {
			if (value !== this.#current.italic) {
				this.#current.italic = value;
				this.#callback({
					type: "style",
					property: "italic",
					value
				});
			}
		}
		/**
		* Get the italic property
		*
		* @return {boolean}   Is italic enabled, or not?
		*/
		get italic() {
			return this.#current.italic;
		}
		/**
		* Set the underline property
		*
		* @param  {boolean}   value   Is underline enabled, or not?
		*/
		set underline(value) {
			if (value !== this.#current.underline) {
				this.#current.underline = value;
				this.#callback({
					type: "style",
					property: "underline",
					value
				});
			}
		}
		/**
		* Get the underline property
		*
		* @return {boolean}   Is underline enabled, or not?
		*/
		get underline() {
			return this.#current.underline;
		}
		/**
		* Set the invert property
		*
		* @param  {boolean}   value   Is invert enabled, or not?
		*/
		set invert(value) {
			if (value !== this.#current.invert) {
				this.#current.invert = value;
				this.#callback({
					type: "style",
					property: "invert",
					value
				});
			}
		}
		/**
		* Get the invert property
		*
		* @return {boolean}   Is invert enabled, or not?
		*/
		get invert() {
			return this.#current.invert;
		}
		/**
		* Set the width property
		*
		* @param  {number}   value   The width of a character
		*/
		set width(value) {
			if (value !== this.#current.width) {
				this.#current.width = value;
				this.#callback({
					type: "style",
					property: "size",
					value: {
						width: this.#current.width,
						height: this.#current.height
					}
				});
			}
		}
		/**
		* Get the width property
		*
		* @return {number}   The width of a character
		*/
		get width() {
			return this.#current.width;
		}
		/**
		* Set the height property
		*
		* @param  {number}   value   The height of a character
		*/
		set height(value) {
			if (value !== this.#current.height) {
				this.#current.height = value;
				this.#callback({
					type: "style",
					property: "size",
					value: {
						width: this.#current.width,
						height: this.#current.height
					}
				});
			}
		}
		/**
		* Get the height property
		*
		* @return {number}   The height of a character
		*/
		get height() {
			return this.#current.height;
		}
	};
	/**
	* Wrap text into lines of a specified width.
	*/
	var TextWrap = class {
		/**
		* Static function to wrap text into lines of a specified width.
		*
		* @param  {string}   value     Text to wrap
		* @param  {object}   options   Object containing configuration options
		* @return {array}              Array of lines
		*/
		static wrap(value, options) {
			const result = [];
			let line = [];
			let length = options.indent || 0;
			const width = options.width || 1;
			const columns = options.columns || 42;
			const lines = String(value).split(/\r\n|\n/g);
			for (const value of lines) {
				const chunks = value.match(/[^\s-]+?-\b|\S+|\s+|\r\n?|\n/g) || ["~~empty~~"];
				for (const chunk of chunks) {
					if (chunk === "~~empty~~") {
						result.push(line);
						line = [];
						length = 0;
						continue;
					}
					if (length + chunk.length * width > columns) {
						if (chunk.length * width > columns) {
							const remaining = columns - length;
							const letters = chunk.split("");
							let piece;
							const pieces = [];
							if (remaining > 8 * width) {
								piece = letters.splice(0, Math.floor(remaining / width)).join("");
								line.push(piece);
								result.push(line);
								line = [];
								length = 0;
							}
							while ((piece = letters.splice(0, Math.floor(columns / width))).length) pieces.push(piece.join(""));
							for (const piece of pieces) {
								if (length + piece.length * width > columns) {
									result.push(line);
									line = [];
									length = 0;
								}
								line.push(piece);
								length += piece.length * width;
							}
							continue;
						}
						result.push(line);
						line = [];
						length = 0;
					}
					if (chunk.match(/\s+/) && length == 0) continue;
					line.push(chunk);
					length += chunk.length * width;
				}
				if (line.length > 0) {
					result.push(line);
					line = [];
					length = 0;
				}
			}
			for (let i = 0; i < result.length; i++) {
				result[i] = result[i].join("");
				if (i < result.length - 1) result[i] = result[i].trimEnd();
			}
			return result;
		}
	};
	/**
	* Compose lines of text and commands
	*/
	var LineComposer = class {
		#embedded;
		#columns;
		#align;
		#callback;
		#cursor = 0;
		#stored;
		#buffer = [];
		/**
		* Create a new LineComposer object
		*
		* @param  {object}   options   Object containing configuration options
		*/
		constructor(options) {
			this.#embedded = options.embedded || false;
			this.#columns = options.columns || 42;
			this.#align = options.align || "left";
			this.#callback = options.callback || (() => {});
			this.style = new TextStyle({ callback: (value) => {
				this.add(value, 0);
			} });
			this.#stored = this.style.store();
		}
		/**
		* Add text to the line, potentially wrapping it
		*
		* @param  {string}   value   Text to add to the line
		* @param  {number}   codepage   Codepage to use for the text
		*/
		text(value, codepage) {
			const lines = TextWrap.wrap(value, {
				columns: this.#columns,
				width: this.style.width,
				indent: this.#cursor
			});
			for (let i = 0; i < lines.length; i++) if (lines[i].length) {
				this.add({
					type: "text",
					value: lines[i],
					codepage
				}, lines[i].length * this.style.width);
				if (i < lines.length - 1) this.flush();
			} else this.flush({ forceNewline: true });
		}
		/**
		* Add spaces to the line
		*
		* @param {number} size Number of spaces to add to the line
		*/
		space(size) {
			this.add({
				type: "space",
				size
			}, size);
		}
		/**
		* Add raw bytes to to the line
		*
		* @param  {array}   value   Array of bytes to add to the line
		* @param  {number}  length  Length in characters of the value
		*/
		raw(value, length) {
			this.add({
				type: "raw",
				payload: value
			}, length || 0);
		}
		/**
		* Add an item to the line buffer, potentially flushing it
		*
		* @param  {object}   value   Item to add to the line buffer
		* @param  {number}   length  Length in characters of the value
		*/
		add(value, length) {
			if (value instanceof Array) {
				for (const item of value) this.add(item);
				this.#cursor += length || 0;
				return;
			}
			length = length || 0;
			if (length + this.#cursor > this.#columns) this.flush();
			this.#cursor += length;
			this.#buffer = this.#buffer.concat(value);
		}
		/**
		* Move the cursor to the end of the line, forcing a flush
		* with the next item to add to the line buffer
		*/
		end() {
			this.#cursor = this.#columns;
		}
		/**
		* Fetch the contents of line buffer
		*
		* @param  {options}   options   Options for flushing the buffer
		* @return {array}               Array of items in the line buffer
		*/
		fetch(options) {
			if (this.#cursor === 0 && !options.forceNewline && !options.forceFlush) return [];
			const align = {
				current: this.#align,
				next: null
			};
			for (let i = 0; i < this.#buffer.length - 1; i++) if (this.#buffer[i].type === "align" && !this.#buffer[i].payload) align.current = this.#buffer[i].value;
			if (this.#buffer.length) {
				const last = this.#buffer[this.#buffer.length - 1];
				if (last.type === "align" && !last.payload) align.next = last.value;
			}
			this.#align = align.current;
			const buffer = this.#buffer.filter((item) => item.type !== "align" || item.payload);
			let result = [];
			const restore = this.style.restore();
			const store = this.style.store();
			if (this.#cursor === 0 && (options.ignoreAlignment || !this.#embedded)) result = this.#merge([
				...this.#stored,
				...buffer,
				...store
			]);
			else {
				if (this.#align === "right") {
					let last;
					for (let i = buffer.length - 1; i >= 0; i--) if (buffer[i].type === "text" || buffer[i].type === "space") {
						last = i;
						break;
					}
					if (typeof last === "number") {
						if (buffer[last].type === "space" && buffer[last].size > this.style.width) {
							buffer[last].size -= this.style.width;
							this.#cursor -= this.style.width;
						}
						if (buffer[last].type === "text" && buffer[last].value.endsWith(" ")) {
							buffer[last].value = buffer[last].value.slice(0, -1);
							this.#cursor -= this.style.width;
						}
					}
					result = this.#merge([
						{
							type: "space",
							size: this.#columns - this.#cursor
						},
						...this.#stored,
						...buffer,
						...store
					]);
				}
				if (this.#align === "center") {
					const left = this.#columns - this.#cursor >> 1;
					result = this.#merge([
						{
							type: "space",
							size: left
						},
						...this.#stored,
						...buffer,
						...store,
						{
							type: "space",
							size: this.#embedded ? this.#columns - this.#cursor - left : 0
						}
					]);
				}
				if (this.#align === "left") result = this.#merge([
					...this.#stored,
					...buffer,
					...store,
					{
						type: "space",
						size: this.#embedded ? this.#columns - this.#cursor : 0
					}
				]);
			}
			this.#stored = restore;
			this.#buffer = [];
			this.#cursor = 0;
			if (result.length === 0 && options.forceNewline) result.push({ type: "empty" });
			if (align.next) this.#align = align.next;
			return result;
		}
		/**
		* Flush the contents of the line buffer
		*
		* @param  {options}   options   Options for flushing the buffer
		*/
		flush(options) {
			options = Object.assign({
				forceNewline: false,
				forceFlush: false,
				ignoreAlignment: false
			}, options || {});
			const result = this.fetch(options);
			if (result.length) this.#callback(result);
		}
		/**
		* Merge text items and spaces in the line buffer
		*
		* @param  {array}   items   Array of items
		* @return {array}           Array of merged items
		*/
		#merge(items) {
			const result = [];
			let last = -1;
			for (let item of items) {
				if (item.type === "space") {
					if (item.size === 0) continue;
					item = {
						type: "text",
						value: " ".repeat(item.size),
						codepage: null
					};
				}
				if (item.type === "text") {
					if (last >= 0 && result[last].type === "text" && (result[last].codepage === item.codepage || result[last].codepage === null || item.codepage === null)) {
						result[last].value += item.value;
						result[last].codepage = result[last].codepage || item.codepage;
						continue;
					}
					result.push(item);
					last++;
				} else if (item.type === "style" && item.property === "size") {
					if (last >= 0 && result[last].type === "style" && result[last].property === "size") {
						result[last].value = item.value;
						continue;
					}
					result.push(item);
					last++;
				} else {
					result.push(item);
					last++;
				}
			}
			return result;
		}
		/**
		* Get the current position of the cursor
		*
		* @return {number}   Current position of the cursor
		*/
		get cursor() {
			return this.#cursor;
		}
		/**
		* Set the alignment of the current line
		*
		* @param  {string}   value   Text alignment, can be 'left', 'center', or 'right'
		*/
		set align(value) {
			this.add({
				type: "align",
				value
			}, 0);
		}
		/**
		* Get the alignment of the current line
		*
		* @return {string}   Text alignment, can be 'left', 'center', or 'right'
		*/
		get align() {
			let align = this.#align;
			for (let i = 0; i < this.#buffer.length; i++) if (this.#buffer[i].type === "align") align = this.#buffer[i].value;
			return align;
		}
		/**
		* Set the number of columns of the current line
		*
		* @param  {number}   value   columns of the line
		*/
		set columns(value) {
			this.#columns = value;
		}
		/**
		* Get the number of columns of the current line
		*
		* @return {number}   columns of the line
		*/
		get columns() {
			return this.#columns;
		}
	};
	var codepageMappings = {
		"esc-pos": {
			"bixolon/legacy": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				"cp858"
			],
			"bixolon": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				"windows1252",
				"cp866",
				"cp852",
				"cp858",
				,
				"cp862",
				"cp864",
				"thai42",
				"windows1253",
				"windows1254",
				"windows1257",
				,
				"windows1251",
				"cp737",
				"cp775",
				"thai14",
				"bixolon/hebrew",
				"windows1255",
				"thai11",
				"thai18",
				"cp885",
				"cp857",
				"iso8859-7",
				"thai16",
				"windows1256",
				"windows1258",
				"khmer",
				,
				,
				,
				"bixolon/cp866",
				"windows1250",
				,
				"tcvn3",
				"tcvn3capitals",
				"viscii"
			],
			"citizen": [
				"cp437",
				"epson/katakana",
				"cp858",
				"cp860",
				"cp863",
				"cp865",
				"cp852",
				"cp866",
				"cp857",
				,
				,
				,
				,
				,
				,
				,
				"windows1252",
				,
				,
				,
				,
				"thai11",
				,
				,
				,
				,
				"thai13",
				,
				,
				,
				"tcvn3",
				"tcvn3capitals",
				"windows1258",
				,
				,
				,
				,
				,
				,
				,
				"cp864"
			],
			"epson/legacy": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				"windows1252",
				"cp866",
				"cp852",
				"cp858"
			],
			"epson": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				,
				,
				,
				,
				,
				"cp851",
				"cp853",
				"cp857",
				"cp737",
				"iso8859-7",
				"windows1252",
				"cp866",
				"cp852",
				"cp858",
				"thai42",
				"thai11",
				,
				,
				,
				,
				"thai13",
				,
				,
				,
				"tcvn3",
				"tcvn3capitals",
				"cp720",
				"cp775",
				"cp855",
				"cp861",
				"cp862",
				"cp864",
				"cp869",
				"epson/iso8859-2",
				"iso8859-15",
				"cp1098",
				"cp774",
				"cp772",
				"cp1125",
				"windows1250",
				"windows1251",
				"windows1253",
				"windows1254",
				"windows1255",
				"windows1256",
				"windows1257",
				"windows1258",
				"rk1048"
			],
			"fujitsu": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				,
				,
				"cp857",
				,
				,
				,
				,
				,
				,
				,
				"windows1252",
				"cp866",
				"cp852",
				"cp858",
				,
				,
				,
				,
				,
				,
				"thai13",
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				"cp864"
			],
			"hp": [
				"cp437",
				"cp850",
				"cp852",
				"cp860",
				"cp863",
				"cp865",
				"cp858",
				"cp866",
				"windows1252",
				"cp862",
				"cp737",
				"cp874",
				"cp857",
				"windows1251",
				"windows1255",
				"rk1048"
			],
			"metapace": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				"cp858"
			],
			"mpt": [
				"cp437",
				,
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				"windows1251",
				"cp866",
				"cp3021",
				"cp3012"
			],
			"pos-5890": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				"iso8859-1",
				,
				"cp862",
				,
				,
				,
				,
				,
				,
				,
				"windows1252",
				"cp866",
				"cp852",
				"cp858",
				,
				,
				,
				"windows1251",
				"cp737",
				"windows1257",
				,
				"windows1258",
				"cp864",
				,
				,
				,
				"windows1255",
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				"cp861",
				,
				,
				,
				"cp855",
				"cp857",
				,
				,
				,
				"cp851",
				"cp869",
				,
				"cp772",
				"cp774",
				,
				,
				"windows1250",
				,
				"cp3840",
				,
				"cp3843",
				"cp3844",
				"cp3845",
				"cp3846",
				"cp3847",
				"cp3848",
				,
				"cp771",
				"cp3001",
				"cp3002",
				"cp3011",
				"cp3012",
				,
				"cp3041",
				"windows1253",
				"windows1254",
				"windows1256",
				"cp720",
				,
				"cp775"
			],
			"pos-8360": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				"iso8859-1",
				"windows1253",
				"cp862",
				,
				,
				,
				,
				,
				,
				,
				"windows1252",
				"cp866",
				"cp852",
				"cp858",
				,
				"latvian",
				,
				"windows1251",
				"cp737",
				"windows1257",
				,
				"windows1258",
				"cp864",
				,
				,
				"pos8360/hebrew",
				"windows1255",
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				"cp861",
				,
				,
				,
				"cp855",
				"cp857",
				,
				,
				,
				"cp851",
				"cp869",
				,
				"cp772",
				"cp774",
				,
				,
				"windows1250",
				,
				"cp3840",
				,
				"cp3843",
				"cp3844",
				"cp3845",
				"cp3846",
				"cp3847",
				"cp3848",
				,
				"cp771",
				"cp3001",
				"cp3002",
				"cp3011",
				"cp3012",
				,
				,
				,
				"windows1254",
				"windows1256",
				"cp720",
				,
				"cp775"
			],
			"star": [
				"cp437",
				"star/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				,
				,
				,
				,
				,
				,
				,
				,
				,
				,
				"windows1252",
				"cp866",
				"cp852",
				"cp858",
				"thai42",
				"thai11",
				"thai13",
				"thai14",
				"thai16",
				,
				"thai18"
			],
			"xprinter": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				"iso8859-1",
				"windows1253",
				"xprinter/hebrew",
				"cp3012",
				,
				"windows1255",
				,
				,
				,
				,
				"windows1252",
				"cp866",
				"cp852",
				"cp858",
				,
				"latvian",
				"cp864",
				"windows1251",
				"cp737",
				"windows1257",
				,
				,
				,
				,
				,
				,
				,
				"windows1256"
			],
			"youku": [
				"cp437",
				"epson/katakana",
				"cp850",
				"cp860",
				"cp863",
				"cp865",
				"windows1251",
				"cp866",
				"cp3021",
				"cp3012",
				,
				,
				,
				,
				,
				"cp862",
				"windows1252",
				,
				"cp852",
				"cp858",
				,
				,
				"cp864",
				"iso8859-1",
				"cp737",
				"windows1257",
				,
				,
				"cp855",
				"cp857",
				"windows1250",
				"cp775",
				"windows1254",
				"windows1255",
				"windows1256",
				"windows1258",
				,
				,
				"iso8859-1",
				,
				,
				,
				,
				,
				"iso8859-15",
				,
				,
				"cp874"
			]
		},
		"star-prnt": { "star": [
			"star/standard",
			"cp437",
			"star/katakana",
			,
			"cp858",
			"cp852",
			"cp860",
			"cp861",
			"cp863",
			"cp865",
			"cp866",
			"cp855",
			"cp857",
			"cp862",
			"cp864",
			"cp737",
			"cp851",
			"cp869",
			"star/cp928",
			"cp772",
			"cp774",
			"star/cp874",
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			"windows1252",
			"windows1250",
			"windows1251",
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			,
			"cp3840",
			"cp3841",
			"cp3843",
			"cp3844",
			"cp3845",
			"cp3846",
			"cp3847",
			"cp3848",
			"cp1001",
			"cp771",
			"cp3001",
			"cp3002",
			"cp3011",
			"cp3012",
			"cp3021",
			"cp3041"
		] }
	};
	codepageMappings["star-line"] = codepageMappings["star-prnt"];
	codepageMappings["esc-pos"]["zijang"] = codepageMappings["esc-pos"]["pos-5890"];
	var printerDefinitions = {
		"bixolon-srp350": {
			vendor: "Bixolon",
			model: "SRP-350",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "bixolon/legacy",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: false,
					models: []
				},
				pdf417: { supported: false },
				cutter: { feed: 4 }
			}
		},
		"bixolon-srp350iii": {
			vendor: "Bixolon",
			model: "SRP-350III",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "bixolon",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					},
					C: {
						size: "9x24",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"citizen-ct-s310ii": {
			vendor: "Citizen",
			model: "CT-S310II",
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "citizen",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x24",
						columns: 64
					},
					C: {
						size: "8x16",
						columns: 72
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 3 }
			}
		},
		"epson-tm-m30ii": {
			vendor: "Epson",
			model: "TM-m30II",
			interfaces: { usb: { productName: "TM-m30II" } },
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "10x24",
						columns: 57
					},
					C: {
						size: "9x17",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded",
						"code128-auto"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-m30iii": {
			vendor: "Epson",
			model: "TM-m30III",
			interfaces: { usb: { productName: "TM-m30III" } },
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "10x24",
						columns: 57
					},
					C: {
						size: "9x17",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded",
						"code128-auto"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-p20ii": {
			vendor: "Epson",
			model: "TM-P20II",
			media: {
				dpi: 203,
				width: 58
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 32
					},
					B: {
						size: "9x24",
						columns: 42
					},
					C: {
						size: "9x17",
						columns: 42
					},
					D: {
						size: "10x24",
						columns: 38
					},
					E: {
						size: "8x16",
						columns: 48
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded",
						"code128-auto"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				images: { mode: "raster" },
				cutter: { feed: 3 }
			}
		},
		"epson-tm-t20ii": {
			vendor: "Epson",
			model: "TM-T20II",
			interfaces: { usb: { productName: "TM-T20II" } },
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x17",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t20iii": {
			vendor: "Epson",
			model: "TM-T20III",
			interfaces: { usb: { productName: "TM-T20III" } },
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x17",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t20iv": {
			vendor: "Epson",
			model: "TM-T20IV",
			interfaces: { usb: { productName: "TM-T20IV" } },
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x17",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded",
						"code128-auto"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t70": {
			vendor: "Epson",
			model: "TM-T70",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson/legacy",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				images: { mode: "raster" },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t70ii": {
			vendor: "Epson",
			model: "TM-T70II",
			"interface": { usb: { productName: "TM-T70II" } },
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				images: { mode: "raster" },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t88ii": {
			vendor: "Epson",
			model: "TM-T88II",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson/legacy",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t88iii": {
			vendor: "Epson",
			model: "TM-T88III",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson/legacy",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t88iv": {
			vendor: "Epson",
			model: "TM-T88IV",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson/legacy",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t88v": {
			vendor: "Epson",
			model: "TM-T88V",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t88vi": {
			vendor: "Epson",
			model: "TM-T88VI",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"epson-tm-t88vii": {
			vendor: "Epson",
			model: "TM-T88VII",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "epson",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded",
						"code128-auto"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"fujitsu-fp1000": {
			vendor: "Fujitsu",
			model: "FP-1000",
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "fujitsu",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x24",
						columns: 56
					},
					C: {
						size: "8x16",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: false },
				cutter: { feed: 4 }
			}
		},
		"hp-a779": {
			vendor: "HP",
			model: "A779",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "hp",
				newline: "\n",
				fonts: { A: {
					size: "12x24",
					columns: 44
				} },
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: {
					supported: false,
					fallback: {
						type: "barcode",
						symbology: 75
					}
				},
				cutter: { feed: 4 }
			}
		},
		"metapace-t1": {
			vendor: "Metapace",
			model: "T-1",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "metapace",
				fonts: {
					A: {
						size: "12x24",
						columns: 42
					},
					B: {
						size: "9x17",
						columns: 56
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: false,
					models: []
				},
				pdf417: { supported: false },
				cutter: { feed: 4 }
			}
		},
		"mpt-ii": {
			vendor: "",
			model: "MPT-II",
			media: {
				dpi: 180,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "mpt",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x17",
						columns: 64
					},
					C: {
						size: "0x0",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: []
				},
				pdf417: { supported: false }
			}
		},
		"pos-5890": {
			vendor: "",
			model: "POS-5890",
			media: {
				dpi: 203,
				width: 58
			},
			capabilities: {
				language: "esc-pos",
				codepages: "pos-5890",
				fonts: {
					A: {
						size: "12x24",
						columns: 32
					},
					B: {
						size: "9x17",
						columns: 42
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["2"]
				},
				pdf417: { supported: true },
				images: { mode: "raster" },
				cutter: { feed: 1 }
			}
		},
		"pos-8360": {
			vendor: "",
			model: "POS-8360",
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "pos-8360",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x17",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["2"]
				},
				pdf417: { supported: true },
				images: { mode: "raster" },
				cutter: { feed: 4 }
			}
		},
		"star-mc-print2": {
			vendor: "Star",
			model: "mC-Print2",
			interfaces: { usb: { productName: "mC-Print2" } },
			media: {
				dpi: 203,
				width: 58
			},
			capabilities: {
				language: "star-prnt",
				codepages: "star",
				fonts: {
					A: {
						size: "12x24",
						columns: 32
					},
					B: {
						size: "9x24",
						columns: 42
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 3 }
			}
		},
		"star-mpop": {
			vendor: "Star",
			model: "mPOP",
			interfaces: { usb: { productName: "mPOP" } },
			media: {
				dpi: 203,
				width: 58
			},
			capabilities: {
				language: "star-prnt",
				codepages: "star",
				fonts: {
					A: {
						size: "12x24",
						columns: 32
					},
					B: {
						size: "9x24",
						columns: 42
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 3 }
			}
		},
		"star-sm-l200": {
			vendor: "Star",
			model: "SM-L200",
			media: {
				dpi: 203,
				width: 58
			},
			capabilities: {
				language: "star-prnt",
				codepages: "star",
				fonts: {
					A: {
						size: "12x24",
						columns: 32
					},
					B: {
						size: "9x24",
						columns: 42
					},
					C: {
						size: "9x17",
						columns: 42
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["2"]
				},
				pdf417: { supported: true }
			}
		},
		"star-tsp100iii": {
			vendor: "Star",
			model: "TSP100III",
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "star-prnt",
				codepages: "star",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x24",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 3 }
			}
		},
		"star-tsp100iv": {
			vendor: "Star",
			model: "TSP100IV",
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "star-prnt",
				codepages: "star",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x24",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 3 }
			}
		},
		"star-tsp650": {
			vendor: "Star",
			model: "TSP650",
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "star-line",
				codepages: "star",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x24",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: false,
					models: []
				},
				pdf417: { supported: false },
				cutter: { feed: 3 }
			}
		},
		"star-tsp650ii": {
			vendor: "Star",
			model: "TSP650II",
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "star-line",
				codepages: "star",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x24",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-128",
						"gs1-databar-omni",
						"gs1-databar-truncated",
						"gs1-databar-limited",
						"gs1-databar-expanded"
					]
				},
				qrcode: {
					supported: true,
					models: ["1", "2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 3 }
			}
		},
		"xprinter-xp-n160ii": {
			vendor: "Xprinter",
			model: "XP-N160II",
			interfaces: { usb: { productName: "Printer-80\0" } },
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "xprinter",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x17",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-128"
					]
				},
				qrcode: {
					supported: true,
					models: ["2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"xprinter-xp-t80q": {
			vendor: "Xprinter",
			model: "XP-T80Q",
			media: {
				dpi: 203,
				width: 80
			},
			capabilities: {
				language: "esc-pos",
				codepages: "xprinter",
				fonts: {
					A: {
						size: "12x24",
						columns: 48
					},
					B: {
						size: "9x17",
						columns: 64
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"upce",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128",
						"gs1-128"
					]
				},
				qrcode: {
					supported: true,
					models: ["2"]
				},
				pdf417: { supported: true },
				cutter: { feed: 4 }
			}
		},
		"youku-58t": {
			vendor: "Youku",
			model: "58T",
			media: {
				dpi: 203,
				width: 58
			},
			capabilities: {
				language: "esc-pos",
				codepages: "youku",
				fonts: {
					A: {
						size: "12x24",
						columns: 32
					},
					B: {
						size: "9x24",
						columns: 42
					}
				},
				barcodes: {
					supported: true,
					symbologies: [
						"upca",
						"ean13",
						"ean8",
						"code39",
						"itf",
						"codabar",
						"code93",
						"code128"
					]
				},
				qrcode: {
					supported: true,
					models: ["2"]
				},
				pdf417: { supported: false }
			}
		}
	};
	module.exports = class ReceiptPrinterEncoder {
		#options = {};
		#queue = [];
		#language;
		#composer;
		#printerCapabilities = {
			"fonts": {
				"A": {
					size: "12x24",
					columns: 42
				},
				"B": {
					size: "9x24",
					columns: 56
				}
			},
			"barcodes": {
				"supported": true,
				"symbologies": [
					"upca",
					"upce",
					"ean13",
					"ean8",
					"code39",
					"itf",
					"codabar",
					"code93",
					"code128",
					"gs1-databar-omni",
					"gs1-databar-truncated",
					"gs1-databar-limited",
					"gs1-databar-expanded"
				]
			},
			"qrcode": {
				"supported": true,
				"models": ["1", "2"]
			},
			"pdf417": { "supported": true }
		};
		#codepageMapping = {};
		#codepageCandidates = [];
		#codepage = "cp437";
		#state = {
			"codepage": 0,
			"font": "A"
		};
		/**
		* Create a new object
		*
		* @param  {object}   options   Object containing configuration options
		*/
		constructor(options) {
			options = options || {};
			const defaults = {
				columns: 42,
				language: "esc-pos",
				imageMode: "column",
				feedBeforeCut: 0,
				newline: "\n\r",
				codepageMapping: "epson",
				codepageCandidates: null,
				errors: "relaxed"
			};
			if (typeof options.language === "string") {
				defaults.columns = options.language === "esc-pos" ? 42 : 48;
				defaults.codepageMapping = options.language === "esc-pos" ? "epson" : "star";
			}
			if (typeof options.printerModel === "string") {
				if (typeof printerDefinitions[options.printerModel] === "undefined") throw new Error("Unknown printer model");
				this.#printerCapabilities = printerDefinitions[options.printerModel].capabilities;
				defaults.columns = this.#printerCapabilities.fonts["A"].columns;
				defaults.language = this.#printerCapabilities.language;
				defaults.codepageMapping = this.#printerCapabilities.codepages;
				defaults.newline = this.#printerCapabilities?.newline || defaults.newline;
				defaults.feedBeforeCut = this.#printerCapabilities?.cutter?.feed || defaults.feedBeforeCut;
				defaults.imageMode = this.#printerCapabilities?.images?.mode || defaults.imageMode;
			}
			if (options) this.#options = Object.assign(defaults, {
				debug: false,
				embedded: false,
				createCanvas: null
			}, options);
			if (this.#options.width) this.#options.columns = this.#options.width;
			if (this.#options.language === "esc-pos") this.#language = new LanguageEscPos();
			else if (this.#options.language === "star-prnt" || this.#options.language === "star-line") this.#language = new LanguageStarPrnt();
			else throw new Error("The specified language is not supported");
			if (typeof this.#options.autoFlush === "undefined") this.#options.autoFlush = !this.#options.embedded && this.#options.language == "star-prnt";
			if (![
				32,
				35,
				42,
				44,
				48
			].includes(this.#options.columns) && !this.#options.embedded) throw new Error("The width of the paper must me either 32, 35, 42, 44 or 48 columns");
			if (typeof this.#options.codepageMapping === "string") {
				if (typeof codepageMappings[this.#options.language][this.#options.codepageMapping] === "undefined") throw new Error("Unknown codepage mapping");
				this.#codepageMapping = Object.fromEntries(codepageMappings[this.#options.language][this.#options.codepageMapping].map((v, i) => [v, i]).filter((i) => i));
			} else this.#codepageMapping = this.#options.codepageMapping;
			if (this.#options.codepageCandidates) this.#codepageCandidates = this.#options.codepageCandidates;
			else this.#codepageCandidates = Object.keys(this.#codepageMapping);
			this.#composer = new LineComposer({
				embedded: this.#options.embedded,
				columns: this.#options.columns,
				align: "left",
				size: 1,
				callback: (value) => this.#queue.push(value)
			});
			this.#reset();
		}
		/**
		* Reset the state of the object
		*/
		#reset() {
			this.#queue = [];
			this.#codepage = this.#options.language == "esc-pos" ? "cp437" : "star/standard";
			this.#state.codepage = -1;
			this.#state.font = "A";
		}
		/**
		* Initialize the printer
		*
		* @return {object}          Return the object, for easy chaining commands
		*
		*/
		initialize() {
			if (this.#options.embedded) throw new Error("Initialize is not supported in table cells or boxes");
			this.#composer.add(this.#language.initialize());
			return this;
		}
		/**
		* Change the code page
		*
		* @param  {string}   codepage  The codepage that we set the printer to
		* @return {object}             Return the object, for easy chaining commands
		*
		*/
		codepage(codepage) {
			if (codepage === "auto") {
				this.#codepage = codepage;
				return this;
			}
			if (!CodepageEncoder.supports(codepage)) throw new Error("Unknown codepage");
			if (typeof this.#codepageMapping[codepage] !== "undefined") this.#codepage = codepage;
			else throw new Error("Codepage not supported by printer");
			return this;
		}
		/**
		* Print text
		*
		* @param  {string}   value  Text that needs to be printed
		* @return {object}          Return the object, for easy chaining commands
		*
		*/
		text(value) {
			this.#composer.text(value, this.#codepage);
			return this;
		}
		/**
		* Print a newline
		*
		* @param  {string}   value  The number of newlines that need to be printed, defaults to 1
		* @return {object}          Return the object, for easy chaining commands
		*
		*/
		newline(value) {
			value = parseInt(value, 10) || 1;
			for (let i = 0; i < value; i++) this.#composer.flush({ forceNewline: true });
			return this;
		}
		/**
		* Print text, followed by a newline
		*
		* @param  {string}   value  Text that needs to be printed
		* @return {object}          Return the object, for easy chaining commands
		*
		*/
		line(value) {
			this.text(value);
			this.newline();
			return this;
		}
		/**
		* Underline text
		*
		* @param  {boolean|number}   value  true to turn on underline, false to turn off, or 2 for double underline
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		underline(value) {
			if (typeof value === "undefined") this.#composer.style.underline = !this.#composer.style.underline;
			else this.#composer.style.underline = value;
			return this;
		}
		/**
		* Italic text
		*
		* @param  {boolean}          value  true to turn on italic, false to turn off
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		italic(value) {
			if (typeof value === "undefined") this.#composer.style.italic = !this.#composer.style.italic;
			else this.#composer.style.italic = value;
			return this;
		}
		/**
		* Bold text
		*
		* @param  {boolean}          value  true to turn on bold, false to turn off
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		bold(value) {
			if (typeof value === "undefined") this.#composer.style.bold = !this.#composer.style.bold;
			else this.#composer.style.bold = value;
			return this;
		}
		/**
		* Invert text
		*
		* @param  {boolean}          value  true to turn on white text on black, false to turn off
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		invert(value) {
			if (typeof value === "undefined") this.#composer.style.invert = !this.#composer.style.invert;
			else this.#composer.style.invert = value;
			return this;
		}
		/**
		* Change width of text
		*
		* @param  {number}          width    The width of the text, 1 - 8
		* @return {object}                   Return the object, for easy chaining commands
		*
		*/
		width(width) {
			if (typeof width === "undefined") width = 1;
			if (typeof width !== "number") throw new Error("Width must be a number");
			if (width < 1 || width > 8) throw new Error("Width must be between 1 and 8");
			this.#composer.style.width = width;
			return this;
		}
		/**
		* Change height of text
		*
		* @param  {number}          height  The height of the text, 1 - 8
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		height(height) {
			if (typeof height === "undefined") height = 1;
			if (typeof height !== "number") throw new Error("Height must be a number");
			if (height < 1 || height > 8) throw new Error("Height must be between 1 and 8");
			this.#composer.style.height = height;
			return this;
		}
		/**
		* Change text size
		*
		* @param  {Number|string}   width   The width of the text, 1 - 8
		* @param  {Number}          height  The height of the text, 1 - 8
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		size(width, height) {
			if (typeof width === "string") return this.font(width === "small" ? "B" : "A");
			if (typeof height === "undefined") height = width;
			this.width(width);
			this.height(height);
			return this;
		}
		/**
		* Choose different font
		*
		* @param  {string}          value   'A', 'B' or others
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		font(value) {
			if (this.#options.embedded) throw new Error("Changing fonts is not supported in table cells or boxes");
			if (this.#composer.cursor > 0) throw new Error("Changing fonts is not supported in the middle of a line");
			const matches = value.match(/^[0-9]+x[0-9]+$/);
			if (matches) value = Object.entries(this.#printerCapabilities.fonts).find((i) => i[1].size == matches[0])[0];
			value = value.toUpperCase();
			if (typeof this.#printerCapabilities.fonts[value] === "undefined") return this.#error("This font is not supported by this printer", "relaxed");
			this.#composer.add(this.#language.font(value));
			this.#state.font = value;
			if (value === "A") this.#composer.columns = this.#options.columns;
			else this.#composer.columns = this.#options.columns / this.#printerCapabilities.fonts["A"].columns * this.#printerCapabilities.fonts[value].columns;
			return this;
		}
		/**
		* Change text alignment
		*
		* @param  {string}          value   left, center or right
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		align(value) {
			if (![
				"left",
				"center",
				"right"
			].includes(value)) throw new Error("Unknown alignment");
			this.#composer.align = value;
			return this;
		}
		/**
		* Insert a table
		*
		* @param  {array}           columns  The column definitions
		* @param  {array}           data     Array containing rows. Each row is an array containing cells.
		*                                    Each cell can be a string value, or a callback function.
		*                                    The first parameter of the callback is the encoder object on
		*                                    which the function can call its methods.
		* @return {object}                   Return the object, for easy chaining commands
		*
		*/
		table(columns, data) {
			this.#composer.flush();
			for (let r = 0; r < data.length; r++) {
				const lines = [];
				let maxLines = 0;
				for (let c = 0; c < columns.length; c++) {
					const columnEncoder = new ReceiptPrinterEncoder(Object.assign({}, this.#options, {
						width: columns[c].width,
						embedded: true
					}));
					columnEncoder.codepage(this.#codepage);
					columnEncoder.align(columns[c].align);
					if (typeof data[r][c] === "string") columnEncoder.text(data[r][c]);
					if (typeof data[r][c] === "function") data[r][c](columnEncoder);
					const cell = columnEncoder.commands();
					maxLines = Math.max(maxLines, cell.length);
					lines[c] = cell;
				}
				for (let c = 0; c < columns.length; c++) {
					if (lines[c].length >= maxLines) continue;
					for (let p = lines[c].length; p < maxLines; p++) {
						let verticalAlign = "top";
						if (typeof columns[c].verticalAlign !== "undefined") verticalAlign = columns[c].verticalAlign;
						const line = {
							commands: [{
								type: "space",
								size: columns[c].width
							}],
							height: 1
						};
						if (verticalAlign == "bottom") lines[c].unshift(line);
						else lines[c].push(line);
					}
				}
				for (let l = 0; l < maxLines; l++) {
					for (let c = 0; c < columns.length; c++) {
						if (typeof columns[c].marginLeft !== "undefined") this.#composer.space(columns[c].marginLeft);
						this.#composer.add(lines[c][l].commands, columns[c].width);
						if (typeof columns[c].marginRight !== "undefined") this.#composer.space(columns[c].marginRight);
					}
					this.#composer.flush();
				}
			}
			return this;
		}
		/**
		* Insert a horizontal rule
		*
		* @param  {object}          options  And object with the following properties:
		*                                    - style: The style of the line, either single or double
		*                                    - width: The width of the line, by default the width of the paper
		* @return {object}                   Return the object, for easy chaining commands
		*
		*/
		rule(options) {
			options = Object.assign({
				style: "single",
				width: this.#options.columns || 10
			}, options || {});
			this.#composer.flush();
			this.#composer.text((options.style === "double" ? "═" : "─").repeat(options.width), "cp437");
			this.#composer.flush({ forceNewline: true });
			return this;
		}
		/**
		* Insert a box
		*
		* @param  {object}           options   And object with the following properties:
		*                                      - style: The style of the border, either single or double
		*                                      - width: The width of the box, by default the width of the paper
		*                                      - marginLeft: Space between the left border and the left edge
		*                                      - marginRight: Space between the right border and the right edge
		*                                      - paddingLeft: Space between the contents and the left border of the box
		*                                      - paddingRight: Space between the contents and the right border of the box
		* @param  {string|function}  contents  A string value, or a callback function.
		*                                      The first parameter of the callback is the encoder object on
		*                                      which the function can call its methods.
		* @return {object}                     Return the object, for easy chaining commands
		*
		*/
		box(options, contents) {
			options = Object.assign({
				style: "single",
				width: this.#options.columns,
				marginLeft: 0,
				marginRight: 0,
				paddingLeft: 0,
				paddingRight: 0
			}, options || {});
			if (options.width + options.marginLeft + options.marginRight > this.#options.columns) throw new Error("Box is too wide");
			let elements;
			if (options.style == "single") elements = [
				"┌",
				"┐",
				"└",
				"┘",
				"─",
				"│"
			];
			else if (options.style == "double") elements = [
				"╔",
				"╗",
				"╚",
				"╝",
				"═",
				"║"
			];
			const columnEncoder = new ReceiptPrinterEncoder(Object.assign({}, this.#options, {
				width: options.width - (options.style == "none" ? 0 : 2) - options.paddingLeft - options.paddingRight,
				embedded: true
			}));
			columnEncoder.codepage(this.#codepage);
			columnEncoder.align(options.align);
			if (typeof contents === "function") contents(columnEncoder);
			if (typeof contents === "string") columnEncoder.text(contents);
			const lines = columnEncoder.commands();
			this.#composer.flush();
			if (options.style != "none") {
				this.#composer.space(options.marginLeft);
				this.#composer.text(elements[0], "cp437");
				this.#composer.text(elements[4].repeat(options.width - 2), "cp437");
				this.#composer.text(elements[1], "cp437");
				this.#composer.space(options.marginRight);
				this.#composer.flush();
			}
			for (let i = 0; i < lines.length; i++) {
				this.#composer.space(options.marginLeft);
				if (options.style != "none") {
					this.#composer.style.height = lines[i].height;
					this.#composer.text(elements[5], "cp437");
					this.#composer.style.height = 1;
				}
				this.#composer.space(options.paddingLeft);
				this.#composer.add(lines[i].commands, options.width - (options.style == "none" ? 0 : 2) - options.paddingLeft - options.paddingRight);
				this.#composer.space(options.paddingRight);
				if (options.style != "none") {
					this.#composer.style.height = lines[i].height;
					this.#composer.text(elements[5], "cp437");
					this.#composer.style.height = 1;
				}
				this.#composer.space(options.marginRight);
				this.#composer.flush();
			}
			if (options.style != "none") {
				this.#composer.space(options.marginLeft);
				this.#composer.text(elements[2], "cp437");
				this.#composer.text(elements[4].repeat(options.width - 2), "cp437");
				this.#composer.text(elements[3], "cp437");
				this.#composer.space(options.marginRight);
				this.#composer.flush();
			}
			return this;
		}
		/**
		* Barcode
		*
		* @param  {string}           value  the value of the barcode
		* @param  {string|number}    symbology  the type of the barcode
		* @param  {number|object}    height  Either the configuration object, or backwards compatible height of the barcode
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		barcode(value, symbology, height) {
			let options = {
				height: 60,
				width: 2,
				text: false
			};
			if (typeof height === "object") options = Object.assign(options, height);
			if (typeof height === "number") options.height = height;
			if (this.#options.embedded) throw new Error("Barcodes are not supported in table cells or boxes");
			if (this.#printerCapabilities.barcodes.supported === false) return this.#error("Barcodes are not supported by this printer", "relaxed");
			if (typeof symbology === "string" && !this.#printerCapabilities.barcodes.symbologies.includes(symbology)) return this.#error(`Symbology '${symbology}' not supported by this printer`, "relaxed");
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			if (this.#composer.align !== "left") this.#composer.add(this.#language.align(this.#composer.align));
			this.#composer.add(this.#language.barcode(value, symbology, options));
			if (this.#composer.align !== "left") this.#composer.add(this.#language.align("left"));
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			return this;
		}
		/**
		* QR code
		*
		* @param  {string}           value       The value of the qr code
		* @param  {number|object}    model       Either the configuration object, or
		*                                        backwards compatible model of the qrcode, either 1 or 2
		* @param  {number}           size        Backwards compatible size of the qrcode, a value between 1 and 8
		* @param  {string}           errorlevel  Backwards compatible the amount of error correction used,
		*                                        either 'l', 'm', 'q', 'h'
		* @return {object}                       Return the object, for easy chaining commands
		*/
		qrcode(value, model, size, errorlevel) {
			let options = {
				model: 2,
				size: 6,
				errorlevel: "m"
			};
			if (typeof model === "object") options = Object.assign(options, model);
			if (typeof model === "number") options.model = model;
			if (typeof size === "number") options.size = size;
			if (typeof errorlevel === "string") options.errorlevel = errorlevel;
			if (this.#options.embedded) throw new Error("QR codes are not supported in table cells or boxes");
			if (this.#printerCapabilities.qrcode.supported === false) return this.#error("QR codes are not supported by this printer", "relaxed");
			if (options.model && !this.#printerCapabilities.qrcode.models.includes(String(options.model))) return this.#error("QR code model is not supported by this printer", "relaxed");
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			if (this.#composer.align !== "left") this.#composer.add(this.#language.align(this.#composer.align));
			this.#composer.add(this.#language.qrcode(value, options));
			if (this.#composer.align !== "left") this.#composer.add(this.#language.align("left"));
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			return this;
		}
		/**
		* PDF417 code
		*
		* @param  {string}           value     The value of the qr code
		* @param  {object}           options   Configuration object
		* @return {object}                     Return the object, for easy chaining commands
		*
		*/
		pdf417(value, options) {
			options = Object.assign({
				width: 3,
				height: 3,
				columns: 0,
				rows: 0,
				errorlevel: 1,
				truncated: false
			}, options || {});
			if (this.#options.embedded) throw new Error("PDF417 codes are not supported in table cells or boxes");
			if (this.#printerCapabilities.pdf417.supported === false) {
				if (typeof this.#printerCapabilities.pdf417.fallback === "object") return this.barcode(value, this.#printerCapabilities.pdf417.fallback.symbology);
				return this.#error("PDF417 codes are not supported by this printer", "relaxed");
			}
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			if (this.#composer.align !== "left") this.#composer.add(this.#language.align(this.#composer.align));
			this.#composer.add(this.#language.pdf417(value, options));
			if (this.#composer.align !== "left") this.#composer.add(this.#language.align("left"));
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			return this;
		}
		/**
		* Image
		*
		* @param  {object}         input  an element, like a canvas or image that needs to be printed
		* @param  {number}         width  width of the image on the printer
		* @param  {number}         height  height of the image on the printer
		* @param  {string}         algorithm  the dithering algorithm for making the image black and white
		* @param  {number}         threshold  threshold for the dithering algorithm
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		image(input, width, height, algorithm, threshold) {
			if (this.#options.embedded) throw new Error("Images are not supported in table cells or boxes");
			if (width % 8 !== 0) throw new Error("Width must be a multiple of 8");
			if (height % 8 !== 0) throw new Error("Height must be a multiple of 8");
			if (typeof algorithm === "undefined") algorithm = "threshold";
			if (typeof threshold === "undefined") threshold = 128;
			const name = input.constructor.name;
			let type;
			name.endsWith("Element") && (type = "element");
			name == "ImageData" && (type = "imagedata");
			name == "Canvas" && typeof input.getContext !== "undefined" && (type = "node-canvas");
			name == "Image" && (type = "node-canvas-image");
			name == "Image" && typeof input.frames !== "undefined" && (type = "node-read-image");
			name == "Object" && input.data && input.info && (type = "node-sharp");
			name == "View3duint8" && input.data && input.shape && (type = "ndarray");
			name == "Object" && input.data && input.width && input.height && (type = "object");
			if (!type) throw new Error("Could not determine the type of image input");
			let image;
			if (type == "element") {
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const context = canvas.getContext("2d");
				context.drawImage(input, 0, 0, width, height);
				image = context.getImageData(0, 0, width, height);
			}
			if (type == "node-canvas") image = input.getContext("2d").getImageData(0, 0, input.width, input.height);
			if (type == "node-canvas-image") {
				if (typeof this.#options.createCanvas !== "function") throw new Error("Canvas is not supported in this environment, specify a createCanvas function in the options");
				const context = this.#options.createCanvas(width, height).getContext("2d");
				context.drawImage(input, 0, 0, width, height);
				image = context.getImageData(0, 0, width, height);
			}
			if (type == "node-read-image") {
				image = new ImageData(input.width, input.height);
				image.data.set(input.frames[0].data);
			}
			if (type == "node-sharp") {
				image = new ImageData(input.info.width, input.info.height);
				image.data.set(input.data);
			}
			if (type == "ndarray") {
				image = new ImageData(input.shape[0], input.shape[1]);
				image.data.set(input.data);
			}
			if (type == "object") {
				image = new ImageData(input.width, input.height);
				image.data.set(input.data);
			}
			if (type == "imagedata") image = input;
			if (!image) throw new Error("Image could not be loaded");
			if (width !== image.width || height !== image.height) image = resizeImageData(image, width, height, "bilinear-interpolation");
			if (width !== image.width || height !== image.height) throw new Error("Image could not be resized");
			image = Flatten.flatten(image, [
				255,
				255,
				255
			]);
			switch (algorithm) {
				case "threshold":
					image = Dither.threshold(image, threshold);
					break;
				case "bayer":
					image = Dither.bayer(image, threshold);
					break;
				case "floydsteinberg":
					image = Dither.floydsteinberg(image);
					break;
				case "atkinson":
					image = Dither.atkinson(image);
					break;
			}
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			if (this.#composer.align !== "left") this.#composer.add(this.#language.align(this.#composer.align));
			this.#composer.add(this.#language.image(image, width, height, this.#options.imageMode));
			if (this.#composer.align !== "left") this.#composer.add(this.#language.align("left"));
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			return this;
		}
		/**
		* Cut paper
		*
		* @param  {string}          value   full or partial. When not specified a full cut will be assumed
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		cut(value) {
			if (this.#options.embedded) throw new Error("Cut is not supported in table cells or boxes");
			for (let i = 0; i < this.#options.feedBeforeCut; i++) this.#composer.flush({ forceNewline: true });
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			this.#composer.add(this.#language.cut(value));
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			return this;
		}
		/**
		* Pulse
		*
		* @param  {number}          device  0 or 1 for on which pin the device is connected, default of 0
		* @param  {number}          on      Time the pulse is on in milliseconds, default of 100
		* @param  {number}          off     Time the pulse is off in milliseconds, default of 500
		* @return {object}                  Return the object, for easy chaining commands
		*
		*/
		pulse(device, on, off) {
			if (this.#options.embedded) throw new Error("Pulse is not supported in table cells or boxes");
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			this.#composer.add(this.#language.pulse(device, on, off));
			this.#composer.flush({
				forceFlush: true,
				ignoreAlignment: true
			});
			return this;
		}
		/**
		* Add raw printer commands
		*
		* @param  {array}           data   raw bytes to be included
		* @return {object}          Return the object, for easy chaining commands
		*
		*/
		raw(data) {
			this.#composer.raw(data);
			return this;
		}
		/**
		* Internal function for encoding style changes
		* @param  {string}          property  The property that needs to be changed
		* @param  {boolean}         value     Is the property enabled or disabled
		* @return {array}                     Return the encoded bytes
		*/
		#encodeStyle(property, value) {
			if (property === "bold") return this.#language.bold(value);
			if (property === "underline") return this.#language.underline(value);
			if (property === "italic") return this.#language.italic(value);
			if (property === "invert") return this.#language.invert(value);
			if (property === "size") return this.#language.size(value.width, value.height);
		}
		/**
		* Internal function for encoding text in the correct codepage
		* @param  {string}          value  The text that needs to be encoded
		* @param  {string}          codepage  The codepage that needs to be used
		* @return {array}                   Return the encoded bytes
		*/
		#encodeText(value, codepage) {
			if (codepage === null) return [{
				type: "text",
				payload: [...CodepageEncoder.encode(value, "ascii")]
			}];
			if (codepage !== "auto") {
				const fragment = CodepageEncoder.encode(value, codepage);
				if (this.#state.codepage != this.#codepageMapping[codepage]) {
					this.#state.codepage = this.#codepageMapping[codepage];
					return [{
						type: "codepage",
						payload: this.#language.codepage(this.#codepageMapping[codepage])
					}, {
						type: "text",
						payload: [...fragment]
					}];
				}
				return [{
					type: "text",
					payload: [...fragment]
				}];
			}
			const fragments = CodepageEncoder.autoEncode(value, this.#codepageCandidates);
			const buffer = [];
			for (const fragment of fragments) {
				this.#state.codepage = this.#codepageMapping[fragment.codepage];
				buffer.push({
					type: "codepage",
					payload: this.#language.codepage(this.#codepageMapping[fragment.codepage])
				}, {
					type: "text",
					payload: [...fragment.bytes]
				});
			}
			return buffer;
		}
		/**
		* Get all the commands
		*
		* @return {array}         All the commands currently in the queue
		*/
		commands() {
			let requiresFlush = true;
			let lastLine = this.#queue[this.#queue.length - 1];
			if (lastLine) {
				let lastCommand = lastLine[lastLine.length - 1];
				if (lastCommand && ["pulse", "cut"].includes(lastCommand.type)) requiresFlush = false;
			}
			if (requiresFlush && this.#options.autoFlush && !this.#options.embedded) this.#composer.add(this.#language.flush());
			const result = [];
			const remaining = this.#composer.fetch({
				forceFlush: true,
				ignoreAlignment: true
			});
			if (remaining.length) this.#queue.push(remaining);
			while (this.#queue.length) {
				const line = this.#queue.shift();
				const height = line.filter((i) => i.type === "style" && i.property === "size").map((i) => i.value.height).reduce((a, b) => Math.max(a, b), 1);
				if (this.#options.debug) console.log("|" + line.filter((i) => i.type === "text").map((i) => i.value).join("") + "|", height);
				result.push({
					commands: line,
					height
				});
			}
			if (this.#options.debug) console.log("commands", result);
			this.#reset();
			return result;
		}
		/**
		* Encode all previous commands
		*
		* @param  {string}          format  The format of the output, either 'commands',
		*                                   'lines' or 'array', defaults to 'array'
		* @return {Uint8Array}              Return the encoded bytes in the format specified
		*/
		encode(format) {
			const commands = this.commands();
			if (format === "commands") return commands;
			const lines = [];
			for (const line of commands) {
				const buffer = [];
				for (const item of line.commands) if (item.type === "text") buffer.push(...this.#encodeText(item.value, item.codepage));
				else if (item.type === "style") buffer.push(Object.assign(item, { payload: this.#encodeStyle(item.property, item.value) }));
				else if (item.value || item.payload) buffer.push(item);
				lines.push(buffer);
			}
			if (format === "lines") return lines;
			let result = [];
			let last = null;
			for (const line of lines) {
				for (const item of line) {
					result.push(...item.payload);
					last = item;
				}
				if (this.#options.newline === "\n\r") result.push(10, 13);
				if (this.#options.newline === "\n") result.push(10);
			}
			if (last && last.type === "pulse") result = result.slice(0, 0 - this.#options.newline.length);
			return Uint8Array.from(result);
		}
		/**
		* Throw an error
		*
		* @param  {string}          message  The error message
		* @param  {string}          level    The error level, if level is strict,
		*                                    an error will be thrown, if level is relaxed,
		*                                    a warning will be logged
		* @return {object}          Return the object, for easy chaining commands
		*/
		#error(message, level) {
			if (level === "strict" || this.#options.errors === "strict") throw new Error(message);
			console.warn(message);
			return this;
		}
		/**
		* Get all supported printer models
		*
		* @return {object}         An object with all supported printer models
		*/
		static get printerModels() {
			return Object.entries(printerDefinitions).map((i) => ({
				id: i[0],
				name: i[1].vendor + " " + i[1].model
			}));
		}
		/**
		* Get the current column width
		*
		* @return {number}         The column width in characters
		*/
		get columns() {
			return this.#composer.columns;
		}
		/**
		* Get the current language
		* @return {string}         The language that is currently used
		*/
		get language() {
			return this.#options.language;
		}
		/**
		* Get the capabilities of the printer
		* @return {object}         The capabilities of the printer
		*/
		get printerCapabilities() {
			return this.#printerCapabilities;
		}
	};
}));
//#endregion
//#region src/escpos.ts
function escapeText(value) {
	if (value === void 0 || value === null) return "";
	return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function wrapText(text, maxWidth) {
	if (text.length <= maxWidth) return [text];
	const words = text.split(" ");
	const lines = [];
	let current = "";
	for (const word of words) if (!current) if (word.length >= maxWidth) {
		lines.push(word.substring(0, maxWidth));
		current = word.substring(maxWidth) || "";
	} else current = word;
	else if ((current + " " + word).length <= maxWidth) current += " " + word;
	else {
		lines.push(current);
		if (word.length >= maxWidth) {
			lines.push(word.substring(0, maxWidth));
			current = word.substring(maxWidth) || "";
		} else current = word;
	}
	if (current) lines.push(current);
	return lines;
}
function encodeReceiptTicket(order, paperWidth, branding) {
	const columns = paperWidth === "58mm" ? 32 : 48;
	const encoder = new ReceiptPrinterEncoder({
		language: "esc-pos",
		columns
	});
	const o = order;
	const dateStr = (o.createdAt ? new Date(o.createdAt) : /* @__PURE__ */ new Date()).toLocaleString("es-PE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	});
	let enc = encoder.initialize().codepage("cp858").align("center").bold(true).width(2).height(2).text(escapeText(branding.businessName || "Ticket de Venta")).newline().width(1).height(1).bold(false);
	if (branding.receiptHeaderText) branding.receiptHeaderText.split("\n").forEach((line) => {
		enc = enc.text(escapeText(line)).newline();
	});
	enc = enc.bold(true).text("Orden").newline().text(`#${escapeText(o.code || o.id)}`).newline().bold(false).text(`Fecha: ${dateStr}`).newline();
	if (branding.businessAddress) wrapText(escapeText(branding.businessAddress), columns).forEach((line) => {
		enc = enc.text(line).newline();
	});
	if (branding.businessPhone) enc = enc.text(`Tel: ${escapeText(branding.businessPhone)}`).newline();
	if (branding.businessDocument) enc = enc.text(`Doc: ${escapeText(branding.businessDocument)}`).newline();
	const cleanTableName = (o.table?.name || o.table?.number || "").replace(/^Mesa\s+/i, "");
	if (o.serviceType === "EN_MESA" && cleanTableName) enc = enc.text(`Mesa ${escapeText(cleanTableName)}`).newline();
	else if (o.serviceType) enc = enc.text(`Servicio: ${escapeText(o.serviceType)}`).newline();
	if (branding.receiptShowCustomerName) {
		const customerName = o.customerName || o.customer?.name;
		if (customerName) enc = enc.text(`Cliente: ${escapeText(customerName)}`).newline();
	}
	const attendantName = o.user?.name || o.collaborator?.user?.name;
	if (attendantName) enc = enc.text(`Atiende: ${escapeText(attendantName)}`).newline();
	enc = enc.newline().line("-").align("left");
	const items = o.items || [];
	if (items.length === 0) enc = enc.text("Sin items").newline();
	else for (const item of items) {
		let name = escapeText(item.menuItem?.name || item.item?.name || item.menuItemId || "Item");
		if (item.variantName) name += ` - ${escapeText(item.variantName)}`;
		const qty = `${item.quantity}x `;
		const price = `S/${(item.subtotal ?? Number(item.unitPrice || 0) * Number(item.quantity)).toFixed(2)}`;
		const qtyWidth = 4;
		const priceWidth = 10;
		const nameWidth = columns - qtyWidth - priceWidth;
		const qtyStr = qty.padEnd(qtyWidth, " ");
		const priceStr = price.padStart(priceWidth, " ");
		const nameLines = wrapText(name, nameWidth);
		if (nameLines.length === 1) enc = enc.text(`${qtyStr}${nameLines[0].padEnd(nameWidth, " ")}${priceStr}`).newline();
		else {
			enc = enc.text(`${qtyStr}${nameLines[0]}`).newline();
			for (let i = 1; i < nameLines.length - 1; i++) enc = enc.text(`${" ".repeat(qtyWidth)}${nameLines[i]}`).newline();
			const lastLine = nameLines[nameLines.length - 1].padEnd(nameWidth, " ");
			enc = enc.text(`${" ".repeat(qtyWidth)}${lastLine}${priceStr}`).newline();
		}
		if (branding.receiptShowItemNotes && item.notes) {
			let n = escapeText(item.notes);
			if (n.length > columns - 4) n = n.substring(0, columns - 5);
			enc = enc.text(`    ${n}`).newline();
		}
	}
	if (branding.receiptShowOrderNotes && o.notes) {
		const noteLines = wrapText(`Notas: ${escapeText(o.notes)}`, columns);
		enc = enc.align("left");
		for (const noteLine of noteLines) enc = enc.text(noteLine).newline();
	}
	return enc.line("-").align("right").bold(true).text(`TOTAL: S/ ${Number(o.total || 0).toFixed(2)}`).newline().bold(false).newline().align("center").text(escapeText(branding.receiptFooterText || "Gracias por su preferencia.")).newline().newline().newline().newline().cut().encode();
}
function groupKitchenItems(items) {
	const groups = [];
	for (const item of items ?? []) {
		if (item.status === "CANCELADO") continue;
		const round = item.roundNumber ?? 1;
		const station = item.menuItem?.menuDetails?.preparationStation ?? item.item?.menuDetails?.preparationStation ?? "COCINA";
		const existing = groups.find((g) => g.round === round && g.station === station);
		if (existing) existing.items.push(item);
		else groups.push({
			round,
			station,
			items: [item]
		});
	}
	return groups.sort((a, b) => a.round !== b.round ? a.round - b.round : a.station.localeCompare(b.station));
}
function encodeKitchenTicket(order, paperWidth, branding) {
	const columns = paperWidth === "58mm" ? 32 : 48;
	const encoder = new ReceiptPrinterEncoder({
		language: "esc-pos",
		columns
	});
	const o = order;
	const timeStr = (o.createdAt ? new Date(o.createdAt) : /* @__PURE__ */ new Date()).toLocaleTimeString("es-PE", {
		hour: "2-digit",
		minute: "2-digit"
	});
	const cleanTableName = (o.table?.name || o.table?.number || "").replace(/^Mesa\s+/i, "");
	let enc = encoder.initialize().codepage("cp858").align("center").bold(true).width(2).height(2).text(escapeText(branding.businessName || "COMANDA")).newline().width(1).height(1).bold(true).text(escapeText(branding.kitchenHeaderText || "COMANDA")).newline().bold(true).text("Orden").newline().text(`#${escapeText(o.code || o.id)}`).newline().bold(false).text(timeStr).newline();
	if (branding.kitchenShowTableName && o.serviceType === "EN_MESA" && cleanTableName) enc = enc.text(`Mesa ${escapeText(cleanTableName)}`).newline();
	else if (o.serviceType) enc = enc.text(escapeText(o.serviceType)).newline();
	if (branding.kitchenShowCustomerName && o.customerName) enc = enc.text(`Cliente: ${escapeText(o.customerName)}`).newline();
	const kitchenAttendant = o.user?.name || o.collaborator?.user?.name;
	if (kitchenAttendant) enc = enc.text(`Atiende: ${escapeText(kitchenAttendant)}`).newline();
	if (o.notes) {
		const noteLines = wrapText(`Notas: ${escapeText(o.notes)}`, columns);
		enc = enc.newline().line("-").align("left");
		for (const noteLine of noteLines) enc = enc.text(noteLine).newline();
	}
	const groups = groupKitchenItems(o.items ?? []);
	for (const group of groups) {
		const label = group.station === "COCINA" ? `RONDA ${group.round}` : `RONDA ${group.round} (${group.station})`;
		enc = enc.newline().align("center").line("-").bold(true).text(label).newline().line("-").bold(false).align("left");
		for (const item of group.items) {
			let name = escapeText(item.menuItem?.name || item.item?.name || item.menuItemId || "Item");
			if (item.variantName) name += ` - ${escapeText(item.variantName)}`;
			const qtyWidth = 4;
			const nameWidth = columns - qtyWidth;
			const qtyStr = `${item.quantity}x `.padEnd(qtyWidth, " ");
			const nameLines = wrapText(name, nameWidth);
			if (nameLines.length === 1) enc = enc.text(`${qtyStr}${nameLines[0].padEnd(nameWidth, " ")}`).newline();
			else {
				enc = enc.text(`${qtyStr}${nameLines[0]}`).newline();
				for (let i = 1; i < nameLines.length - 1; i++) enc = enc.text(`${" ".repeat(qtyWidth)}${nameLines[i]}`).newline();
				const lastLine = nameLines[nameLines.length - 1].padEnd(nameWidth, " ");
				enc = enc.text(`${" ".repeat(qtyWidth)}${lastLine}`).newline();
			}
			if (branding.kitchenShowItemNotes && item.notes) {
				const note = escapeText(item.notes);
				enc = enc.text(`  * ${note.substring(0, columns - 4)}`).newline();
			}
		}
	}
	if (branding.kitchenFooterText) enc = enc.newline().align("center").text(escapeText(branding.kitchenFooterText)).newline();
	return enc.newline().newline().newline().newline().newline().cut().encode();
}
var ReceiptPrinterEncoder;
var init_escpos = __esmMin((() => {
	ReceiptPrinterEncoder = require_receipt_printer_encoder();
}));
//#endregion
//#region src/agent.ts
var agent_exports = /* @__PURE__ */ __exportAll({ PrintAgent: () => PrintAgent });
var PrintAgent;
var init_agent = __esmMin((() => {
	init_esm_debug();
	init_escpos();
	PrintAgent = class PrintAgent extends EventEmitter {
		static {
			this.LOG_LEVELS = [
				"debug",
				"info",
				"warn",
				"error"
			];
		}
		constructor(config, printer) {
			super();
			this.config = config;
			this.printer = printer;
			this.socket = null;
			this.heartbeatTimer = null;
			this.logLevelIndex = PrintAgent.LOG_LEVELS.indexOf(config.logLevel);
		}
		connect() {
			const url = this.config.backendUrl;
			this.log("info", `Conectando a ${url}/print-agent ...`);
			this.emit("status", {
				status: "connecting",
				message: `Conectando a ${url}`
			});
			this.socket = lookup(`${url}/print-agent`, {
				query: { token: this.config.token },
				transports: ["websocket"],
				reconnection: true,
				reconnectionDelay: 2e3,
				reconnectionDelayMax: 3e4,
				reconnectionAttempts: Infinity
			});
			this.socket.on("connect", () => {
				this.log("info", `Conectado. Socket ID: ${this.socket.id}`);
				this.emit("status", {
					status: "connected",
					message: `Socket ID: ${this.socket.id}`
				});
				this.startHeartbeat();
			});
			this.socket.on("disconnect", (reason) => {
				this.log("warn", `Desconectado: ${reason}`);
				this.emit("status", {
					status: "disconnected",
					message: reason
				});
				this.stopHeartbeat();
			});
			this.socket.on("connect_error", (err) => {
				this.log("error", `Error de conexión: ${err.message}`);
				this.emit("status", {
					status: "error",
					message: err.message
				});
			});
			this.socket.on("reconnect_attempt", (attempt) => {
				this.log("info", `Reconectando (intento ${attempt})...`);
				this.emit("status", {
					status: "connecting",
					message: `Reconectando (intento ${attempt})`
				});
			});
			this.socket.on("print:job", (payload) => {
				this.handlePrintJob(payload).catch((err) => {
					this.log("error", `Error no capturado en handlePrintJob: ${err}`);
				});
			});
		}
		disconnect() {
			this.stopHeartbeat();
			this.socket?.disconnect();
			this.socket = null;
			this.log("info", "Desconectado del servidor.");
		}
		startHeartbeat() {
			this.stopHeartbeat();
			this.heartbeatTimer = setInterval(() => {
				if (!this.socket?.connected) return;
				this.socket.emit("agent:heartbeat", {}, (response) => {
					this.log("debug", `Heartbeat ack: ${JSON.stringify(response)}`);
				});
			}, this.config.heartbeatIntervalMs);
		}
		stopHeartbeat() {
			if (this.heartbeatTimer) {
				clearInterval(this.heartbeatTimer);
				this.heartbeatTimer = null;
			}
		}
		async handlePrintJob(payload) {
			const { jobId, ticketType, paperWidth, order, branding, orderId } = payload;
			this.log("info", `Job recibido: ${jobId} | tipo: ${ticketType} | papel: ${paperWidth}`);
			this.emit("job", {
				jobId,
				orderId,
				ticketType,
				timestamp: payload.timestamp
			});
			let success = false;
			let error;
			try {
				const effectivePaperWidth = paperWidth ?? this.config.paperWidth;
				const bytes = ticketType === "RECEIPT" ? encodeReceiptTicket(order, effectivePaperWidth, branding) : encodeKitchenTicket(order, effectivePaperWidth, branding);
				await this.printer.print(bytes);
				success = true;
				this.log("info", `Job ${jobId} impreso correctamente`);
			} catch (err) {
				error = err instanceof Error ? err.message : String(err);
				this.log("error", `Job ${jobId} falló: ${error}`);
			}
			const result = {
				jobId,
				orderId,
				ticketType,
				success,
				...error ? { error } : {}
			};
			this.emit("result", {
				jobId,
				success,
				...error ? { error } : {}
			});
			this.socket?.emit("print:result", result);
		}
		log(level, message) {
			if (PrintAgent.LOG_LEVELS.indexOf(level) < this.logLevelIndex) return;
			const ts = (/* @__PURE__ */ new Date()).toISOString();
			console.log(`${ts} ${{
				debug: "[DEBUG]",
				info: "[INFO ]",
				warn: "[WARN ]",
				error: "[ERROR]"
			}[level]} ${message}`);
		}
	};
}));
//#endregion
//#region electron/main.ts
var import_electron = require_electron();
var import_main = /* @__PURE__ */ __toESM(require_main());
function getEnvPath() {
	return import_electron.app.isPackaged ? path$1.join(process.resourcesPath, ".env") : path$1.join(import_electron.app.getAppPath(), ".env");
}
var agent = null;
var mainWindow = null;
function createWindow() {
	mainWindow = new import_electron.BrowserWindow({
		width: 920,
		height: 640,
		minWidth: 780,
		minHeight: 520,
		title: "Mando Print Agent",
		backgroundColor: "#030712",
		autoHideMenuBar: true,
		webPreferences: {
			preload: path$1.join(__dirname, "../preload/index.js"),
			contextIsolation: true,
			nodeIntegration: false
		}
	});
	if (process.env["ELECTRON_RENDERER_URL"]) mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
	else mainWindow.loadFile(path$1.join(__dirname, "../renderer/index.html"));
}
async function startAgent() {
	if (agent) {
		try {
			agent.disconnect();
		} catch {}
		agent = null;
	}
	const envPath = getEnvPath();
	import_main.config({
		path: envPath,
		override: true
	});
	try {
		const { loadConfig } = (init_config(), __toCommonJS(config_exports));
		const { createPrinter } = (init_printer(), __toCommonJS(printer_exports));
		const { PrintAgent } = (init_agent(), __toCommonJS(agent_exports));
		const config = loadConfig(envPath);
		agent = new PrintAgent(config, await createPrinter(config));
		agent.on("status", (event) => {
			mainWindow?.webContents.send("agent:status", event);
		});
		agent.on("job", (event) => {
			mainWindow?.webContents.send("agent:job", event);
		});
		agent.on("result", (event) => {
			mainWindow?.webContents.send("agent:result", event);
		});
		agent.connect();
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		mainWindow?.webContents.send("agent:status", {
			status: "error",
			message
		});
	}
}
import_electron.ipcMain.handle("config:load", () => {
	const envPath = getEnvPath();
	if (!fs$2.existsSync(envPath)) return null;
	return import_main.parse(fs$2.readFileSync(envPath, "utf-8"));
});
import_electron.ipcMain.handle("config:save", (_e, envVars) => {
	try {
		const envPath = getEnvPath();
		if (!fs$2.existsSync(envPath)) {
			const examplePath = path$1.join(import_electron.app.getAppPath(), ".env.example");
			if (fs$2.existsSync(examplePath)) fs$2.copyFileSync(examplePath, envPath);
		}
		let content = fs$2.existsSync(envPath) ? fs$2.readFileSync(envPath, "utf-8") : "";
		for (const [key, value] of Object.entries(envVars)) {
			const regex = new RegExp(`^${key}=.*$`, "m");
			if (regex.test(content)) content = content.replace(regex, `${key}=${value}`);
			else content += `\n${key}=${value}`;
		}
		fs$2.writeFileSync(envPath, content.trimEnd() + "\n", "utf-8");
		import_main.config({
			path: envPath,
			override: true
		});
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : String(err)
		};
	}
});
import_electron.ipcMain.handle("agent:restart", async () => {
	await startAgent();
});
import_electron.ipcMain.handle("app:open-env", () => {
	import_electron.shell.openPath(getEnvPath());
});
import_electron.app.whenReady().then(() => {
	createWindow();
	mainWindow.webContents.once("did-finish-load", () => {
		startAgent();
	});
	import_electron.app.on("activate", () => {
		if (import_electron.BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
import_electron.app.on("window-all-closed", () => {
	if (agent) try {
		agent.disconnect();
	} catch {}
	if (process.platform !== "darwin") import_electron.app.quit();
});
//#endregion
export {};
