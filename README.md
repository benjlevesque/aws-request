# AWS-Request

A utility command to easily create AWS configuration. See [Features](#features).

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

## Features
### SPA (S3)
- create a website-enabled public S3 bucket 
- push a dummy `index.html` file
- create a Cloudfront distribution mapping to the created bucket with :
   - HTTPS certificate 
   - HTTP to HTTPS redirection
   - cache configuration (max 600ms on `index.html`, max 31536000ms on the other files) <sup>[1](#myfootnote1)</sup>
- create a DNS A-record in Route53, alias to the generated Cloudfront distribution

### Kubernetes
The Kubernetes configuration is much simpler for the moment. It is mostly a convenience to retrieve the right URL. 
- get the URL of the Load Balancer of a service
- create a DNS A-record in Route53, alias to the  URL previously retrieved


<hr/>
- <a name="myfootnote1">1</a> - this allow an optimal cache management for SPAs, because since most of the files will change name at each release, a low cache duration on index.html allows a faster load of the new version.
