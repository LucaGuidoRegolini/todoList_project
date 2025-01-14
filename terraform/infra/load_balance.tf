resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow inbound HTTP traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = "${var.environment}"
    Project     = "todo-list-project"
  }
}

resource "aws_security_group" "allow_https" {
  name        = "allow_https"
  description = "Allow inbound HTTPS traffic"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = "${var.environment}"
    Project     = "todo-list-project"
  }
}

resource "aws_lb" "todo_list_lb" {
  name               = "todo-list-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow_http.id, aws_security_group.allow_https.id]
  subnets            = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]

  tags = {
    Environment = "${var.environment}"
    Project     = "todo-list-project"
  }
}

resource "aws_lb_target_group" "todo_list_target_group" {
  name     = "todo-list-target-group"
  port     = 4000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  target_type = "ip"

  lifecycle {
    create_before_destroy = true
  }

  health_check {
    interval            = 30
    path                = "/"
    port                = "4000"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
    healthy_threshold   = 5
  }

  tags = {
    Environment = "${var.environment}"
    Project     = "todo-list-project"
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.todo_list_lb.arn
  port              = "80"
  protocol          = "HTTP"

  lifecycle {
    create_before_destroy = true
  }

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.todo_list_target_group.arn
  }

  tags = {
    Environment = "${var.environment}"
    Project     = "todo-list-project"
  }
}

output "lb_dns_name" {
  value = aws_lb.todo_list_lb.dns_name
}
