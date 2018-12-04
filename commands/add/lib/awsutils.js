import { Route53 } from "aws-sdk";

const route53 = new Route53();
export const getZones = params =>
  new Promise(r => {
    route53.listHostedZones(params || {}, function(err, data) {
      if (err) throw err;
      r(data.HostedZones);
    });
  });

export const getOptions = (url, zoneId, targetUrl, targetZoneId, comment) => ({
  ChangeBatch: {
    Changes: [
      {
        Action: "CREATE",
        ResourceRecordSet: {
          Name: url,
          Type: "A",
          AliasTarget: {
            HostedZoneId: targetZone,
            DNSName: target,
            EvaluateTargetHealth: false
          }
        }
      }
    ],
    Comment: `[auto] ${comment || ""}`
  },
  HostedZoneId: zoneId
});

export const changeResourceRecordSets = ({
  url,
  zoneId,
  targetUrl,
  targetZoneId,
  comment
}) => {
  // new Promise(r => {
  //   route53.changeResourceRecordSets(
  //     getOptions({
  //       url,
  //       zoneId,
  //       targetUrl,
  //       targetZoneId,
  //       comment
  //     }),
  //     function(err, data) {
  //       if (err) throw err;
  //       r(data.ChangeInfo);
  //     }
  //   );
  // }
  console.log(
    getOptions({
      url,
      zoneId,
      targetUrl,
      targetZoneId,
      comment
    })
  );
};

export const AwsZones = {
  "eu-west-1": {
    elb: "Z32O12XQLNTSW2",
    s3: "Z1BKCTXD74EZPE"
  }
};
