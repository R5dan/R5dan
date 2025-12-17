import { z } from "zod";
import { Command } from "commander";
import { render } from "ink";
import { App } from "./component";

export const chatCommand = new Command("chat").action(async () => {
  const { waitUntilExit } = render(<App />);

  await waitUntilExit();
});
