import { getServiceHostname } from "../../lib/k8s/utils";
import { createDnsRecord } from "../../lib/aws/route53";
import sleep from "../../dist/lib/sleep";

export interface IK8sCommandParams {
  subdomain: string;
  region: string;
  comment: string;
  domainName: string;
  service: string;
  namespace: string;
  setStatus: (msg: string) => void;
}

export default async ({
  subdomain,
  region,
  comment,
  domainName,
  service,
  namespace,
  setStatus
}: IK8sCommandParams) => {
  if (!(service && namespace)) {
    throw new Error("Kubernetes namespace and service are mandatory");
  }
  if (!setStatus) {
    setStatus = console.log;
  }
  const url = `${subdomain}.${domainName}`;

  setStatus("Getting load balancer public DNS...");
  const target = await getServiceHostname(service, namespace);
  setStatus(`LoadBalancer DNS : ${target}`);
  await sleep(1000);
  if (!target) {
    throw new Error("Could not get target");
  }
  setStatus(`Create DNS Record : ${url} => ${target}`);
  await createDnsRecord({
    domainName,
    region,
    comment,
    target,
    url
  });
  setStatus(
    `DNS created, you can check it at http://${url}. It might take a few minutes to replicate.`
  );
};
