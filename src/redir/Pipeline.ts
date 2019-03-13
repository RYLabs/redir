import * as log from "debug";
import * as Promise from "bluebird";
import { runScript } from "../redir";

const debug = log("redir:Pipeline");

export interface RedirFunction {
  (input: Promise, context: any): Promise;
}

export function scriptFunction(scriptName: String): RedirFunction {
  return function(input: Promise, context: any): Promise {
    return runScript(scriptName, input, context);
  }
}

export class Task {
  name: String;
  redir: RedirFunction;
  resultContextName: String;

  constructor(name, redir, resultContextName) {
    this.name = name;
    this.redir = redir;
    this.resultContextName =
      resultContextName == "" ? name : resultContextName;
  }

  get shouldStoreInContext(): boolean {
    return this.resultContextName != null;
  }

  storeInContext(results, context) {
    context[this.resultContextName] = results;
  }

  run(input: Promise, context: any): Promise  {
    return this.redir(input, context);
  }
}

export class Stage {
  tasks: Array<Task>;

  constructor(tasks: Array<Task>) {
    this.tasks = tasks;
  }

  run(input, context): Promise {
    debug(
      "Running scripts in parallel:",
      this.tasks.map(t => t.name).join(",")
    );

    return Promise.map(this.tasks, task => task.run(input, context)).then(
      results => {
        const newInput = {},
          newContext = {};

        for (let i = 0, len = this.tasks.length; i < len; i++) {
          let task = this.tasks[i];

          if (task.shouldStoreInContext) {
            debug(
              `Storing results of ${
                task.scriptName
              } in context as ${task.resultContextName}`
            );
            task.storeInContext(results[i], newContext);
          } else {
            newInput[task.scriptName] = results[i];
          }
        }

        Object.assign(context, newContext);

        const inputKeys = Object.keys(newInput);
        return inputKeys.length === 1 ? newInput[inputKeys[0]] : newInput;
      }
    );
  }
}

export default class Pipeline {
  stages: Array<Stage> = [];

  constructor(stages) {
    this.stages = stages;
  }

  run(input) {
    const context = {};
    debug("Starting pipeline run...");
    return Promise.reduce(
      this.stages,
      (acc, stage) => stage.run(acc, context),
      input
    );
  }
}
