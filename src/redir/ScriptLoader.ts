import Script from "./Script";

export async function loadScript(name: string, file: string): Script {
  return new Script(name, file);
}
