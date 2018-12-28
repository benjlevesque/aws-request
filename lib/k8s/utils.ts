import util from "util";
import child_process from "child_process";

const exec = async <T>(program: string) => {
  const { stdout, stderr } = await util.promisify(child_process.exec)(program);
  if (stderr) {
    throw new Error(stderr);
  }
  const data: T = JSON.parse(stdout);
  return data;
};

interface IListResult<T> {
  items: T[];
}
interface IGenericResult {
  metadata: {
    name: string;
  };
}
interface IServiceResult extends IGenericResult {
  status: {
    loadBalancer: {
      ingress: {
        hostname: string;
      }[];
    };
  };
}

export const getNamespaces = async () => {
  const data = await exec<IListResult<IGenericResult>>(
    `kubectl get namespaces -o json`
  );

  return data.items.map(n => n.metadata.name);
};
export const getServices = async (namespace: string) => {
  const data = await exec<IListResult<IServiceResult>>(
    `kubectl get services --namespace=${namespace} -o json`
  );
  return data.items
    .filter(n => n.status.loadBalancer.ingress != null)
    .map(n => n.metadata.name);
};
export const getServiceHostname = async (name: string, namespace: string) => {
  const data = await exec<IServiceResult>(
    `kubectl get service "${name}" --namespace=${namespace} -o json`
  );
  try {
    return data.status.loadBalancer.ingress[0].hostname as string;
  } catch (e) {
    console.log({
      name,
      namespace,
      message: `Error: ${e}`
    });
    return null;
  }
};
