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

function prompt(text, timestamp) {
	return { type: "message", message: { role: "user", content: [{ type: "text", text }], timestamp } };
}

async function setup(t, { customDirectory = false, branch = [] } = {}) {
	const dir = await fs.mkdtemp(path.join(os.tmpdir(), "pi-history-"));
	t.after(() => fs.rm(dir, { recursive: true, force: true }));
	const cwd = path.join(dir, "project");
	const sessionDir = customDirectory ? path.join(dir, "custom-sessions")
		: path.join(dir, "sessions", `--${cwd.replace(/^[/\\]/, "").replace(/[/\\:]/g, "-")}--`);
	await fs.mkdir(sessionDir, { recursive: true });
	const sessionFile = path.join(sessionDir, "current.jsonl");
	const editors = [];
	const loaded = Promise.withResolvers();
	const events = new Map();
	// The external editor prepends each addToHistory call, so index zero is recalled first.
	class CustomEditor {
		history = [];
		addToHistory(text) { this.history.unshift(text); }
	}
	const register = vm.runInNewContext(source + "\nregisterExtension", {
		fs, path, os, process: { env: { PI_CODING_AGENT_DIR: dir }, pid: process.pid },
		CustomEditor, setTimeout, Buffer,
	});
	const ctx = {
		cwd, hasUI: true, model: { provider: "test", id: "model" },
		sessionManager: {
			getBranch: () => branch, getSessionFile: () => sessionFile, getSessionDir: () => sessionDir,
		},
		ui: {
			notify() {}, theme: {}, getEditorText: () => "",
			setEditorComponent: (factory) => {
				const editor = factory({ requestRender() {} }, {}, {});
				editors.push(editor);
				if (editors.length === 2) loaded.resolve(editor.history);
			},
		},
	};
	register({
		registerCommand() {}, registerShortcut() {}, on: (name, handler) => events.set(name, handler),
		getThinkingLevel: () => "off",
	});
	return {
		cwd, sessionDir, sessionFile, editors,
		writeSession: async (name, entries, project = cwd) => {
			const file = path.join(sessionDir, name);
			await fs.writeFile(file, [
				{ type: "session", version: 3, id: name, timestamp: new Date(0).toISOString(), cwd: project },
				...entries,
			].map((entry) => JSON.stringify(entry)).join("\n") + "\n");
			return file;
		},
		start: () => events.get("session_start")({ reason: "resume" }, ctx),
		history: async () => {
			const timer = setTimeout(() => loaded.reject(new Error("Earlier-session history was not installed")), 2000);
			try { return await loaded.promise; }
			finally { clearTimeout(timer); }
		},
	};
}

test("startup recalls prompts 40 through 11 from a previous session with 40 prompts", async (t) => {
	const h = await setup(t);
	await h.writeSession("earlier.jsonl", Array.from({ length: 40 }, (_, i) => prompt(`prompt ${i + 1}`, i + 1)));
	await h.start();
	assert.deepEqual(await h.history(), [
		"prompt 40", "prompt 39", "prompt 38", "prompt 37", "prompt 36", "prompt 35", "prompt 34", "prompt 33",
		"prompt 32", "prompt 31", "prompt 30", "prompt 29", "prompt 28", "prompt 27", "prompt 26", "prompt 25",
		"prompt 24", "prompt 23", "prompt 22", "prompt 21", "prompt 20", "prompt 19", "prompt 18", "prompt 17",
		"prompt 16", "prompt 15", "prompt 14", "prompt 13", "prompt 12", "prompt 11",
	]);
});

test("startup merges custom-directory sessions with only the active branch in newest-first recall order", async (t) => {
	const h = await setup(t, { customDirectory: true, branch: [prompt("active branch", 40)] });
	await h.writeSession("current.jsonl", [prompt("active branch", 40), prompt("abandoned branch", 50)]);
	const older = await h.writeSession("older.jsonl", [prompt("oldest", 10), prompt("second", 20)]);
	const newer = await h.writeSession("newer.jsonl", [prompt("third", 30)]);
	await fs.utimes(older, 1, 1);
	await fs.utimes(newer, 2, 2);
	await h.start();
	assert.deepEqual(h.editors[0].history, ["active branch"], "the first editor loads without earlier sessions");
	assert.deepEqual(await h.history(), ["active branch", "third", "second", "oldest"]);
});

test("a shared custom directory validates project headers even when they are outside the file tail", async (t) => {
	const h = await setup(t, { customDirectory: true });
	const padding = { type: "custom", data: "x".repeat(300 * 1024) };
	await h.writeSession("same-project.jsonl", [prompt("outside the tail", 1), padding, prompt("same project", 10)]);
	await h.writeSession("other-project.jsonl", [padding, prompt("private other-project prompt", 20)], `${h.cwd}-other`);
	await h.writeSession("missing-cwd.jsonl", [prompt("missing project", 30)], null);
	await fs.writeFile(path.join(h.sessionDir, "malformed.jsonl"), "{broken\n" + JSON.stringify(prompt("malformed header", 40)) + "\n");
	await fs.writeFile(path.join(h.sessionDir, "no-header.jsonl"), JSON.stringify(prompt("no header", 50)) + "\n");
	await fs.writeFile(path.join(h.sessionDir, "oversized-header.jsonl"), [
		{ type: "session", cwd: h.cwd, data: "x".repeat(20 * 1024) }, prompt("oversized header", 60),
	].map((entry) => JSON.stringify(entry)).join("\n") + "\n");
	await h.start();
	assert.deepEqual(await h.history(), ["same project"]);
});

test("the 30-prompt budget starts with the most recently modified session", async (t) => {
	const h = await setup(t);
	const older = await h.writeSession("older.jsonl", Array.from({ length: 20 }, (_, i) => prompt(`older ${i + 1}`, i + 1)));
	const newer = await h.writeSession("newer.jsonl", Array.from({ length: 20 }, (_, i) => prompt(`newer ${i + 1}`, i + 21)));
	await fs.utimes(older, 1, 1);
	await fs.utimes(newer, 2, 2);
	await h.start();
	const history = await h.history();
	assert.equal(history.length, 30);
	assert.equal(history[0], "newer 20");
	assert.equal(history[19], "newer 1");
	assert.equal(history[20], "older 20");
	assert.equal(history[29], "older 11");
});

test("merging previous and current session prompts keeps the newest 100 entries", async (t) => {
	const h = await setup(t, {
		branch: Array.from({ length: 90 }, (_, i) => prompt(`current ${i + 1}`, i + 101)),
	});
	await h.writeSession("earlier.jsonl", Array.from({ length: 40 }, (_, i) => prompt(`previous ${i + 1}`, i + 1)));
	await h.start();
	const history = await h.history();
	assert.equal(history.length, 100);
	assert.equal(history[0], "current 90");
	assert.equal(history[89], "current 1");
	assert.equal(history[90], "previous 40");
	assert.equal(history[99], "previous 31");
});
