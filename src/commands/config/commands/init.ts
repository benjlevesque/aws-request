import AWS from "aws-sdk";
import inquirer from "inquirer";
import { getRegions } from "../../../lib/aws/acm";
import * as config from "../../../lib/config";
const homedir = require("os").homedir();

interface IOptions {
  domainName: string;
  region: string;
}
export const command = "init";
export const describe = "Initialze";
export const handler = async () => {
  const defaultRegion = "eu-west-1";
  const loadRegions = async () => {
    const regions = await getRegions(defaultRegion);
    return regions.map(x => x.RegionName) as ReadonlyArray<string>;
  };
  const result = await inquirer.prompt<IOptions>([
    {
      message: "What is your default domain name",
      name: "domainName",
      default: config.get("domainName")
    },
    {
      name: "region",
      message: "What is your default Region ?",
      default: config.get("region") || defaultRegion,
      choices: loadRegions,
      type: "list"
    }
  ]);

  config.add("region", result.region);
  config.add("domainName", result.domainName);
};
