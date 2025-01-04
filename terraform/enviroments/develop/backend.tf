terraform {
  backend "s3" {
    bucket = "terraform-todo-list-project"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
  }
}
