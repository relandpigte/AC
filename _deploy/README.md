# MedFX #

This script is used to provision all infrastructure for Academically into the Academically AWS Account

# History #
20/08/2020  - RL - Initial version of script

## Methodology ##
This repo is made up of a number of Ansible Playbooks.  It is recommned to run the master playbook site.yml, this will call the infrastructure and selenium playbooks.

### ANSIBLE TAGS ###
Ansible tags can be used to control updates



```
AWS_PROFILE=academically-cf ansible-playbook site.yml
--vault-password-file ~/.vault-pass-sccoreservices -e 'env_name=ci app_name=academically restore=false' --private-key ~/academically-uat.pem -vvvv
```

passwords are stored in group_vars/all.yml and encrypted using ansible-vault

## Current Command Lines ##
### Deploy Infrastructure Only ###
Run the Cloudformation scripts only.

```
AWS_PROFILE=academically-cf ansible-playbook infrastructure/infrastructure.yml -
-vault-password-file ~/.vault-pass-academically -e 'env_name=ci app_name=academically' --private-key ~/academically-ci.pem
```

### Deploy All Infrastructure ###
Below will run all scripts for the environment UAT
```
AWS_PROFILE=academically-cf ansible-playbook site.yml --vault-password-file ~/.vault-pass-sccoreservices -e 'env_name=uat app_name=academically' --private-key ~/academically-uat.pem -v
```

### Deploy / Update Web Application
With the following 'tag' you can deploy just the web application layer and create a new AMI, attaching to the load balancer in a new launch config
This command line will also be called from Octopus to deploy updates.

```
AWS_PROFILE=academically-cf ansible-playbook site.yml --vault-password-file ~/.vault-pass-academically -e 'env_name=ci app_name=academically restore=false' --private-key ~/academically-ci.pem --tags academically-app -vvv
```


### Restore Database and Data Volumes
In order to restore a previous working environment, we must specifiy 3 additional parameters at the command line

restore = true/false
snapshot_name = name of snapshot created by RDS

Example Command Line
```
AWS_PROFILE=academically-cf ansible-playbook site.yml --vault-password-file ~/.vault-pass-sccoreservices -e 'env_name=uat app_name=academically restore=true snapshot_name=academically-snapshot-db-ysl53v9x3g4w' --private-key ~/academically-uat.pem -v
```

