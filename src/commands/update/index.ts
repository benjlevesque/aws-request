import { getLatestImage } from "../../lib/aws/ecr";
import * as config from "../../lib/config";
import {
  getCurrentImageTag,
  updateDeployment,
  getNamespaces,
  getDeployments,
  getDeploymentImage,
  getContainers
} from "../../lib/k8s/utils";
import inquirer = require("inquirer");

export interface IUpdateCommandParameters {
  region: string;
  namespace: string;
  deploymentName: string;
  containerName: string;
}

export default async function process({
  region,
  namespace,
  deploymentName,
  containerName
}: IUpdateCommandParameters) {
  const currentImage = await getCurrentImageTag({
    region,
    deploymentName,
    namespace
  });

  if (!currentImage) {
    throw Error("current image not found");
  }
  console.log(`Current image = ${currentImage.image}:${currentImage.tag}`);

  if (!containerName) {
    const containers = await getContainers(namespace, deploymentName);
    if (containers.length > 1) {
      throw Error(
        "More than 1 possible container! Choose container with --containerName"
      );
    }
    containerName = containers[0];
  }

  const imageName = await getDeploymentImage(
    namespace,
    deploymentName,
    containerName
  );
  if (!imageName) throw Error("image not found");
  const repositoryName = imageName.split(":")[0];

  const newImage = await getLatestImage({
    region,
    repositoryName
  });
  if (!newImage) {
    throw Error("New image not found");
  }
  console.log(`    New image = ${newImage.image}:${newImage.tag}`);
  if (newImage.image !== currentImage.image) {
    console.log({ currentImage, newImage });
    throw Error("images are not the same");
  }

  if (newImage.tag === currentImage.tag) {
    console.log("tags are identical, skipping");
  } else {
    const output = await updateDeployment({
      namespace,
      deploymentName,
      containerName,
      ...newImage
    });
    console.log(`Output= ${output}`);
  }
  console.log();
}

export async function prompt(parameters: IUpdateCommandParameters) {
  const { containerName, deploymentName, namespace, region } = parameters;
  const responses = await inquirer.prompt<IUpdateCommandParameters>([
    {
      name: "region",
      message: "Choose your AWS region",
      default: region || config.get("region")
    },
    {
      name: "namespace",
      message: "Choose the k8s namespace in which the deployment is located",
      default: namespace,
      choices: getNamespaces,
      type: "list"
    },
    {
      name: "deploymentName",
      message: "Choose the deployment to update",
      default: deploymentName,
      choices: async (answers: IUpdateCommandParameters) => {
        return getDeployments(answers.namespace);
      },
      type: "list"
    }
  ]);
  const containers = await getContainers(namespace, responses.deploymentName);
  let container = "";
  if (containers.length > 1) {
    const containerAnswer = await inquirer.prompt<{ containerName: string }>({
      name: "containerName",
      default: containerName,
      message: "Choose the container to update",
      choices: containers,
      type: "list"
    });
    container = containerAnswer.containerName;
  }
  await process({ ...responses, containerName: container });
}
