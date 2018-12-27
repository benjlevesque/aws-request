import { Argv } from "yargs";

export default async (argv: string[]) => {
  const cli = require("yargs")(argv) as Argv<any>;
  cli
    .usage("Usage: $0 <command> [options]")
    .demandCommand(1, "")
    // .getCompletion(["--kube-namespace"], completions => {
    //   console.log(completions);
    // });
    //.recommendCommands()
    .completion();

  cli.commandDir("./commands", {
    extensions: process.env.NODE_ENV === "development" ? ["ts"] : ["js"],
    recurse: true,
    exclude: /commands\/(.)*\/commands/
  });
  cli.parse(argv);
};
