import { Route53 } from "aws-sdk";
import { parseTemplate } from "../templateManager";

const route53 = new Route53();
const getZones = params =>
  new Promise(r => {
    route53.listHostedZones(params || {}, function(err, data) {
      if (err) throw err;
      r(data.HostedZones);
    });
  });

const getZone = async (domain, params = {}) => {
  const zones = await getZones(params);
  return zones.find(z => z.Name === `${domain}.`);
};

const getTargetZone = target => {
  return target.indexOf("elb.amazonaws.com") > 0
    ? AwsZones[region]["elb"]
    : target.indexOf("cloudfront.net") > 0
    ? AwsZones[region]["cloudfront"]
    : target.indexOf("s3.website.amazonaws.com") > 0
    ? AwsZones[region]["s3"]
    : null;
};

const getOptions = params => parseTemplate("route53-create-record", params);

const changeResourceRecordSets = ({
  url,
  zoneId,
  targetUrl,
  targetZoneId,
  comment
}) => {
  new Promise(r => {
    route53.changeResourceRecordSets(
      getOptions({
        url,
        zoneId,
        targetUrl,
        targetZoneId,
        comment: comment || ""
      }),
      function(err, data) {
        if (err) throw err;
        r(data.ChangeInfo);
      }
    );
  });
};

const AwsZones = {
  "eu-west-1": {
    s3: "Z1BKCTXD74EZPE",
    cloudfront: "Z2FDTNDATAQYW2",
    elb: "Z32O12XQLNTSW2"
  }
};

export const createDnsRecord = async ({ domain, url, target, comment }) => {
  const zone = await getZone(domain);
  const targetZone = getTargetZone(target);

  if (!zone || !targetZone) {
    throw new Error("invalid zone");
  }
  const info = await changeResourceRecordSets({
    url,
    zoneId: zone.Id,
    targetUrl: target,
    targetZoneId: targetZone,
    comment
  });
  return info;
};
