const program = require("commander");

program
  .version("0.1.0")
  .command("add OPTIONS", "add a new record", { isDefault: true });

program.parse(process.argv);
