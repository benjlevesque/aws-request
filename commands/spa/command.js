import init from ".";
export const command = "spa";
export const describe =
  "Creates a SPA configuration with a S3 bucket, CloudFront distribution and Route53 records";

export function builder(yargs) {
  yargs.options({
    subdomain: { describe: "Subdomain to create ({xxx}.example.com)" },
    target: { describe: "Target" },
    region: { describe: "AWS Region" },
    domain: { describe: "Domain" },
    comment: { describe: "Comment", alias: "c" }
  });

  return yargs;
}

export const handler = init;
