provider "aws" {
  region              = "ap-northeast-1"
  allowed_account_ids = ["394094555638"]
  version             = "~> 3"
}

// KINESIS STREAMS
resource "aws_kinesis_stream" "tweet_stream" {
  name = "caughtTweets"
  shard_count = 1
  retention_period = 30

  shard_level_metrics = [
    "IncomingBytes",
    "OutgoingBytes",
  ]
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lb_ro" {
  name = "test"
  role = aws_iam_role.lambda_role.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "kinesis:DescribeStream",
          "kinesis:PutRecord",
          "kinesis:PutRecords",
          "kinesis:GetShardIterator",
          "kinesis:GetRecords",
          "kinesis:ListShards",
          "kinesis:DescribeStreamSummary",
          "kinesis:RegisterStreamConsumer",
          ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

// LAMBDA FUNCTIONS
resource "aws_lambda_function" "data_processing" {
  function_name = "data_processing"
  filename      = "data_processing.zip"
  handler       = "main.handler"
  role          = aws_iam_role.lambda_role.arn
  source_code_hash = filebase64sha256("data_processing.zip")
  runtime       = "nodejs14.x"
  timeout       = 10
  memory_size   = 256
}

// LAMBDA TRIGGERS
resource "aws_lambda_event_source_mapping" "data_processing_trigger" {
  event_source_arn              = aws_kinesis_stream.tweet_stream.arn
  function_name                 = "data_processing"
  batch_size                    = 100
  starting_position             = "LATEST"
  enabled                       = true
  maximum_record_age_in_seconds = 604800
}
