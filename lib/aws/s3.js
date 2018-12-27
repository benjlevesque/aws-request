import { S3 } from "aws-sdk";

const awsCallback = resolve => (err, data) => {
  if (err) throw err;
  resolve(data);
};
export const createBucket = async ({ url, region }) => {
  const s3 = new S3({
    region
  });
  // const bucket = await new Promise(resolve =>
  //   s3.headBucket(
  //     {
  //       Bucket: url
  //     },
  //     awsCallback(resolve)
  //   )
  // );
  // if (bucket) {
  //   return bucket;
  // }
  const newBucket = await new Promise(resolve =>
    s3.createBucket(
      {
        ACL: "public-read",
        Bucket: url
      },
      awsCallback(resolve)
    )
  );

  await new Promise(resolve =>
    s3.putBucketWebsite(
      {
        Bucket: url,
        WebsiteConfiguration: {
          IndexDocument: {
            Suffix: "index.html"
          }
        }
      },
      awsCallback(resolve)
    )
  );
  await new Promise(resolve =>
    s3.putObject(
      {
        Body: new Buffer(
          `<html><head></head><body>Welcome to ${url}!</body></html>`
        ),
        Bucket: url,
        ACL: "public-read",
        Key: "index.html",
        ContentType: "text/html"
      },
      awsCallback(resolve)
    )
  );
  return newBucket;
};
