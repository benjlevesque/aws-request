import util from "util";
import child_process from "child_process";
const exec = async program => {
  const { err, stdout, stderr } = await util.promisify(child_process.exec)(
    program
  );
  console.log(stderr);
  if (err || stderr) {
    throw { err, stderr };
  }
  return stdout;
};

export const getNamespaces = async () => {
  const stdout = await exec(`kubectl get namespaces -o json`);
  return JSON.parse(stdout).items.map(n => n.metadata.name);
};
export const getServices = async namespace => {
  const stdout = await exec(
    `kubectl get services --namespace=${namespace} -o json`
  );
  return JSON.parse(stdout).items.map(n => n.metadata.name);
};
export const getServiceHostname = async (name, namespace) => {
  const stdout = await exec(
    `kubectl get service "${name}" --namespace=${namespace} -o json`
  );
  try {
    return JSON.parse(stdout).status.loadBalancer.ingress[0].hostname;
  } catch (e) {
    console.log({
      name,
      namespace,
      message: `Error: ${e}`
    });
    return null;
  }
};
