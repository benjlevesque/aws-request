import { createCloudfrontDistribution } from "../../lib/aws/cloudfront";
import { createBucket } from "../../lib/aws/s3";
import { createDnsRecord } from "../../lib/aws/route53";

export default async argv => {
  let { subdomain, domain, region } = argv;
  if (!subdomain) {
    throw new Error("Subdomain is mandatory");
  }
  if (subdomain.startsWith("http")) {
    throw new Error("Subdomain cannot start with http");
  }
  if (subdomain.indexOf(domain) > 0) {
    subdomain = subdomain.replace("." + domain, "");
  }
  const url = `${subdomain}.${domain}`;

  console.log(`Creating bucket ${url}...`);
  const s3 = await createBucket({ url, region });
  console.log(`Bucket created: ${s3.Location}`);

  console.log("Creating Cloudfront distribution...");
  const cloudfront = await createCloudfrontDistribution({
    url,
    domain,
    region
  });
  const target = cloudfront.Distribution.DomainName;
  console.log(`Cloudfront distribution created: ${target}`);

  console.log("Creating route...");
  const record = await createDnsRecord({ url, domain, target });
  console.log("Route created.");

  console.log({ s3, cloudfront, record });
};
