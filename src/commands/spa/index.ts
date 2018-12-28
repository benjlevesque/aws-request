import { createCloudfrontDistribution } from "../../lib/aws/cloudfront";
import { createBucket } from "../../lib/aws/s3";
import { createDnsRecord } from "../../lib/aws/route53";
import sleep from "../../lib/sleep";

interface ISpaCommandParameters {
  subdomain: string;
  domainName: string;
  region: string;
  comment?: string;
  setStatus?: (msg: string) => void;
}

export default async ({
  subdomain,
  domainName,
  region,
  comment,
  setStatus
}: ISpaCommandParameters) => {
  if (!subdomain) {
    throw new Error("Subdomain is mandatory");
  }
  if (subdomain.startsWith("http")) {
    throw new Error("Subdomain cannot start with http");
  }
  if (subdomain.indexOf(domainName) > 0) {
    subdomain = subdomain.replace("." + domainName, "");
  }
  if (!setStatus) {
    setStatus = console.log;
  }
  const url = `${subdomain}.${domainName}`;

  setStatus(`Creating bucket ${url}...`);
  const s3 = await createBucket({ url, region });

  setStatus(`Bucket created: ${s3.Location}`);
  await sleep(1000);
  setStatus("Creating Cloudfront distribution...");
  const cloudfront = await createCloudfrontDistribution({
    url,
    domainName,
    region
  });
  if (!cloudfront.Distribution)
    throw new Error("Cloudfront distribution undefined");
  const target = cloudfront.Distribution.DomainName;
  setStatus(`Cloudfront distribution created: ${target}`);
  await sleep(1000);

  setStatus("Creating route...");
  const record = await createDnsRecord({
    url,
    domainName,
    target,
    region,
    comment
  });
  setStatus(
    `Route created: ${url}. It might take a few minutes for the DNS to replicate, and for cloudfront to be ready`
  );
};
