provider "aws" {
  region                      = "ap-southeast-2"
  access_key                  = "fake"
  secret_key                  = "fake"
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    dynamodb = "http://localhost:4566"
    kinesis  = "http://localhost:4566"
  }
}

// DYNAMODB TABLES
resource "aws_dynamodb_table" "test_dogs" {
  name           = "dogsss"
  read_capacity  = "20"
  write_capacity = "20"
  hash_key       = "ID"

  attribute {
    name = "ID"
    type = "S"
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