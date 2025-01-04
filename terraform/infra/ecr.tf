resource "aws_ecr_repository" "backend" {
  name                 = "todo-list-project"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = false
  }

  tags = {
    Environment = "${var.environment}"
    Project     = "todo-list-project"
  }
}

resource "docker_image" "app_image" {
  name = "app_image"

  build {
    context    = "../../../backend"
    dockerfile = "Dockerfile"
    tag = [
      "${aws_ecr_repository.backend.repository_url}:latest"
    ]
    build_args = {
      DATABASE_URL                = "file:dev.db"
      PORT                        = 4000
      JWT_SECRET                  = var.jwt_secret
      JWT_REFRESH_SECRET          = var.refresh_secret
      JWT_EXPIRATION_TIME         = "2d"
      JWT_REFRESH_EXPIRATION_TIME = "7d"
    }
  }

  triggers = {
    dir_sha1 = sha1(join("", [for f in fileset(path.module, "../../../src/*") : filesha1(f)]))
  }

}

resource "random_id" "build_id" {
  byte_length = 8
}

resource "null_resource" "push_to_ecr" {
  provisioner "local-exec" {
    command = <<EOT
    $(aws ecr get-login-password --region ${var.region} | docker login --username AWS --password-stdin ${aws_ecr_repository.backend.repository_url})
    docker push ${aws_ecr_repository.backend.repository_url}:latest
    EOT
  }

  depends_on = [aws_ecr_repository.backend, docker_image.app_image]

  triggers = {
    force_rebuild = random_id.build_id.hex
  }
}

output "ecr_repository_url" {
  value       = aws_ecr_repository.backend.repository_url
  description = "The URL of the ECR repository"
}
