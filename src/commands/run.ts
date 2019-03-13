import { Command, flags } from "@oclif/command";
import * as getStdin from "get-stdin";
import * as log from "debug";
import fetch from "../redir/fetch";
import PipelineBuilder from "../redir/PipelineBuilder";

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
      builder = new PipelineBuilder();

    for (let stage of argv) {
      builder.startStage();
      const multi = stage.split(",");
      if (multi.length > 1) {
        for (let scriptName of multi) {
          builder.addScript(scriptName);
        }
      } else {
        builder.addScript(stage);
      }
    }

    const pipeline = builder.build();

    debug("pipeline:", pipeline);

    try {
      let result = await pipeline.run(input);
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
