import remove from ".";

export const command = "rm";
export const describe = "removes a route";
export const builder = yargs => yargs;
export const handler = remove;
