module "dev" {
  source      = "../../infra"
  environment = "dev"
}


output "website_url" {
  value = module.dev.cloudfront_distribution_domain_name
}
