import { Command, flags } from "@oclif/command";
import * as glob from "glob";
import { basename, join } from "path";
import { localScriptsDir } from "../redir/ScriptLocator";

export default class Scripts extends Command {
  static description = "List available scripts";

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(Scripts);

    glob(join(localScriptsDir(), '**', '*.js'), (er, files) => {
      if (er) {
        this.error(`Error listing scripts: ${er.message}`);
        this.exit(1);
      } else {
        for (let fn of files) {
          this.log(basename(fn, ".js"));
        }
      }
    });
  }
}
