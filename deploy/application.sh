#Bash script for Octopus to Upgrade Website
vaultpass="$1"
accesskey="$2"
secretkey="$3"
env="$4"
domain="$5"
echo here we are about to write the credtials file
echo "[cloudformation]" > ~/.aws/credentials
echo "aws_access_key_id = $accesskey" >> ~/.aws/credentials
echo "aws_secret_access_key = $secretkey" >> ~/.aws/credentials
echo $vaultpass > /tmp/.vault-pass 
echo $env > /tmp/env.txt
echo "Deploying to environment: " $env
# echo " - databasePath: " $databasePath
echo " - Domain: " $domain
echo check credentials file
cat ~/.aws/credentials
echo lets check disk status
df
ls -la
echo "install lambda functions"
AWS_PROFILE=cloudformation ansible-playbook -i inventories/base application.yml --vault-password-file /tmp/.vault-pass -e 'env_name='${env,,}' app_name=casemix public_domain='${domain,,}' ansible_python_interpreter=/usr/bin/python3' -vvv
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