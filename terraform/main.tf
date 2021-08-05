
locals {
  namespace = "${var.env_name}-${var.APP_NAME}.aws"
  artifact_s3_bucket = "${var.APP_NAME}-${var.env_name}-artifacts"
  instance-userdata = <<EOF
#!/bin/bash
whoami
ls -la
aws --version
EOF
}



provider "aws" {
    access_key = "${var.AWS_ACCESS_KEY}"
    secret_key = "${var.AWS_SECRET_ACCESS_KEY}"
    region  = "${var.AWS_DEFAULT_REGION}"
}

resource "aws_security_group" "sc_sg" {
  name        = "${local.namespace}.sc.sg"
  description = "${var.APP_NAME} ${var.env_name} - SourceCloud Office  (Created by TERRAFORM)"
  vpc_id      = "${var.vpc}"

  ingress {
    description      = "HTTPS - direct from Bingham SourceCloud Office"
    from_port        = "${var.elb_port}"
    to_port          = "${var.elb_port}"
    protocol         = "tcp"
    cidr_blocks      = "${var.sc_cidr}"
  }
  ingress {
    description      = "HTTP - direct from Bingham SourceCloud Office"
    from_port        = "${var.web_port}"
    to_port          = "${var.web_port}"
    protocol         = "tcp"
    cidr_blocks      = "${var.sc_cidr}"
  }
  ingress {
    description      = "SSH - direct from Bingham SourceCloud Office"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = "${var.sc_cidr}"
  }
  ingress {
    description      = "RDP - direct from Bingham SourceCloud Office"
    from_port        = 3389
    to_port          = 3389
    protocol         = "tcp"
    cidr_blocks      = "${var.sc_cidr}"
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

    tags = {
        "Name" = "${local.namespace}.sc.sg"
        "Environment" = "${var.env_name}"
        "Cost Code" = "${var.cost_code}"
    }
}

resource "aws_security_group" "elb_sg" {
  name        = "${local.namespace}.elb.sg"
  description = "${var.APP_NAME} ${var.env_name} - ELB Security Group  (Created by TERRAFORM)"
  vpc_id      = "${var.vpc}"

  ingress {
    description      = "HTTPS - from internet"
    from_port        = "${var.elb_port}"
    to_port          = "${var.elb_port}"
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }
  ingress {
    description      = "HTTP - from internet"
    from_port        = "${var.web_port}"
    to_port          = "${var.web_port}"
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

    tags = {
        "Name" = "${local.namespace}.elb.sg"
        "Environment" = "${var.env_name}"
        "Cost Code" = "${var.cost_code}"
    }
}

resource "aws_security_group" "web_sg" {
  name        = "${local.namespace}.web.sg"
  description = "${var.APP_NAME} ${var.env_name} - Web Security Group  (Created by TERRAFORM)"
  vpc_id      = "${var.vpc}"

  ingress {
    description      = "HTTP - from the load balancer"
    from_port        = "${var.web_port}"
    to_port          = "${var.web_port}"
    protocol         = "tcp"
    security_groups  = [aws_security_group.elb_sg.id]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

    tags = {
        "Name" = "${local.namespace}.web.sg"
        "Environment" = "${var.env_name}"
        "Cost Code" = "${var.cost_code}"
    }
}

resource "aws_security_group" "db_sg" {
  name        = "${local.namespace}.db.sg"
  description = "${var.APP_NAME} ${var.env_name} - Database Security Group  (Created by TERRAFORM)"
  vpc_id      = "${var.vpc}"

  ingress {
    description      = "MySQL - from the web serversr"
    from_port        = "${var.db_port}"
    to_port          = "${var.db_port}"
    protocol         = "tcp"
    security_groups  = [aws_security_group.web_sg.id]
  }
  ingress {
    description      = "MySQL  - from the SourceCloud VPN"
    from_port        = "${var.db_port}"
    to_port          = "${var.db_port}"
    protocol         = "tcp"
    security_groups  = [aws_security_group.vpn_sg.id]
  }
  ingress {
    description      = "MySQL  - from the SourceCloud Office (direct)"
    from_port        = "${var.db_port}"
    to_port          = "${var.db_port}"
    protocol         = "tcp"
    cidr_blocks  = "${var.sc_cidr}"
  }
  
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

    tags = {
        "Name" = "${local.namespace}.db.sg"
        "Environment" = "${var.env_name}"
        "Cost Code" = "${var.cost_code}"
    }
}

resource "aws_security_group" "vpn_sg" {
  name        = "${local.namespace}.vpn.sg"
  description = "${var.APP_NAME} ${var.env_name} - Sourcecloud VPN Security Group  (Created by TERRAFORM)"
  vpc_id      = "${var.vpc}"

  ingress {
    description      = "HTTPS - from the SourceCloud VPN"
    from_port        = "${var.elb_port}"
    to_port          = "${var.elb_port}"
    protocol         = "tcp"
    cidr_blocks  = "${var.sc_vpn_cidr}"
  }
  ingress {
    description      = "HTTP - from the SourceCloud VPN"
    from_port        = "${var.web_port}"
    to_port          = "${var.web_port}"
    protocol         = "tcp"
    cidr_blocks  = "${var.sc_vpn_cidr}"
  }
  ingress {
    description      = "SSH - from the SourceCloud VPN"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = "${var.sc_vpn_cidr}"
  }
  ingress {
    description      = "RDP - from the SourceCloud VPN"
    from_port        = 3389
    to_port          = 3389
    protocol         = "tcp"
    cidr_blocks      = "${var.sc_vpn_cidr}"
  }  
  ingress {
    description      = "MySQL - from the SourceCloud VPN"
    from_port        = "${var.db_port}"
    to_port          = "${var.db_port}"
    protocol         = "tcp"
    cidr_blocks  = "${var.sc_vpn_cidr}"
  }
  ingress {
    description      = "WinRM - from the SourceCloud VPN"
    from_port        = 5985
    to_port          = 5986
    protocol         = "tcp"
    cidr_blocks  = "${var.sc_vpn_cidr}"
  }
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

    tags = {
        "Name" = "${local.namespace}.vpn.sg"
        "Environment" = "${var.env_name}"
        "Cost Code" = "${var.cost_code}"
    }
}

resource "aws_s3_bucket" "artifact_bucket" {
  bucket = "${local.artifact_s3_bucket}"
  acl    = "private"
  force_destroy = true
    tags = {
        "Name" = "${local.namespace}.s3"
        "Environment" = "${var.env_name}"
        "Cost Code" = "${var.cost_code}"
    }
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${local.namespace}.ec2.prf"
  role = aws_iam_role.role.name
}

resource "aws_iam_role" "role" {
  name = "${local.namespace}.ec2.rol"
  path = "/"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ec2.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF
  inline_policy {
    name = "${local.namespace}.iam.pol"
    # Terraform's "jsonencode" function converts a
    # Terraform expression result to valid JSON syntax.
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
          {
              "Action": [
                  "ec2:DescribeInstances",
                  "ec2:DescribeTags"
              ],
              "Resource": "*",
              "Effect": "Allow",
              "Sid": "AccessToEC2"
          },
          {
              "Action": [
                  "s3:ListBucket"
              ],
              "Resource": "arn:aws:s3:::${local.artifact_s3_bucket}",
              "Effect": "Allow",
              "Sid": "AccessToKeys1"
          },
          {
              "Action": [
                  "s3:GetObject"
              ],
              "Resource": "arn:aws:s3:::${local.artifact_s3_bucket}/*",
              "Effect": "Allow",
              "Sid": "AccessToKeys2"
          }
      ]
    })
  }
}

