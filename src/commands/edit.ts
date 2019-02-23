import { exec } from "child_process";
import { Command, flags } from "@oclif/command";
import { ensureProject } from "../redir";
import { getScriptFile } from "../redir/ScriptLocator";

export default class Edit extends Command {
  static description = "Edit a redir script";

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [
    {
      name: "name",
      required: true,
      description: "name of the script"
    }
  ];

  async run() {
    const { args, flags } = this.parse(Edit);

    const editor = process.env.REDIR_EDITOR || process.env.EDITOR;
    if (!editor) {
      this.error(`No editor defined in REDIR_EDITOR or EDITOR`);
      this.exit(1);
      return;
    }

    await ensureProject();

    const { stdout, stderr } = await exec(
      `${editor} ${getScriptFile(args.name)}`
    );
    if (stderr && stderr.length) {
      this.error(`[${args.name}] error:`, stderr);
    }
    if (stdout && stdout.length) {
      this.log(`[${args.name}]`, stdout);
    }
  }
}
