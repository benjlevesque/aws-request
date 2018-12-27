import { getServiceHostname } from "../../lib/k8s/utils";
import { createDnsRecord } from "../../lib/aws/route53";

export default async argv => {
  let { url, region, comment, domain } = argv;
  if (!url) {
    return -1;
  }
  if (url.indexOf(domain) === -1) {
    url = `${url}.${domain}`;
  }

  const { kubeService, kubeNamespace } = argv;
  if (!(kubeService && kubeNamespace)) {
    return -1;
  }
  const target = await getServiceHostname(kubeService, kubeNamespace);
  console.log({ target });

  await createDnsRecord({
    domain,
    region,
    comment,
    target,
    url
  });

  console.log(info);
};