resource "aws_launch_configuration" "lc" {
    name_prefix = "${local.namespace}"
    image_id = "${var.base_linux_ami}"
    instance_type = "${var.instance_type}"
    iam_instance_profile = aws_iam_instance_profile.ec2_profile.id
    key_name = "${var.ec2_keyname}"
    security_groups = [aws_security_group.web_sg.id, aws_security_group.vpn_sg.id, aws_security_group.sc_sg.id]
    user_data_base64 = "${base64encode(local.instance-userdata)}"
}

resource "aws_autoscaling_group" "asg" {
    name = "${local.namespace}.asg"
    launch_configuration = aws_launch_configuration.lc.name
    min_size = "${var.cluster_node_min}"
    max_size = "${var.cluster_node_min}"
    desired_capacity = "${var.cluster_node_desired}"
    vpc_zone_identifier = "${var.private_subnets}"
    target_group_arns = [aws_lb_target_group.target_grp.arn]
    tags = concat(
      [
        {
          "key"                   = "Name"
          "value"                 = "${local.namespace}.ec2"
          "propagate_at_launch"  = true
        },
        {
          "key"                   = "Environment"
          "value"                 = "${var.env_name}"
          "propagate_at_launch"  = true
        },
        {
          "key"                   = "Cost Code"
          "value"                 = "${var.cost_code}"
          "propagate_at_launch"  = true
        },
        {
          "key"                   = "AppName"
          "value"                 = "${var.APP_NAME}"
          "propagate_at_launch"  = true
        },
        {
          "key"                   = "InstanceRefresh"
          "value"                 = "${timestamp()}"
          "propagate_at_launch"  = true
        }
      ]
    )
    instance_refresh {
      strategy = "Rolling"
      preferences {
        min_healthy_percentage = 0
      }
      triggers = ["tag"]
    }
    lifecycle {
      create_before_destroy = true
    }
}

