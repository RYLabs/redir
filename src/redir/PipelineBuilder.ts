import * as log from "debug";
import Pipeline, { Stage, Task, scriptFunction } from "./Pipeline";

const debug = log("redir:PipelineBuilder");

export default class PipelineBuilder {
  stages = [];
  currentStage = null;

  startStage() {
    this.currentStage = [];
    this.stages.push(this.currentStage);
  }

  addScript(name) {
    debug("adding script:", name);
    const components = name.split("@"),
      redir = scriptFunction(components[0]);

    this.currentStage.push(
      new Task(components[0], redir, components.length > 1 ? components[1] : null)
    );
  }

  addRedir(name, redir) {
    this.currentStage.push(new Task(name, redir));
  }

  build(): Pipeline {
    return new Pipeline(this.stages.map(tasks => new Stage(tasks)));
  }
}
