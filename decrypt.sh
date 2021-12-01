#!/bin/bash

aws kms decrypt --region ap-northeast-1 --ciphertext-blob fileb://.encrypted/.env --key-id "alias/hoang-key-alias" --output text --query Plaintext | base64 --decode > .envss
