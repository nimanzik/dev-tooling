import type { ExtensionAPI, ExtensionContext, Theme } from "@mariozechner/pi-coding-agent";
import { Box, Text } from "@mariozechner/pi-tui";

const MASCOT_MESSAGE_TYPE = "pi-mascot-startup";
const SHOW_ON_EVERY_SESSION_START = false;

function getPiMascot(theme: Theme): string[] {
	return [
		"",
		theme.fg("accent", "  ██████"),
		theme.fg("accent", "  ██  ██"),
		theme.fg("accent", "  ████  ██"),
		theme.fg("accent", "  ██    ██"),
		"",
	];
}

function alreadyShownInCurrentBranch(ctx: ExtensionContext): boolean {
	const branch = ctx.sessionManager.getBranch() as Array<{ type?: string; customType?: string }>;
	return branch.some((entry) => entry.type === "custom" && entry.customType === MASCOT_MESSAGE_TYPE);
}

export default function piMascotExtension(pi: ExtensionAPI) {
	pi.registerMessageRenderer(MASCOT_MESSAGE_TYPE, (_message, _options, theme) => {
		const box = new Box(1, 1, (text) => theme.bg("customMessageBg", text));
		box.addChild(
			new Text(
				[
					...getPiMascot(theme),
					theme.fg("accent", "    " + theme.bold("Welcome to Pi!")),
					theme.fg("muted", "    Let's build."),
				].join("\n") + "\n",
				0,
				0,
			),
		);
		return box;
	});

	pi.on("session_start", async (event, ctx) => {
		if (!SHOW_ON_EVERY_SESSION_START && event.reason !== "startup") return;
		if (alreadyShownInCurrentBranch(ctx)) return;
		pi.sendMessage({
			customType: MASCOT_MESSAGE_TYPE,
			content: "",
			display: true,
		});
	});
}
