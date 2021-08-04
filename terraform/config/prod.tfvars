// config/prod.tfvars

# OVERRIDE DEFAULT Project Settings here.....
# Defaults defined in variables.tf


##################
# Project Settings
##################
env_name = "prod"
cost_code = "academically-gitlab"


##########################
# Cloud Provider  Settings
##########################


##################
# Network Settings
##################
public_domain = "sourcecloud-dev.uk"
hosted_zone_id = "Z020263019P65LERQAG19"
acm_arn = "arn:aws:acm:eu-west-2:761676740162:certificate/cf32d969-967b-40c7-a420-801002bffc8a" # ARN of SSL for sourcecloud.co.uk

vpc = "vpc-0f0679d290d2d8ef7" # 10.106.0.0/16
public_subnets = ["subnet-092faf69334a18a30", "subnet-0612281398db7d701"]
private_subnets = ["subnet-03f6e008bbf99fd12", "subnet-06ff7fbbb445833a3"]
local_subnets = ["subnet-048fb4d0b8d60d3d0", "subnet-01bf9445b37e077bc"]


#################
# Server Settings
#################
base_linux_ami = "ami-009187c6426109799" # Linux 20:04LTS (64bit x86) academically Golden Image
instance_type = "t3.small"
ec2_keyname = "academically-nonprod"
cluster_node_min = 1
cluster_node_max = 1
cluster_node_desired = 1 