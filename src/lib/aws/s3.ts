import { S3 } from "aws-sdk";
import { promisify } from "util";

interface ICreateBucketParameters {
  url: string;
  region: string;
}

export const createBucket = async ({
  url,
  region
}: ICreateBucketParameters) => {
  const s3 = new S3({
    region
  });
  const promiseResult = await s3
    .createBucket({
      ACL: "public-read",
      Bucket: url
    })
    .promise();

  const response = promiseResult.$response;
  if (response.error) throw response.error;
  if (!response.data) throw new Error("void data");

  await s3
    .putBucketWebsite({
      Bucket: url,
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: "index.html"
        }
      }
    })
    .promise();

  await s3
    .putObject({
      Body: new Buffer(
        `<html><head></head><body>Welcome to ${url}!</body></html>`
      ),
      Bucket: url,
      ACL: "public-read",
      Key: "index.html",
      ContentType: "text/html"
    })
    .promise();

  return response.data;
};
