# MedFX #

This script is used to provision all infrastructure for MedFX into the MedFX AWS Account

# History #
30/07/2019  - RL - Initial version of script

## Methodology ##
This repo is made up of a number of Ansible Playbooks.  It is recommned to run the master playbook site.yml, this will call the infrastructure and selenium playbooks.

### ANSIBLE TAGS ###
Ansible tags can be used to control updates

infra - Infrastructure includes storage such as Mountable stateful drives and RDS
casemix-app - Install MedFX Application

site.yml            - master playbook includes the infrastructure and selenium playbooks
infrastructure.yml  - calls Cloudformation Scripts to deploy all AWS infrastructure
MedFX.yml    - installs IIS and MedFX on top of pre existing CloudFormation Stack.

```
AWS_PROFILE=casemix-cf ansible-playbook site.yml
--vault-password-file ~/.vault-pass-sccoreservices -e 'env_name=ci app_name=casemix restore=false' --private-key ~/casemix-uat.pem -vvvv
```

passwords are stored in group_vars/all.yml and encrypted using ansible-vault

## Current Command Lines ##
### Deploy Infrastructure Only ###
Run the Cloudformation scripts only.

```
AWS_PROFILE=casemix-cf ansible-playbook infrastructure/infrastructure.yml -
-vault-password-file ~/.vault-pass-casemix -e 'env_name=ci app_name=casemix' --private-key ~/casemix-ci.pem
```

### Deploy All Infrastructure ###
Below will run all scripts for the environment UAT
```
AWS_PROFILE=casemix-cf ansible-playbook site.yml --vault-password-file ~/.vault-pass-sccoreservices -e 'env_name=uat app_name=casemix' --private-key ~/casemix-uat.pem -v
```

### Deploy / Update Web Application
With the following 'tag' you can deploy just the web application layer and create a new AMI, attaching to the load balancer in a new launch config
This command line will also be called from Octopus to deploy updates.

```
AWS_PROFILE=casemix-cf ansible-playbook site.yml --vault-password-file ~/.vault-pass-casemix -e 'env_name=ci app_name=casemix restore=false' --private-key ~/casemix-ci.pem --tags casemix-app -vvv
```


### Restore Database and Data Volumes
In order to restore a previous working environment, we must specifiy 3 additional parameters at the command line

restore = true/false
snapshot_name = name of snapshot created by RDS

Example Command Line
```
AWS_PROFILE=casemix-cf ansible-playbook site.yml --vault-password-file ~/.vault-pass-sccoreservices -e 'env_name=uat app_name=casemix restore=true snapshot_name=casemix-snapshot-db-ysl53v9x3g4w' --private-key ~/casemix-uat.pem -v
```

