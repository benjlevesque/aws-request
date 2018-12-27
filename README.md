## S3 Example

1. make S3 bucket

`aws s3 mb s3://accounts.request.network`

2. Create CloudFront distribution
   _first modify your parameters!_

`aws cloudfront create-distribution --distribution-config file://distribution.json`

3. Sync to S3 bucket

`aws s3 sync ./public s3://accounts.request.network --acl public-read --delete`

4. Configure Route53

_XXX.cloudfront.net from step 2_

`route53 add --url accounts --target XXX.cloudfront.net --domain request.network --region "eu-west-1"`
