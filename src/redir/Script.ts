import * as vm from "vm";
import * as fs from "fs";
import * as log from "debug";
import * as moment from "moment-timezone";
import * as matter from "gray-matter";
import * as _ from "lodash";
import * as netrc from "netrc";

const debug = log("redir:Script");

export default class Script {
  constructor(name: string, file: string) {
    this.name = name;
    this.file = file;
  }

  async run(input): string {
    debug("creating vm...");
    const [vm, inputString] = await Promise.all([this.createVM(), input]);
    if ("handle" in vm) {
      debug("handling input:", inputString);
      return await vm.handle(inputString);
    } else {
      debug("missing handle method!");
      throw new Error("Expecting handle(input) method in script");
    }

    debug("data:", data);
    return content;
  }

  async createVM(): any {
    const { data, content } = await this.loadScript(),
      sandbox = { moment };

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
      delims: ["/* ----", "---- */"]
    });
  }
}
