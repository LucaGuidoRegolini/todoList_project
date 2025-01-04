resource "aws_s3_bucket" "react_website" {
  bucket = "${var.environment}-react-website-todo-list"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  tags = {
    Environment = "${var.environment}"
    Project     = "todo-list-project"
  }
}

resource "aws_s3_bucket_public_access_block" "react_website" {
  bucket                  = aws_s3_bucket.react_website.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "react_website_policy" {
  bucket     = aws_s3_bucket.react_website.id
  depends_on = [aws_s3_bucket_public_access_block.react_website]
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.react_website.arn}/*"
      }
    ]
  })
}

resource "aws_cloudfront_distribution" "react_website_cdn" {
  enabled = true

  origin {
    domain_name = "${aws_s3_bucket.react_website.bucket}.s3.amazonaws.com"
    origin_id   = "S3-React-Website"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-React-Website"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  default_root_object = "index.html"
}

output "cloudfront_distribution_domain_name" {
  value       = aws_cloudfront_distribution.react_website_cdn.domain_name
  description = "The domain name of the CloudFront Distribution for the React website"
}
