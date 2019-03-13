import * as vm from "vm";
import * as fs from "fs";
import * as log from "debug";
import * as moment from "moment-timezone";
import * as matter from "gray-matter";
import * as _ from "lodash";
import * as netrc from "netrc";
import fetch from "./fetch";
import PipelineBuilder from "./PipelineBuilder";

const debug = log("redir:Script");

export default class Script {
  constructor(name: string, file: string) {
    this.name = name;
    this.file = file;
  }

  async run(input: Promise<any>, context: any): string {
    debug("running script:", this.name);

    const { data, content } = await this.loadScript(),
      builder = new PipelineBuilder();

    debug("script metadata:", data);

    if ('prerequisites' in data) {
      builder.startStage();
      for (let prereq of data.prerequisites) {
        builder.addScript(prereq);
      }
    }

    builder.startStage();
    builder.addRedir(this.name, async (input, context) => {
      debug("creating vm...");
      const [vm, inputString] = await Promise.all([
        this.createVM(data, content, context),
        input
      ]);

      if (!("handle" in vm)) {
        debug("missing handle method!");
        throw new Error("Expecting handle(input) method in script");
      }

      debug("handling input:", inputString);
      let result = await vm.handle(inputString);
      if (data.fetch === true) {
        debug("running fetch on initial result:", result);
        result = await fetch(result);
      }
      return result;
    });

    const pipeline = builder.build();
    return pipeline.run(input, context);
  }

  async createVM(data: any, content: string, context: any): any {
    const sandbox = { moment, _, ...context };

    if ("netrc" in data) {
      const logins = _.flatten([data.netrc]),
        myNetrc = netrc();

      sandbox.netrc = {};
      for (let name of logins) {
        debug("loading credentials for:", name);
        sandbox.netrc[name] = myNetrc[name];
      }
    }

    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);

    debug("sandbox keys:", Object.keys(sandbox));

    return sandbox;
  }

  async loadScript(): any {
    return await matter.read(this.file, {
      delims: ["/* ---", "--- */"]
    });
  }
}
