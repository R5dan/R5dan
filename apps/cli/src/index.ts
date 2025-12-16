import { Command } from "commander";
import { chatCommand } from "./commands/chat";


export const cli = new Command("r5dan");
cli.addCommand(chatCommand);

cli.parse();