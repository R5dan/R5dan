import { Command } from "commander";
import open from "open";

export const ghCommand = new Command("gh");

ghCommand.description("GitHub commands");

ghCommand
  .command("open")
  .alias("o")
  .action(async () => {
    open("https://github.com");
  });

ghCommand.action(async () => {
  Bun.spawn(["lazygit"]);
});
