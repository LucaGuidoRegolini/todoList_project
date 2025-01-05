resource "aws_cloudwatch_log_group" "todo_list_log_group" {
  name              = "/ecs/todo-list"
  retention_in_days = 3

  tags = {
    Environment = "${var.environment}"
    Project     = "todo-list-project"
  }
}
