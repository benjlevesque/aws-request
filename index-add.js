const aws = require("aws-sdk");
const program = require("commander");
const colors = require("colors");
const Client = require("kubernetes-client");
const util = require("util");
const child_process = require("child_process");
const exec = util.promisify(child_process.exec);

let route53;
const getZones = params =>
  new Promise(r => {
    route53.listHostedZones(params || {}, function(err, data) {
      if (err) throw err;
      r(data.HostedZones);
    });
  });
const changeResourceRecordSets = params =>
  new Promise(r => {
    route53.changeResourceRecordSets(params || {}, function(err, data) {
      if (err) throw err;
      r(data.ChangeInfo);
    });
  });

const AwsZones = {
  "eu-west-1": {
    elb: "Z32O12XQLNTSW2",
    s3: "Z1BKCTXD74EZPE"
  }
};

const main = async ({ url, target, awsRegion, comment, domain, kube }) => {
  route53 = new aws.Route53();
  const zones = await getZones();
  if (url.indexOf(domain) === -1) {
    url = `${url}.${domain}`;
  }
  if (!target) {
    const { err, stdout, stderr } = await exec(
      `kubectl get service "${kube.service}" --namespace=${
        kube.namespace
      } -o json | jq ".status.loadBalancer.ingress[0].hostname" --raw-output`
    );
    if (err || stderr) {
      throw { err, stderr };
    }
    target = stdout.replace("\n", "");
    console.log({ stdout, stderr });
  }
  const requestZone = zones.filter(z => z.Name === `${domain}.`)[0];
  const targetZone =
    target.indexOf("eu-west-1.elb.amazonaws.com") > 0
      ? AwsZones[awsRegion]["elb"]
      : target.indexOf("s3.website.amazonaws.com") > 0
      ? AwsZones[awsRegion]["s3"]
      : null;
  const options = {
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
      Comment: `[auto] ${comment}`
    },
    HostedZoneId: requestZone.Id
  };
  console.log(options);
  const info = await changeResourceRecordSets(options);
  console.log(info);
};

program
  .option("--url <url>", "Url to create")
  .option("--target <target>", "Target ")
  .option("--region <region>", "AWS Region (default eu-west-1)")
  .option("--domain <domain>", "Domain (default request.network)")
  .option("--comment <comment>", "(optional) Comment")
  .option("--kube-namespace <namespace", "Kubernetes Namespace")
  .option("--kube-service <name>", "Kubernetes Service Name")
  .parse(process.argv);

if (!program.region) {
  program.region = "eu-west-1";
}
if (!program.domain) {
  program.domain = "request.network";
}

if (!program.url) {
  program.help();
} else if (!program.target && !(program.kubeNamespace && program.kubeService)) {
  console.log(program.kubeNamespace);
  console.log(program.kubeService);
  console.log(
    colors.red(
      "Specify either the TARGET (url), or Kubernetes Namespace & Service\n"
    )
  );
  program.help();
} else {
  main({
    url: program.url,
    target: program.target,
    awsRegion: program.region,
    comment: program.comment,
    domain: program.domain,
    kube: {
      service: program.kubeService,
      namespace: program.kubeNamespace
    }
  });
}
