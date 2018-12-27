import { ACM, EC2 } from "aws-sdk";

const _getCertificateArn = async (domain, region) => {
  const acm = new ACM({
    region
  });
  const certList = await new Promise(resolve =>
    acm.listCertificates((err, data) => {
      if (err) {
        throw err;
      } else {
        resolve(data);
      }
    })
  );

  const certificate = certList.CertificateSummaryList.find(
    x => x.DomainName === `*.${domain}`
  );
  if (certificate) {
    return certificate.CertificateArn;
  }
  return null;
};

const getRegions = region => {
  const ec2 = new EC2({
    region
  });
  return new Promise((resolve, reject) =>
    ec2.describeRegions((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Regions);
      }
    })
  );
};
export const getCertificateArn = async (domain, region) => {
  const regions = await getRegions(region);
  for (const r of regions) {
    const certificate = await _getCertificateArn(domain, r.RegionName);
    if (certificate) {
      return certificate;
    }
  }
  return null;
};

export const listCertificates = async domain => {
  const acm = new ACM();
  const certList = await new Promise(resolve => acm.listCertificates(resolve));
  return certList.map(x => x.DomainName);
};
