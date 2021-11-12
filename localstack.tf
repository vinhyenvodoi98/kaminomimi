provider "aws" {
  region                      = "ap-southeast-2"
  access_key                  = "fake"
  secret_key                  = "fake"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    kinesis  = "http://localhost:4566"
    lambda   = "http://localhost:4566"
  }
}

// KINESIS STREAMS
resource "aws_kinesis_stream" "test_stream" {
  name = "caughtDogs"
  shard_count = 1
  retention_period = 30

  shard_level_metrics = [
    "IncomingBytes",
    "OutgoingBytes",
  ]
}

// LAMBDA FUNCTIONS
resource "aws_lambda_function" "test_lambda" {
  function_name = "test_lambda"
  filename      = "testLambda.zip"
  handler       = "main.handler"
  role          = "fake_role"
  source_code_hash = filebase64sha256("testLambda.zip")
  runtime       = "nodejs14.x"
  timeout       = 10
  memory_size   = 256
}

// LAMBDA TRIGGERS
resource "aws_lambda_event_source_mapping" "test_lambda_trigger" {
  event_source_arn              = aws_kinesis_stream.test_stream.arn
  function_name                 = "test_lambda"
  batch_size                    = 1
  starting_position             = "LATEST"
  enabled                       = true
  maximum_record_age_in_seconds = 604800
}