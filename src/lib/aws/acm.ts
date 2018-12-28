import { ACM, EC2 } from "aws-sdk";

const _listCertificates = async (region: string) => {
  const acm = new ACM({
    region
  });
  const promiseResult = await acm.listCertificates().promise();
  const response = promiseResult.$response;
  if (response.error) throw response.error;
  if (!response.data || !response.data.CertificateSummaryList) {
    throw new Error("void data");
  }
  return response.data.CertificateSummaryList;
};

const _getCertificateArn = async (domain: string, region: string) => {
  const certList = await _listCertificates(region);
  const certificate = certList.find(x => x.DomainName === `*.${domain}`);
  if (certificate) {
    return certificate.CertificateArn;
  }
  return null;
};

export const getRegions = async (region: string) => {
  const ec2 = new EC2({
    region
  });
  const promiseResult = await ec2.describeRegions().promise();
  const response = promiseResult.$response;
  if (response.error) throw response.error;
  if (!response.data || !response.data.Regions) {
    throw new Error("void data");
  }
  return response.data.Regions;
};

export const getCertificateArn = async (domain: string, region: string) => {
  const regions = await getRegions(region);
  for (const r of regions) {
    const certificate = await _getCertificateArn(domain, r.RegionName || "");
    if (certificate) {
      return certificate;
    }
  }
  return null;
};

export const listCertificates = async (domain: string, region: string) => {
  const certList = await _listCertificates(region);
  return certList.map(x => x.DomainName);
};
