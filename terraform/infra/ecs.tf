resource "aws_ecs_cluster" "todo_list_cluster" {
  name = "todo-list-cluster"
}

resource "aws_ecs_task_definition" "todo_list_task" {
  family                   = "todo-list-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  depends_on = [null_resource.push_to_ecr]

  container_definitions = jsonencode([{
    name      = "todo-list-container"
    image     = "${aws_ecr_repository.backend.repository_url}:latest"
    cpu       = 256
    memory    = 512
    essential = true
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.todo_list_log_group.name
        awslogs-region        = "us-east-1"
        awslogs-stream-prefix = "todo-list"
      }
    }
    portMappings = [
      {
        containerPort = 4000
        hostPort      = 4000
        protocol      = "tcp"
      }
    ]
  }])
}

resource "aws_security_group" "todo_list_sg" {
  name        = "todo-list-sg"
  description = "Allow inbound traffic for todo-list application"

  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Permite tráfego de qualquer lugar
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Permite tráfego para qualquer destino
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "todo_list_service" {
  name            = "todo-list-service"
  cluster         = aws_ecs_cluster.todo_list_cluster.id
  task_definition = aws_ecs_task_definition.todo_list_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets          = [aws_subnet.public_subnet_a.id, aws_subnet.public_subnet_b.id]
    security_groups  = [aws_security_group.todo_list_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.todo_list_target_group.arn
    container_name   = "todo-list-container"
    container_port   = 4000
  }
}
