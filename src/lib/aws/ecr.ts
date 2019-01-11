import AWS from "aws-sdk";
import { ImageTag } from "../types";

export function cleanRepositoryName(repositoryName: string) {
  const url = repositoryName.split("/")[0];
  if (
    /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g.test(
      url
    )
  ) {
    return repositoryName.replace(url + "/", "");
  }
  return repositoryName;
}

export async function getLatestImage({
  region,
  repositoryName
}: {
  region: string;
  repositoryName: string;
}): Promise<ImageTag> {
  var ecr = new AWS.ECR({
    region
  });
  repositoryName = cleanRepositoryName(repositoryName);
  const repositoryResponse = await ecr
    .describeRepositories({
      repositoryNames: [repositoryName]
    })
    .promise();
  if (!repositoryResponse.repositories || !repositoryResponse.repositories[0]) {
    throw Error("repository not found");
  }

  const repository = repositoryResponse.repositories[0].repositoryUri;
  const response = await ecr
    .describeImages({
      repositoryName
    })
    .promise();

  if (response.imageDetails && response.imageDetails.length) {
    // get newest image
    const newest = response.imageDetails.sort((a, b) => {
      const aDate = a.imagePushedAt as Date;
      const bDate = b.imagePushedAt as Date;
      if (aDate == bDate) return 0;
      return aDate < bDate ? 1 : -1;
    })[0];

    // get last tag of this image
    if (newest.imageTags) {
      return {
        image: repository as string,
        tag: newest.imageTags.pop() as string
      };
    } else {
      console.log("no tag!");
    }
  } else {
    console.log("error...", response);
  }
  return null;
}
