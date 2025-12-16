import { Command } from "commander";
import { chatCommand } from "./commands/chat";
import { initCommand } from "./commands/init";
import { ghCommand } from "./gh";


export const cli = new Command("r5dan");
cli.addCommand(chatCommand);
cli.addCommand(initCommand);
cli.addCommand(ghCommand);
cli.parse();