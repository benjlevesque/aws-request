# AWS-Request

## Installation

`yarn global add aws-request`

### Bash completion

Generate bash completion script with

`aws-request bash-completion`

## Configuration

Setup your defaults using:

`aws-request config init`

## Commands

1. Interactive
   Will guide you through choices

`aws-request prompt`

2. Command Line

- SPA on S3

`aws-request spa [subdomain]`

For example, if your default domain is 'example.org':

`aws-request spa dashboard`

will create `dashboard.example.org`

Type `aws-request spa help` for details on available options.

- Backend on Kubernetes
  `aws-request spa [subdomain] --namespace [namespace] --service [service]`

NB: CLI autocomplete is currently broken for kubernetes, but you can have a smooth experience using `aws-request prompt`

Example:

`aws-request k8s dashboard --namespace default --service dashboard-service`

Use `aws-request k8s help` for more details on available options.