resource "aws_autoscaling_schedule" "out_of_hours" {
  scheduled_action_name  = "Out of Hours 7pm"
  min_size               = 0
  max_size               = 0
  desired_capacity       = 0
  recurrence = "00 19 * * *"
  autoscaling_group_name = aws_autoscaling_group.asg.name
}

resource "aws_autoscaling_schedule" "business_hours" {
  scheduled_action_name  = "Business Hours 5am"
  min_size               = 1
  max_size               = 1
  desired_capacity       = 1
  recurrence = "0 5 * * Mon-Fri"
  autoscaling_group_name = aws_autoscaling_group.asg.name
}

resource "aws_lb" "alb" {
  name               = "${var.env_name}-${var.APP_NAME}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.elb_sg.id]
  subnets            = "${var.public_subnets}"
  enable_deletion_protection = false

  tags = {
      "Name" = "${local.namespace}.alb"
      "Environment" = "${var.env_name}"
      "Cost Code" = "${var.cost_code}"
  }
}

resource "aws_lb_target_group" "target_grp" {
  name     = "${var.env_name}-${var.APP_NAME}-tgt"
  port     = "${var.web_port}"
  protocol = "HTTP"
  vpc_id   = "${var.vpc}"
  stickiness {
    type = "lb_cookie"
    cookie_duration = 86400
  }
  tags = {
      "Name" = "${local.namespace}.alb"
      "Environment" = "${var.env_name}"
      "Cost Code" = "${var.cost_code}"
  }
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "${var.elb_port}"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "${var.acm_arn}"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_grp.arn
  }
  tags = {
      "Name" = "${local.namespace}.alb"
      "Environment" = "${var.env_name}"
      "Cost Code" = "${var.cost_code}"
  }
}

resource "aws_route53_record" "dns_record" {
  zone_id = "${var.hosted_zone_id}"
  name    = "api-${var.APP_NAME}-${var.env_name}"
  type    = "CNAME"
  ttl     = "300"
  records = [aws_lb.alb.dns_name]
}


output "web_sg_id" {
  value = aws_security_group.web_sg.id
}