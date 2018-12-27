import add from ".";
import { Argv } from "yargs";
import { getNamespaces, getServices } from "../../lib/k8s/utils";

export const command = "k8s <subdomain>";
export const describe = "adds a route to a k8s service";

export function builder(yargs: Argv) {
  yargs
    .options({
      namespace: {
        describe: "Kubernetes Namespace",
        type: "string",
        demandOption: true
      },
      service: {
        describe: "Kubernetes Service Name",
        type: "string",
        demandOption: true
      },
      region: { describe: "AWS Region" },
      domainName: { describe: "Domain Name" },
      comment: { describe: "Comment", alias: "c" }
    })
    .positional("subdomain", {
      description: "Subdomain to create (`xxx` for {xxx}.example.com)"
    });

  // .completion("completion", async (current, argv, done) => {
  //   if (argv.kubeNamespace === "") {
  //     const result = await getNamespaces();
  //     done(result);
  //   } else if (argv.kubeNamespace && argv.kubeService === "") {
  //     const result = await getServices(argv.kubeNamespace);
  //     done(result);
  //   } else {
  //     done(null);
  //   }
  // });
  return yargs;
}

export const handler = add;

export interface IK8sOptions {
  namespace: string;
  service: string;
}

export const k8sOptions = [
  {
    name: "namespace",
    choices: getNamespaces,
    type: "list"
  },
  {
    name: "service",
    choices: async (answers: IK8sOptions) => {
      return getServices(answers.namespace);
    },
    type: "list"
  }
];
