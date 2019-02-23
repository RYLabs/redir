import { Command, flags } from "@oclif/command";
import * as getStdin from "get-stdin";
import { runScript } from "../redir";

export default class Run extends Command {
  static description = "Execute a redir script";

  static flags = {
    help: flags.help({ char: "h" })
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

    try {
      const result = await runScript(args.name, input);
      this.log(result);
    } catch (err) {
      this.error(`Error running command \`${args.name}\`: ${err.message}`);
      this.exit(1);
    }
  }
}
