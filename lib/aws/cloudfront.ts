import { CloudFront } from "aws-sdk";
import { parseTemplate } from "../templateManager";
import { getCertificateArn } from "./acm";

interface IParams {
  url: string;
  domainName: string;
  region: string;
}
export const createCloudfrontDistribution = async ({
  url,
  domainName,
  region
}: IParams) => {
  const s3_url = `${url}.s3-website-${region}.amazonaws.com`;
  const s3_id = `S3-${url}`;
  const cloudFront_reference = `${url}-distribution`;

  const certificate_arn = await getCertificateArn(domainName, region);

  const config = await parseTemplate<CloudFront.CreateDistributionRequest>(
    "S3-cloudfront-distribution",
    {
      url,
      s3_id,
      s3_url,
      cloudFront_reference,
      certificate_arn
    }
  );
  const cloudfront = new CloudFront();
  const promiseResult = await cloudfront.createDistribution(config).promise();
  const response = promiseResult.$response;
  if (response.error) throw response.error;
  if (!response.data) throw new Error("void data");
  return response.data;
};
