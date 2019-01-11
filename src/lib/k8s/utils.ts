import util from "util";
import child_process from "child_process";
import { ImageTag } from "../types";

const execRaw = util.promisify(child_process.exec);
const exec = async <T>(program: string) => {
  const { stdout, stderr } = await execRaw(program);
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
interface IDeploymentResult extends IGenericResult {
  spec: {
    template: {
      spec: {
        containers: [
          {
            image: string;
            name: string;
            imagePullPolicy: string;
          }
        ];
      };
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

export const getDeployments = async (namespace: string) => {
  const data = await exec<IListResult<IDeploymentResult>>(
    `kubectl get deployments --namespace=${namespace} -o json`
  );
  return data.items.map(n => n.metadata.name);
};

export const getContainers = async (namespace: string, deployment: string) => {
  const data = await exec<IDeploymentResult>(
    `kubectl get deployments ${deployment} --namespace=${namespace} -o json`
  );
  return data.spec.template.spec.containers.map(c => c.name);
};

export const getDeploymentImage = async (
  namespace: string,
  deployment: string,
  container: string
) => {
  const data = await exec<IDeploymentResult>(
    `kubectl get deployments ${deployment} --namespace=${namespace} -o json`
  );
  const containers = data.spec.template.spec.containers;
  for (const c of containers) {
    if (c.name === container) return c.image;
  }
  return null;
};

export async function getCurrentImageTag({
  region,
  deploymentName,
  namespace
}: {
  region: string;
  deploymentName: string;
  namespace: string;
}): Promise<ImageTag> {
  const { stdout } = await execRaw(
    `kubectl get -o=jsonpath='{$.spec.template.spec.containers[:1].image}' --namespace ${namespace} deployment ${deploymentName}`
  );
  var myRegexp = /(?<image>.*):(?<tag>.*)/g;
  var match = myRegexp.exec(stdout);
  if (match && match.length > 2) {
    return {
      image: match[1],
      tag: match[2]
    };
  }
  return null;
}

export async function updateDeployment({
  namespace,
  deploymentName,
  containerName,
  image,
  tag
}: {
  namespace: string;
  deploymentName: string;
  containerName: string;
  image: string;
  tag: string;
}) {
  const { stdout } = await execRaw(
    `kubectl set image --namespace=${namespace} deployment.apps/${deploymentName} ${containerName}=${image}:${tag}`
  );
  return stdout;
}
