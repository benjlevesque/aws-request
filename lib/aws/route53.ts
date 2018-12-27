import { Route53 } from "aws-sdk";
import { parseTemplate } from "../templateManager";

const route53 = new Route53();
const getZones = async (params: Route53.ListHostedZonesRequest) => {
  const promiseResult = await route53.listHostedZones(params || {}).promise();
  const response = promiseResult.$response;
  if (response.error) throw response.error;
  if (!response.data) throw new Error("void data");
  return response.data.HostedZones;
};

const getZone = async (
  domainName: string,
  params: Route53.ListHostedZonesRequest = {}
) => {
  const zones = await getZones(params);
  return zones.find(z => z.Name === `${domainName}.`);
};

const AwsZones = new Map<string, Map<string, string>>([
  [
    "eu-west-1",
    new Map<string, string>([
      ["s3.website.amazonaws.com", "Z1BKCTXD74EZPE"],
      ["cloudfront.net", "Z2FDTNDATAQYW2"],
      ["elb.amazonaws.com", "Z32O12XQLNTSW2"]
    ])
  ]
]);

const getTargetZone = (target: string, region: string) => {
  const regionZone = AwsZones.get(region);
  if (!regionZone) throw new Error(`zone not found for region ${region}`);
  for (const service of regionZone.keys()) {
    if (target.indexOf(service) > 0) {
      return regionZone.get(service);
    }
  }
  throw new Error(
    `Service zone not found for region ${region} and url ${target}`
  );
};

const changeResourceRecordSets = async (params: any) => {
  const options = await parseTemplate("route53-create-record", params);
  const promiseResult = await route53
    .changeResourceRecordSets(options)
    .promise();
  const response = promiseResult.$response;
  if (response.error) throw response.error;
  if (!response.data) throw new Error("void data");
  return response.data;
};

interface IParams {
  domainName: string;
  url: string;
  target: string;
  comment?: string;
  region: string;
}

export const createDnsRecord = async ({
  domainName,
  url,
  target,
  region,
  comment
}: IParams) => {
  const zone = await getZone(domainName);
  const targetZone = getTargetZone(target, region);

  if (!zone || !targetZone) {
    throw new Error("invalid zone");
  }
  const info = await changeResourceRecordSets({
    url,
    zoneId: zone.Id,
    targetUrl: target,
    targetZoneId: targetZone,
    comment: comment || ""
  });
  return info;
};
