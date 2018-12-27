import util from "util";
import child_process from "child_process";
const exec = async (program: string) => {
  const { stdout, stderr } = await util.promisify(child_process.exec)(program);
  if (stderr) {
    throw new Error(stderr);
  }
  return stdout;
};

interface IGenericResult {
  items: {
    metadata: {
      name: string;
    };
  }[];
}

export const getNamespaces = async () => {
  const stdout = await exec(`kubectl get namespaces -o json`);
  const data: IGenericResult = JSON.parse(stdout);
  return data.items.map(n => n.metadata.name);
};
export const getServices = async (namespace: string) => {
  const stdout = await exec(
    `kubectl get services --namespace=${namespace} -o json`
  );
  const data: IGenericResult = JSON.parse(stdout);

  return data.items.map(n => n.metadata.name);
};
export const getServiceHostname = async (name: string, namespace: string) => {
  const stdout = await exec(
    `kubectl get service "${name}" --namespace=${namespace} -o json`
  );
  try {
    return JSON.parse(stdout).status.loadBalancer.ingress[0].hostname as string;
  } catch (e) {
    console.log({
      name,
      namespace,
      message: `Error: ${e}`
    });
    return null;
  }
};
