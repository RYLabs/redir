import * as fs from "fs";
import { findScript, localScriptsDir } from "./redir/ScriptLocator";

export async function runScript(
  name: any,
  input: Promise<any>,
  context: any
): string {
  const script = await findScript(name);
  return await script.run(input, context);
}

export function ensureProject() {
  const dir = localScriptsDir();
  return new Promise((resolve, reject) =>
    fs.access(dir, fs.constants.D_OK | fs.constants.W_OK, err => {
      if (err && err.code === "ENOENT") {
        fs.mkdir(
          dir,
          { recursive: true },
          err => (err ? reject(err) : resolve())
        );
      } else {
        resolve();
      }
    })
  );
}
