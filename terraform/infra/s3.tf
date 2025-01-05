resource "aws_s3_bucket" "react_website" {
  bucket = "${var.environment}-react-website-todo-list"
  tags = {
    Environment = "${var.environment}"
    Project     = "todo-list-project"
  }
}

resource "aws_s3_bucket_website_configuration" "react_website" {
  bucket = aws_s3_bucket.react_website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
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
