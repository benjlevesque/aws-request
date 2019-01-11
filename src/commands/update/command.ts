import process, { IUpdateCommandParameters, prompt } from ".";
import { Argv } from "yargs";
import * as config from "../../lib/config";
export const command = "update";
export const describe = "update a Kubernetes deployment image";

export function builder(yargs: Argv) {
  yargs
    .options({
      region: {
        describe: "AWS Region",
        type: "string",
        default: config.get("region")
      },
      domainName: {
        describe: "Namespace",
        type: "string",
        default: config.get("namespace")
      },
      deploymentName: {
        describe: "K8S deployment name",
        type: "string"
      },
      containerName: {
        describe: "Container name",
        type: "string"
      }
    })
    .positional("subdomain", {
      description: "Subdomain to create (`xxx` for {xxx}.example.com)"
    });

  return yargs;
}

// export default async function main() {
//   await process({
//     region: "eu-west-1",
//     namespace: "external-homepage",
//     deploymentName: "website-nginx-deployment",
//     containerName: "website-nginx"
//   });
// }

export const handler = (argv: IUpdateCommandParameters) => {
  const { deploymentName, namespace, region } = argv;
  if (!deploymentName || !namespace || !region) {
    prompt(argv);
  } else {
    process(argv);
  }
};
