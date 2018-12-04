import { getServiceHostname } from "./lib/k8sutils";
import { AwsZones, getZones, changeResourceRecordSets } from "./lib/awsutils";

export default async argv => {
  let {
    url,
    target,
    region,
    comment,
    domain,
    kubeService,
    kubeNamespace
  } = argv;
  if (!url) {
    return -1;
  }
  if (url.indexOf(domain) === -1) {
    url = `${url}.${domain}`;
  }

  if (!target) {
    if (!(kubeService && kubeNamespace)) {
      return -1;
    }
    target = await getServiceHostname(kubeService, kubeNamespace);
    console.log({ target });
  }

  const zones = await getZones();
  const requestZone = zones.filter(z => z.Name === `${domain}.`)[0];
  const targetZone =
    target.indexOf("eu-west-1.elb.amazonaws.com") > 0
      ? AwsZones[region]["elb"]
      : target.indexOf("s3.website.amazonaws.com") > 0
      ? AwsZones[region]["s3"]
      : null;
  if (!requestZone || !targetZone) {
    console.log({ requestZone, targetZone });
    throw new Error("invalid zone");
  }
  const info = await changeResourceRecordSets({
    url,
    zoneId: requestZone.Id,
    targetUrl: target,
    targetZoneId: targetZone,
    comment
  });
  console.log(info);
};
