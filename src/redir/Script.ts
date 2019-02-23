import * as vm from "vm";
import * as fs from "fs";
import * as log from "debug";

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
  }

  async createVM(): any {
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(await this.loadScript(), sandbox);
    debug("sandbox:", sandbox);
    return sandbox;
  }

  loadScript() {
    return new Promise((resolve, reject) =>
      fs.readFile(
        this.file,
        "utf8",
        (err, contents) => (err ? reject(err) : resolve(contents))
      )
    );
  }
}
