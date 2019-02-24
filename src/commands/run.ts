import { Command, flags } from "@oclif/command";
import * as getStdin from "get-stdin";
import * as Promise from "bluebird";
import * as log from "debug";
import { runScript } from "../redir";
import fetch from "../redir/fetch";

const debug = log("redir:run");

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
      input = getStdin(),
      context = {};

    try {
      let result = await Promise.reduce(
        argv,
        (input, name) => {
          const multi = name.split(",");
          if (multi.length > 1) {
            return this.runMulti(multi, Promise.resolve(input), context);
          } else {
            return runScript(name, Promise.resolve(input), context);
          }
        },
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

  runMulti(names: Array<string>, input: Promise<any>, context: any) {
    debug("Running scripts in parallel:", names);
    return Promise.map(names, name =>
      runScript(name.split("@")[0], input, context)
    ).then(results => {
      const newInput = {},
        newContext = {};

      for (let i = 0, len = names.length; i < len; i++) {
        let name = names[i];
        const index = name.indexOf("@");
        if (index >= 0) {
          const scriptName = name.substring(0, index);
          const contextName =
            index + 1 === name.length ? scriptName : name.substring(index + 1);
          debug(`Storing results of ${scriptName} in context`);
          newContext[contextName] = results[i];
        } else {
          newInput[name] = results[i];
        }
      }

      Object.assign(context, newContext);

      const inputKeys = Object.keys(newInput);
      return inputKeys.length === 1 ? newInput[inputKeys[0]] : newInput;
    });
  }
}
