import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import test from "node:test";

const source = stripTypeScriptTypes(readFileSync(new URL("../extensions/prompt-editor.ts", import.meta.url), "utf8")
	.replace(/^import .*;\n/gm, "")
	.replace("export default function", "function registerExtension"));

async function setup(t, options = {}) {
	const dir = await fs.mkdtemp(path.join(os.tmpdir(), "pi-modes-"));
	t.after(() => fs.rm(dir, { recursive: true, force: true }));
	const file = path.join(dir, "modes.json");
	function processHarness({ thinking = "high", branch = [], modelId = "original", afterModel, sessionFile } = {}) {
		const commands = new Map();
		const events = new Map();
		const notifications = [];
		const applied = [];
		const model = { provider: "test", id: modelId, reasoning: true };
		const ctx = {
			cwd: path.join(dir, "project"), hasUI: false, model,
			modelRegistry: { find: (provider, id) => ({ provider, id, reasoning: true }) },
			sessionManager: { getBranch: () => branch, getSessionFile: () => sessionFile },
			ui: { notify: (message, level) => notifications.push({ message, level }) },
		};
		const pi = {
			registerCommand: (name, command) => commands.set(name, command.handler),
			registerShortcut() {}, on: (name, handler) => events.set(name, handler),
			getThinkingLevel: () => thinking,
			setThinkingLevel: (level) => { thinking = level; applied.push(["thinking", level]); },
			setModel: async (selected) => {
				applied.push(["model", selected.id]);
				await afterModel?.();
				return true;
			},
		};
		const register = vm.runInNewContext(source + "\nregisterExtension", {
			fs: { ...fs, ...options.fs }, path, os, process: { env: { PI_CODING_AGENT_DIR: dir }, pid: process.pid },
			CustomEditor: class {}, setTimeout, Buffer,
		});
		register(pi);
		return {
			ctx, applied, notifications,
			mode: (args) => commands.get("mode")(args, ctx),
			start: (reason = "startup") => events.get("session_start")({ type: "session_start", reason }, ctx),
		};
	}
	return { file, processHarness, read: async () => JSON.parse(await fs.readFile(file, "utf8")) };
}

test("first save selects fast without replacing the original default selection", async (t) => {
	const h = await setup(t);
	await h.processHarness().mode("fast");
	assert.deepEqual(await h.read(), {
		version: 1, currentMode: "fast",
		modes: {
			default: { provider: "test", modelId: "original", thinkingLevel: "high" },
			fast: { provider: "test", modelId: "original", thinkingLevel: "off" },
		},
	});
});

test("malformed configuration reports an error and stays protected on repeated attempts", async (t) => {
	for (const contents of ["{broken", "null", "[]", '{"version":1,"modes":[]}',
		'{"version":1,"modes":{"default":{"thinkingLevel":"invalid"}}}']) {
		const h = await setup(t);
		await fs.writeFile(h.file, contents);
		const session = h.processHarness();
		session.ctx.hasUI = true;
		for (let attempt = 0; attempt < 2; attempt++) {
			await assert.rejects(session.mode("fast"));
			assert.equal(await fs.readFile(h.file, "utf8"), contents);
		}
		assert.ok(session.notifications.some(({ level }) => level === "error"));
	}
});

test("read failures other than ENOENT block writes at load and at save", async (t) => {
	for (const failOnRead of [1, 2]) {
		let reads = 0;
		const h = await setup(t, { fs: {
			readFile: async (...args) => {
				if (++reads === failOnRead) throw Object.assign(new Error("Access denied"), { code: "EACCES" });
				return fs.readFile(...args);
			},
		} });
		const contents = JSON.stringify({ version: 1, currentMode: "default", modes: {
			default: { provider: "test", modelId: "original", thinkingLevel: "high" },
			fast: { thinkingLevel: "off" },
		} });
		await fs.writeFile(h.file, contents);
		const session = h.processHarness();
		session.ctx.hasUI = true;
		await assert.rejects(session.mode("fast"), /Access denied/);
		assert.equal(await fs.readFile(h.file, "utf8"), contents);
		assert.ok(session.notifications.some(({ level }) => level === "error"));
	}
});

test("configuration corrupted between load and save is not overwritten", async (t) => {
	const h = await setup(t);
	const session = h.processHarness({ afterModel: () => fs.writeFile(h.file, "{corrupt during save") });
	session.ctx.hasUI = true;
	await assert.rejects(session.mode("fast"), /Cannot load modes/);
	assert.equal(await fs.readFile(h.file, "utf8"), "{corrupt during save");
	assert.ok(session.notifications.some(({ level }) => level === "error"));
});

test("fresh sessions start in default despite a previously saved fast selection", async (t) => {
	const h = await setup(t);
	await h.processHarness().mode("fast");
	const fresh = h.processHarness({ thinking: "off", modelId: "startup", branch: [
		{ type: "model_change" }, { type: "thinking_level_change" },
	] });
	await fresh.start();
	assert.deepEqual(fresh.applied, [["model", "original"], ["thinking", "high"]]);
});

test("resumed sessions keep both matching and custom model/thinking selections", async (t) => {
	const h = await setup(t);
	await h.processHarness().mode("fast");
	for (const modelId of ["original", "other"]) {
		const resumed = h.processHarness({ thinking: "low", modelId, branch: [{ type: "message" }] });
		await resumed.start();
		assert.deepEqual(resumed.applied, []);
	}
	const matching = h.processHarness({ thinking: "off", branch: [{ type: "message" }] });
	await matching.start();
	assert.deepEqual(matching.applied, []);
});

test("saving merges unrelated edits made by another running Pi instance", async (t) => {
	const h = await setup(t);
	await h.processHarness().mode("fast");
	const data = await h.read();
	data.extra = { keep: true };
	data.modes.default.extra = "keep this too";
	await fs.writeFile(h.file, JSON.stringify(data));
	const other = h.processHarness({ modelId: "other", thinking: "low", branch: [{ type: "message" }] });
	await other.start();
	const local = h.processHarness({ afterModel: () => other.mode("store review") });
	await local.mode("default");
	const saved = await h.read();
	assert.equal(saved.currentMode, "default");
	assert.deepEqual(saved.modes.review, { provider: "test", modelId: "other", thinkingLevel: "low" });
	assert.deepEqual(saved.extra, { keep: true });
	assert.equal(saved.modes.default.extra, "keep this too");
});

test("resume and reload keep selections even without message entries", async (t) => {
	const h = await setup(t);
	await h.processHarness().mode("fast");
	for (const reason of ["resume", "reload", "fork"]) {
		const resumed = h.processHarness({ thinking: "low", modelId: "other" });
		await resumed.start(reason);
		assert.deepEqual(resumed.applied, [], reason);
	}
	const resumedAtStartup = h.processHarness({ thinking: "low", modelId: "other", sessionFile: h.file });
	await resumedAtStartup.start();
	assert.deepEqual(resumedAtStartup.applied, [], "existing session file at startup");
});
