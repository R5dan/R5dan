import { Command } from "commander";
import { $ } from "bun";

export const initCommand = new Command("init");

initCommand.description("Initialize a bun project");
initCommand.action(async () => {
  await $`bun init`;
  await $`git init`;
  await $`git add .`;
  await $`git commit -m "init"`;
});
