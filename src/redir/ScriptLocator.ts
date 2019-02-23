import { homedir } from "os";
import * as fs from "fs";
import * as path from "path";
import Script from "./Script";
import { loadScript } from "./ScriptLoader";

function checkScriptFile(fn) {
  return new Promise((resolve, reject) => {
    fs.access(
      fn,
      fs.constants.F_OK | fs.constants.R_OK,
      err => (err ? reject(err) : resolve())
    );
  });
}

export function localScriptsDir(): string {
  return path.join(homedir(), ".redir", "scripts", "local");
}

export function getScriptFile(name: string): string {
  return path.join(localScriptsDir(), `${name}.js`);
}

export async function findScript(name: string): Script {
  const fn = getScriptFile(name);
  try {
    await checkScriptFile(fn);
    return await loadScript(name, fn);
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`Script \`${name}\` not found`);
    }
    throw err;
  }
}
