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
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
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

data "aws_vpc" "main" {
  # cidr_block = "10.0.0.0/16"
  id = "vpc-0774e3b05f2ed094e"
}

data "aws_subnet" "kaminomimi_1" {
  id         = "subnet-0ee4fae679b610260"
}

data "aws_subnet" "kaminomimi_2" {
  id         = "subnet-0d2562f3ab06f40fe"
}

resource "aws_db_subnet_group" "main" {
  name       = "main"
  subnet_ids = [data.aws_subnet.kaminomimi_1.id, data.aws_subnet.kaminomimi_2.id ]

  tags = {
    Name = "My DB subnet group"
  }
}

resource "aws_security_group" "rds" {
  name   = "education_rds"
  vpc_id = data.aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "education_rds"
  }
}

resource "aws_db_parameter_group" "education" {
  name   = "education"
  family = "aurora-postgresql11"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

////// RDS AURORA DATABASE
resource "aws_rds_cluster" "aurora_cluster" {
  cluster_identifier            = "aurora-cluster"
  database_name                 = "kaminomimi"
  master_username               = "kaminomimi"
  master_password               = var.aurora_password
  preferred_maintenance_window  = "wed:03:00-wed:04:00"
  availability_zones            = ["ap-northeast-1c", "ap-northeast-1a", "ap-northeast-1d"]
  db_subnet_group_name          = aws_db_subnet_group.main.name
  vpc_security_group_ids        = [aws_security_group.rds.id]
  engine                        = "aurora-postgresql"
  engine_version                = "11.8"
  skip_final_snapshot           = true
}

resource "aws_rds_cluster_instance" "aurora_cluster_instance" {
  count                 = 2

  identifier            = "aurora-instance-${count.index}"
  cluster_identifier    = aws_rds_cluster.aurora_cluster.id
  instance_class        = "db.t3.medium"
  engine                = aws_rds_cluster.aurora_cluster.engine
  engine_version        = aws_rds_cluster.aurora_cluster.engine_version
  db_subnet_group_name  = aws_db_subnet_group.main.name
  publicly_accessible   = true
}

resource "aws_kms_key" "hoang_kaminomimi_project" {
  description             = "deploy enviroment encrypt and decrypt"
  deletion_window_in_days = 7
}

resource "aws_kms_alias" "hoang_kaminomimi_project_key_alias" {
  name          = "alias/hoang-key-alias"
  target_key_id = aws_kms_key.hoang_kaminomimi_project.key_id
}