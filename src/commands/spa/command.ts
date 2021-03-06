import createSpa from ".";
import { Argv } from "yargs";
import * as config from "../../lib/config";
export const command = "spa <subdomain>";
export const describe =
  "Creates a SPA configuration with a S3 bucket, CloudFront distribution and Route53 records";

export function builder(yargs: Argv) {
  yargs
    .options({
      region: {
        describe: "AWS Region",
        type: "string",
        default: config.get("region")
      },
      domainName: {
        describe: "Domain Name",
        type: "string",
        default: config.get("domainName")
      },
      comment: { describe: "Comment", type: "string", alias: "c" }
    })
    .positional("subdomain", {
      description: "Subdomain to create (`xxx` for {xxx}.example.com)"
    });

  return yargs;
}

export const handler = createSpa;
