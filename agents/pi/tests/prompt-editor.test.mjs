import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as nodeModule from "node:module";
import vm from "node:vm";
import nodeTest from "node:test";

const stripTypeScriptTypes = nodeModule.stripTypeScriptTypes ?? ((code) => code);

let piTui;
try {
	piTui = nodeModule.createRequire(import.meta.url)("@earendil-works/pi-tui");
} catch {
	piTui = undefined;
}

const test = piTui
	? nodeTest
	: (name, fn) => nodeTest(name, { skip: "@earendil-works/pi-tui not available; set NODE_PATH to a Pi install" }, fn);

const { Input, SelectList, fuzzyFilter, getKeybindings, truncateToWidth } = piTui ?? {};
let pickModel;
if (piTui) {
	const source = readFileSync(new URL("../extensions/prompt-editor.ts", import.meta.url), "utf8");
	const start = source.indexOf("async function pickModelForModeUI(");
	const end = source.indexOf("async function pickThinkingLevelForModeUI(");
	if (start === -1 || end <= start) throw new Error("prompt-editor.ts marker(s) moved; update this test");
	const pickerSource = source.slice(start, end);
	pickModel = vm.runInNewContext(stripTypeScriptTypes(pickerSource) + "\npickModelForModeUI", {
		Input, SelectList, fuzzyFilter, truncateToWidth,
	});
}
const models = [
	{ provider: "first", id: "shared" },
	{ provider: "second", id: "shared" },
];

function context(select) {
	return {
		hasUI: true,
		mode: "rpc",
		model: models[0],
		modelRegistry: { getAvailable: () => models },
		ui: { select, notify() {} },
	};
}

test("model picker uses the public registry and returns the selected provider and model", async () => {
	const ctx = context(async (_title, options) => {
		assert.deepEqual(Array.from(options), ["second/shared", "first/shared"]);
		return "second/shared";
	});
	const result = await pickModel(ctx, { provider: "second", modelId: "shared" });
	assert.equal(result.provider, "second");
	assert.equal(result.modelId, "shared");
	assert.equal(models[0].provider, "first", "must not reorder the registry array");
});

test("model picker can be cancelled and defaults to the session model", async () => {
	const ctx = context(async (_title, options) => {
		assert.equal(options[0], "first/shared");
		return undefined;
	});
	assert.equal(await pickModel(ctx, {}), undefined);
});

function terminalContext(rows, interact) {
	const ctx = context(() => assert.fail("terminal picker must not use the unbounded dialog"));
	ctx.mode = "tui";
	ctx.ui.custom = (factory) => new Promise((resolve) => {
		const theme = { fg: (_color, text) => text };
		const tui = { terminal: { rows }, requestRender() {} };
		const picker = factory(tui, theme, getKeybindings(), resolve);
		interact(picker, tui);
	});
	return ctx;
}

test("terminal model picker stays bounded, scrolls, and searches a large catalog", async () => {
	const catalog = Array.from({ length: 100 }, (_, i) => ({ provider: "provider", id: `model-${i}` }));
	const ctx = terminalContext(12, (picker, tui) => {
		picker.focused = true;
		assert.ok(picker.render(60).length <= tui.terminal.rows);
		for (let i = 0; i < 80; i++) picker.handleInput("\x1b[B");
		assert.match(picker.render(60).join("\n"), /→ provider\/model-80/);
		tui.terminal.rows = 8;
		assert.ok(picker.render(60).length <= tui.terminal.rows, "must adapt after resizing");
		picker.handleInput("model-99");
		assert.match(picker.render(60).join("\n"), /→ provider\/model-99/);
		picker.handleInput("\r");
	});
	ctx.modelRegistry.getAvailable = () => catalog;
	const result = await pickModel(ctx, {});
	assert.equal(result.provider, "provider");
	assert.equal(result.modelId, "model-99");
});

test("terminal picker prefers the mode model and cancels after a search with no matches", async () => {
	const ctx = terminalContext(24, (picker) => {
		assert.match(picker.render(60).join("\n"), /→ second\/shared/);
		picker.handleInput("no-such-model");
		picker.render(60);
		picker.handleInput("\r");
		picker.handleInput("\x1b");
	});
	assert.equal(await pickModel(ctx, { provider: "second", modelId: "shared" }), undefined);
});

test("model picker handles unavailable models and non-UI contexts", async () => {
	const ctx = context(() => assert.fail("must not open a dialog"));
	ctx.modelRegistry.getAvailable = () => [];
	assert.equal(await pickModel(ctx, {}), undefined);
	assert.equal(await pickModel({ hasUI: false }, {}), undefined);
});
