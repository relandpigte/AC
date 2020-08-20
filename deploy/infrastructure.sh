#Bash script for Octopus to Upgrade Website
vaultpass="$1"
accesskey="$2"
secretkey="$3"
env="$4"
snapshot="$5"
snapshotname="$6"
upgrade="$7"
domain="$8"

echo "[casemix]" > ~/.aws/credentials
echo "aws_access_key_id = $accesskey" >> ~/.aws/credentials
echo "aws_secret_access_key = $secretkey" >> ~/.aws/credentials
echo $vaultpass > /tmp/.vault-pass 
echo $env > /tmp/env.txt
echo "Deploying to: " $env
echo " - accessKey: " $accesskey
echo " - Domain: " $domain
echo " - Snapshot Restore Required: " $snapshot
echo " - Snapshot Id: " $snapshotname 
echo " - Upgrade only: " $upgrade 
pwd
ls -la

echo "upgrade full stack, infrastructure only no database scripts"
AWS_PROFILE=casemix ansible-playbook -i inventories/base infrastructure.yml --vault-password-file /tmp/.vault-pass -e 'env_name='${env,,}' app_name=casemix public_domain='${domain,,}' ansible_python_interpreter=/usr/bin/python3 restore='$snapshot' snapshot_name='$snapshotname -vvv
errorlevel="$?"
echo Errorlevel of playbook was $errorlevel


rm ~/.aws/credentials
rm /tmp/.vault-pass 

if [ "$errorlevel" != "0" ]
then
    case $errorlevel in
        1)  echo "ANSIBLE PLAYBOOK FAILED: please check logs"
            ;;
        2)  echo "ANSIBLE PLAYBOOK FAILED: one or more hosts failed, please check logs"
            ;;
        3)  echo "ANSIBLE PLAYBOOK FAILED: one or more hosts unreachable, please check logs"
            ;;
        4)  echo "ANSIBLE PLAYBOOK FAILED: Parse Error, please check logs"
            ;;
        5)  echo "ANSIBLE PLAYBOOK FAILED: Options Error, please check logs"
            ;;
        *)  echo "ANSIBLE PLAYBOOK FAILED: Unknown Error, please check logs"
            ;;
    esac
    exit 1
else
    echo "Ansible Playbook SUCCESSFUL completion"
fi
exit 0