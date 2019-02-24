import { Command, flags } from "@oclif/command";
import * as getStdin from "get-stdin";
import { runScript } from "../redir";
import fetch from "../redir/fetch";

export default class Run extends Command {
  static description = "Execute a redir script";

  static flags = {
    help: flags.help({ char: "h" }),
    fetch: flags.boolean({ description: "Pass result to fetch" })
  };

  static args = [
    {
      name: "name",
      required: true,
      description: "name of the script to run"
    }
  ];

  async run() {
    const { args, flags } = this.parse(Run),
      input = getStdin();

    try {
      let result = await runScript(args.name, input);
      if (flags.fetch) {
        result = await fetch(result);
      }
      this.log(result);
    } catch (err) {
      this.error(`Error running command \`${args.name}\`: ${err.message}`);
      this.exit(1);
    }
  }
}
