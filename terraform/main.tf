
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
