import { createRequire } from "node:module";
// -- CommonJS Shims --
import __cjs_mod__ from "node:module";
import.meta.filename;
const __dirname = import.meta.dirname;
__cjs_mod__.createRequire(import.meta.url);
//#region \0rolldown/runtime.js
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);
//#endregion
//#region electron/preload.ts
var import_electron = (/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { spawnSync } = __require("child_process");
	var fs = __require("fs");
	var path = __require("path");
	var pathFile = path.join(__dirname, "path.txt");
	function downloadElectron() {
		console.log("Downloading Electron binary...");
		if (spawnSync(process.execPath, [path.join(__dirname, "install.js")], { stdio: "inherit" }).status !== 0) throw new Error("Electron failed to install correctly. Please delete `node_modules/electron` and run \"npx install-electron --no\" manually.");
	}
	/**
	* Fetches the path to the Electron executable to use in development mode.
	* If the executable is missing, attempt to download it first.
	*
	* @returns the path to the Electron executable to run
	*/
	function getElectronPath() {
		let executablePath;
		if (fs.existsSync(pathFile)) executablePath = fs.readFileSync(pathFile, "utf-8");
		if (process.env.ELECTRON_OVERRIDE_DIST_PATH) return path.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || "electron");
		if (executablePath) {
			const fullPath = path.join(__dirname, "dist", executablePath);
			if (!fs.existsSync(fullPath)) downloadElectron();
			return fullPath;
		} else {
			try {
				downloadElectron();
			} catch {
				throw new Error("Electron failed to install correctly. Please delete `node_modules/electron` and run \"npx install-electron --no\" manually.");
			}
			executablePath = fs.readFileSync(pathFile, "utf-8");
			return path.join(__dirname, "dist", executablePath);
		}
	}
	module.exports = getElectronPath();
})))();
import_electron.contextBridge.exposeInMainWorld("api", {
	onAgentStatus: (cb) => {
		const handler = (_, e) => cb(e);
		import_electron.ipcRenderer.on("agent:status", handler);
		return () => import_electron.ipcRenderer.removeListener("agent:status", handler);
	},
	onAgentJob: (cb) => {
		const handler = (_, e) => cb(e);
		import_electron.ipcRenderer.on("agent:job", handler);
		return () => import_electron.ipcRenderer.removeListener("agent:job", handler);
	},
	onAgentResult: (cb) => {
		const handler = (_, e) => cb(e);
		import_electron.ipcRenderer.on("agent:result", handler);
		return () => import_electron.ipcRenderer.removeListener("agent:result", handler);
	},
	loadConfig: () => import_electron.ipcRenderer.invoke("config:load"),
	saveConfig: (data) => import_electron.ipcRenderer.invoke("config:save", data),
	restartAgent: () => import_electron.ipcRenderer.invoke("agent:restart"),
	openEnvFile: () => import_electron.ipcRenderer.invoke("app:open-env")
});
//#endregion
export {};
