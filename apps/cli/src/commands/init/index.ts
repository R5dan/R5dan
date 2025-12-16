import { Command } from "commander";
import { $ } from "bun";

export const command = new Command("init");

command.description("Initialize a bun project");
command.action(async () => {
	await $`bun init`;
	await $`git init`;
	await $`git add .`;
	await $`git commit -m "init"`;
});
