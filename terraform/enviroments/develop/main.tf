module "dev" {
  source         = "../../infra"
  environment    = "dev"
  jwt_secret     = var.TF_VAR_JWT_SECRET
  refresh_secret = var.TF_VAR_REFRESH_SECRET
  region         = "us-east-1"
}


output "website_url" {
  value = module.dev.cloudfront_distribution_domain_name
}

output "load_balancer_url" {
  value = module.dev.lb_dns_name
}
