# Default Settings are for AWS DEV Account 761676740162
# Actual Settings are defined in projectvars.auto.tfvars


##################
# Project Settings
##################

variable "APP_NAME" {
    type = string
    description = "Application name used for labeling (populated from GitLab vars)"
    default = "sc_pofc"
}

variable "cost_code" {
    type = string
    description = "Cost Code used for labeling assets"
    default = "core"
}

variable "env_name" {
    type = string
    description = "Environment used for labeling assets"
    default = "ci"
}

##########################
# Cloud Provider  Settings
##########################


variable "cloud_account_id" {
    type = string
    description = "Cloud Provider Account Number"
    default = "761676740162"
}
variable "AWS_ACCESS_KEY" {
    type = string
}
variable "AWS_SECRET_ACCESS_KEY" {
    type = string
}
variable "AWS_DEFAULT_REGION" {
    type = string
}


##################
# Network Settings
##################

variable "namespace" {
    type = string
    description = "for labeling assets unique to this project"
    default = "no-name.aws"
}

variable "SUPPORT_PASSWORD" {
    type = string
    description = "Password to be used for support accounts in windows"
    default = "Not-Secure"
}

variable "DEPLOY_PASSWORD" {
    type = string
    description = "Password to be used for deploy accounts in windows"
    default = "Not-Secure"
}

variable "public_domain" {
    type = string
    description = "public DNS to be used in route53 configs and host headers etc"
    default = "sourcecloud-dev.uk"
}

variable "hosted_zone_id" {
    type = string
    description = "unique ZoneId in Route53 for domain"
    default = "Z020263019P65LERQAG19"
}

variable "acm_arn" {
    type = string
    description = "arn of SSL certificate"
    default = "arn:aws:acm:eu-west-2:761676740162:certificate/cf32d969-967b-40c7-a420-801002bffc8a"
}

variable "vpc" {
    type = string
    description = "VPC for Infrastructure"
    default = "vpc-0f0679d290d2d8ef7"
}

variable "public_subnets" {
    type = list
    description = "List of Public Subnet Ids"
    default = ["subnet-092faf69334a18a30", "subnet-0612281398db7d701"]
}

variable "private_subnets" {
    type = list
    description = "List of Internal Subnet Ids, internent via NAT"
    default = ["subnet-03f6e008bbf99fd12", "subnet-06ff7fbbb445833a3"]
}

variable "local_subnets" {
    type = list
    description = "List of Local Subnet Ids (no internet access, typically for databases)"
    default = ["subnet-048fb4d0b8d60d3d0", "subnet-01bf9445b37e077bc"]
}

variable "sc_cidr" {
    type = list
    description = "SourceCloud Office CIDR IPv4"
    default = ["62.31.86.227/32"]
}

variable "sc_vpn_cidr" {
    type = list
    description = "SourceCloud VPN CIDR IPv4"
    default = ["10.100.0.0/16"]
}

variable "elb_port" {
    type = number
    description = "Network port to be used to access the Load Balancer"
    default = 443
}

variable "web_port" {
    type = number
    description = "Network port to be used to access the Web Server"
    default = 80
}

variable "db_port" {
    type = number
    description = "Network port to be used to access the Web Server"
    default = 3306
}

#################
# Server Settings
#################

variable "base_windows_ami" {
    type = string
    description = "Base AMI for Windows 2019"
    default = "ami-05c2255ba0bb4eb69"
}
variable "base_linux_ami" {
    type = string
    description = "Base AMI for Ubuntu 18:04 (64bit x86)"
    default = "ami-09a56048b08f94cdf"
}
variable "instance_type" {
    type = string
    description = "instance size"
    default = "t3.medium"  
}
variable "ec2_keyname" {
    type = string
    description = "name of key for instance"
    default = "academically-nonprod"
}
variable "cluster_node_min" {
    type = number
    description = "the minimum number of instance to run in the scaling group"
    default = 1
}
variable "cluster_node_max" {
    type = number
    description = "the maximum number of instance to run in the scaling group"
    default = 1
}
variable "cluster_node_desired" {
    type = number
    description = "the ideal number of instance to run in the scaling group"
    default = 1
}