import add from ".";
// import { getNamespaces, getServices } from "./lib/k8utils";
export const command = "k8s";
export const describe = "adds a route to a k8s service";

export function builder(yargs) {
  yargs.options({
    url: {
      describe: "URL to create (for {xxx}.example.com, you can enter {xxx})"
    },
    region: { describe: "AWS Region" },
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
