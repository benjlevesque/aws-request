import yargs from "yargs/yargs";
import fs from "fs";
import path from "path";

function loadCommands(cli) {
  const dirs = fs.readdirSync("commands");
  for (const dir of dirs) {
    const packPath = path.join(__dirname, "commands", dir, "command.js");
    if (fs.existsSync(packPath)) {
      cli.command(require(packPath));
    }
  }
  return cli;
}

function main(argv) {
  const cli = yargs(argv)
    .usage("Usage: $0 <command> [options]")
    .demandCommand(1, "")
    .getCompletion(["--kube-namespace"], completions => {
      console.log(completions);
    });
  //.recommendCommands()
  //.completion();

  loadCommands(cli).parse(argv);
}

module.exports = main;
