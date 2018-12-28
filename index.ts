import { Argv } from "yargs";
import chalk from "chalk";
import * as config from "./lib/config";

export default async (argv: string[]) => {
  let help = "Usage: $0 <command> [options]";
  if (!config.exists()) {
    help += "\n";
    help += chalk.yellow("First time? Try running `$0 config init`");
  }
  const cli = require("yargs")(argv) as Argv<any>;
  cli
    .usage(help)
    .demandCommand(1, "")
    // .getCompletion(["--kube-namespace"], completions => {
    //   console.log(completions);
    // });
    //.recommendCommands()
    .completion("bash-completion");

  cli.commandDir("./commands", {
    extensions: process.env.NODE_ENV === "development" ? ["ts"] : ["js"],
    recurse: true,
    exclude: /commands\/(.)*\/commands/
  });
  cli.parse(argv);
};
