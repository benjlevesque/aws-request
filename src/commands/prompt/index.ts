import inquirer = require("inquirer");
import * as config from "../../lib/config";
import { k8sOptions, IK8sOptions } from "../k8s/command";
import createSpa from "../spa";
import createK8sRoute from "../k8s";
import ora from "ora";
import chalk from "chalk";

interface IOptions {
  appType: string;
  subdomain: string;
  domainName: string;
  region: string;
}
const subdomainRegex = /^([a-zA-Z0-9][a-zA-Z0-9-_]*\.)*[a-zA-Z0-9]*[a-zA-Z0-9-_]*[[a-zA-Z0-9]+$/gim;

export default async () => {
  console.log(
    chalk.yellow("This will guide you through the creation of a service")
  );
  const responses = await inquirer.prompt<IOptions>([
    {
      name: "region",
      message: "In which AWS region do you want to create this?",
      default: config.get("region")
    },
    {
      name: "domainName",
      message: "What is your domain name?",
      default: config.get("domainName")
    },
    {
      name: "subdomain",
      message: "What subdomain do you want to create?",
      validate: input =>
        subdomainRegex.test(input) ? true : "Enter a valid subdomain"
    },
    {
      name: "appType",
      message: "What type of application do you want to create?",
      choices: [
        { name: "SPA (hosted on S3)", value: "spa" },
        { name: "Server (hosted on Kubernetes)", value: "k8s" }
      ],
      type: "list"
    }
  ]);
  if (responses.appType === "spa") {
    const { subdomain, domainName, region } = responses;
    const message = `Create ${subdomain}.${domainName} (S3 + Cloudfront + DNS)?`;
    if (await confirm(responses, message)) {
      const spinner = ora("Initializing...").start();
      const setStatus = (msg: string) => (spinner.text = msg);
      await createSpa({
        subdomain,
        domainName,
        region,
        setStatus
      });
      spinner.stopAndPersist();
    }
  } else if (responses.appType === "k8s") {
    console.log(
      chalk.yellow("Next questions will be specific for Kubernetes...")
    );
    const k8sResponses = await inquirer.prompt<IK8sOptions>(k8sOptions);
    if (await confirm({ generic: responses, kubernetes: k8sResponses })) {
      const { subdomain, domainName, region } = responses;
      const { namespace, service } = k8sResponses;

      const spinner = ora("Initializing...").start();
      const setStatus = (msg: string) => (spinner.text = msg);
      await createK8sRoute({
        subdomain,
        domainName,
        region,
        setStatus,
        namespace,
        service
      });
      spinner.stopAndPersist();
    }
  } else {
    console.log("unknown application type");
  }
};

const confirm = async (responses: any, message: string = "OK?") => {
  console.log(responses);
  const { ok } = await inquirer.prompt<{ ok: boolean }>([
    {
      name: "ok",
      message,
      type: "confirm"
    }
  ]);
  return ok;
};
