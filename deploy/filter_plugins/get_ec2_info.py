from jinja2.utils import soft_unicode
import json
import os.path

'''
USAGE:
 - debug:
     msg: "{{ ec2.results | get_ec2_info('id') }}"

Some useful ec2 keys:
id
dns_name
public_ip
private_ip
'''

ec2path1 = "./env_vars/ec2_info1.yml"
ec2path2 = "./env_vars/ec2_info2.yml"
ec2path3 = "./env_vars/ec2_info3.yml"
elbpath = "./env_vars/elb_info.yml"
rdspath = "./env_vars/rds_info.yml"

class FilterModule(object):
    def filters(self):
        return {
            'get_ec2_info': get_ec2_info,
            'get_ec2_backup': get_ec2_backup,
        }

def get_ec2_info(list, ec2_key):
    ec2_info = []
    for ec2 in list:
        ec2_info.append(str(ec2[ec2_key]))

    return ec2_info

def get_ec2_backup(list):
    ec2_info = []
    
    if not os.path.exists(elbpath):
        file(elbpath, "w").close()
    if not os.path.exists(rdspath):
        file(rdspath, "w").close()
    if not os.path.exists(ec2path1):
        file(ec2path1, "w").close()
    if not os.path.exists(ec2path2):
        file(ec2path2, "w").close()
    if not os.path.exists(ec2path3):
        file(ec2path3, "w").close()

    return None