import { Command, flags } from "@oclif/command";
import * as getStdin from "get-stdin";
import * as Promise from "bluebird";
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

  static strict = false;

  async run() {
    const { args, argv, flags } = this.parse(Run),
      input = getStdin();

    try {
      let result = await Promise.reduce(
        argv,
        (input, name) => runScript(name, Promise.resolve(input)),
        input
      );
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
