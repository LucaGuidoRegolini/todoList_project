variable "environment" {
  type    = string
  default = "dev"
}

variable "jwt_secret" {
  type = string
}

variable "refresh_secret" {
  type = string
}

variable "region" {
  type    = string
  default = "us-east-1"
}
