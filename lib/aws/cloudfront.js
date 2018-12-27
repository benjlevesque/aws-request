import { CloudFront } from "aws-sdk";
import { parseTemplate } from "../templateManager";

export const createCloudfrontDistribution = ({ url, domain, region }) => {
  const s3_url = `${url}.s3-website-${region}.amazonaws.com`;
  const s3_id = `S3-${url}`;
  const cloudFront_reference = `${url}-distribution`;

  parseTemplate("S3-cloudfront-distribution", {
    url,
    s3_id,
    s3_url,
    cloudFront_reference,
    certificate_arn
  });

  const cloudfront = new CloudFront();
  return new Promise(resolve =>
    cloudfront.createDistribution(
      {
        DistributionConfig
      },
      (err, data) => {
        if (err) throw err;
        resolve(data);
      }
    )
  );
};
