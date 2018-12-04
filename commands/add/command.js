import add from ".";
import { getNamespaces, getServices } from "./lib/k8sutils";
export const command = "add";
export const describe = "adds a route";

export function builder(yargs) {
  yargs.options({
    url: { describe: "Url to create" },
    target: { describe: "Target" },
    region: { describe: "AWS Region", default: "eu-west-1" },
    domain: { describe: "Domain" },
    comment: { describe: "Comment", alias: "c" },
    "kube-namespace": { describe: "Kubernetes Namespace", type: "string" },
    "kube-service": { describe: "Kubernetes Service Name", type: "string" }
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
